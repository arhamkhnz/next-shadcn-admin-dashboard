import type {
  Activity,
  ActivityStatus,
  ActivityType,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import type { Deal, DealStage } from "@/app/(main)/dashboard/crm/deals/_components/deals-data/schema";
import type { Lead, LeadSource } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/schema";

import {
  buildSeriesBuckets,
  daysBetween,
  isWithinWindow,
  reportToday,
  type SeriesBucket,
  safeParseDate,
  type WindowRange,
} from "./report-dates";

export const OPEN_DEAL_STAGES: readonly DealStage[] = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"];
export const CLOSED_DEAL_STAGES: readonly DealStage[] = ["Closed Won", "Closed Lost"];

export const DEAL_STAGE_PROBABILITIES: Readonly<Record<DealStage, number>> = {
  Discovery: 10,
  Qualified: 25,
  "Proposal Sent": 45,
  Negotiation: 70,
  "Closed Won": 100,
  "Closed Lost": 0,
};

export const STALLED_DEAL_DAYS = 14;
export const EXPECTED_CLOSE_HORIZON_DAYS = 30;

export interface ReportAttributeFilters {
  ownerId: string | null;
  stage: DealStage | null;
  source: LeadSource | null;
  companyId: string | null;
}

export interface ReportFilterContext {
  filters: ReportAttributeFilters;
  companyNameById: ReadonlyMap<string, string>;
}

export function isOpenStage(stage: DealStage): boolean {
  return OPEN_DEAL_STAGES.includes(stage);
}

export function weightedValue(deal: Deal): number {
  return deal.value * ((DEAL_STAGE_PROBABILITIES[deal.stage] ?? 0) / 100);
}

function matchesOwner(ownerId: string | null | undefined, filter: string | null): boolean {
  if (filter === null) return true;
  return ownerId === filter;
}

export function filterDealsByAttributes(
  deals: Deal[],
  filters: ReportAttributeFilters,
  options?: { openOnly?: boolean; includeArchived?: boolean },
): Deal[] {
  return deals.filter((deal) => {
    if (!options?.includeArchived && deal.archivedAt) return false;
    if (options?.openOnly && !isOpenStage(deal.stage)) return false;
    if (filters.stage && deal.stage !== filters.stage) return false;
    if (filters.source && deal.source !== filters.source) return false;
    if (filters.companyId && deal.companyId !== filters.companyId) return false;
    return matchesOwner(deal.ownerId, filters.ownerId);
  });
}

export function filterLeadsByAttributes(
  leads: Lead[],
  context: ReportFilterContext,
  options?: { archived?: boolean },
): Lead[] {
  const { filters, companyNameById } = context;
  const companyFilterName = filters.companyId ? (companyNameById.get(filters.companyId) ?? null) : null;
  return leads.filter((lead) => {
    if (options?.archived === undefined) {
      if (lead.archivedAt) return false;
    } else if (options.archived !== Boolean(lead.archivedAt)) {
      return false;
    }
    if (filters.source && lead.source !== filters.source) return false;
    if (companyFilterName && lead.company !== companyFilterName) return false;
    return matchesOwner(lead.ownerId, filters.ownerId);
  });
}

export function filterActivitiesByAttributes(activities: Activity[], filters: ReportAttributeFilters): Activity[] {
  return activities.filter((activity) => {
    if (filters.companyId && activity.companyId !== filters.companyId) return false;
    return matchesOwner(activity.ownerId, filters.ownerId);
  });
}

export function activitiesScheduledInWindow(activities: Activity[], range: WindowRange): Activity[] {
  return activities.filter((activity) => {
    const scheduled = safeParseDate(activity.scheduledAt);
    return scheduled ? isWithinWindow(scheduled, range) : false;
  });
}

export function dealsClosedInWindow(deals: Deal[], range: WindowRange): Deal[] {
  return deals.filter((deal) => {
    const closed = safeParseDate(deal.actualCloseDate);
    return closed ? isWithinWindow(closed, range) : false;
  });
}

export function leadsCreatedInWindow(leads: Lead[], range: WindowRange): Lead[] {
  return leads.filter((lead) => {
    const created = safeParseDate(lead.createdAt);
    return created ? isWithinWindow(created, range) : false;
  });
}

export interface SalesOverviewMetrics {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  wonRevenue: number;
  lostRevenue: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  averageWonDealValue: number | null;
  winRate: number | null;
  averageSalesCycleDays: number | null;
}

export function computeSalesOverviewMetrics(openDeals: Deal[], closedDeals: Deal[]): SalesOverviewMetrics {
  const totalPipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipelineValue = openDeals.reduce((sum, deal) => sum + weightedValue(deal), 0);

  const wonDeals = closedDeals.filter((deal) => deal.stage === "Closed Won");
  const lostDeals = closedDeals.filter((deal) => deal.stage === "Closed Lost");
  const wonRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const lostRevenue = lostDeals.reduce((sum, deal) => sum + deal.value, 0);

  const decidedCount = wonDeals.length + lostDeals.length;
  const winRate = decidedCount > 0 ? (wonDeals.length / decidedCount) * 100 : null;

  const averageWonDealValue =
    wonDeals.length > 0 ? wonDeals.reduce((sum, deal) => sum + deal.value, 0) / wonDeals.length : null;

  const cycleDurations: number[] = [];
  for (const deal of closedDeals) {
    const created = safeParseDate(deal.createdAt);
    const closed = safeParseDate(deal.actualCloseDate);
    if (created && closed) {
      cycleDurations.push(daysBetween(created, closed));
    }
  }
  const averageSalesCycleDays =
    cycleDurations.length > 0 ? cycleDurations.reduce((sum, days) => sum + days, 0) / cycleDurations.length : null;

  return {
    totalPipelineValue,
    weightedPipelineValue,
    wonRevenue,
    lostRevenue,
    openDeals: openDeals.length,
    wonDeals: wonDeals.length,
    lostDeals: lostDeals.length,
    averageWonDealValue,
    winRate,
    averageSalesCycleDays,
  };
}

export interface StageStat {
  stage: DealStage;
  count: number;
  totalValue: number;
  weightedValue: number;
  averageDealAgeDays: number | null;
  conversionToNextStage: number | null;
  conversionInferred: boolean;
}

export function computeStageStats(deals: Deal[]): StageStat[] {
  const allStages: DealStage[] = [...OPEN_DEAL_STAGES, ...CLOSED_DEAL_STAGES];
  const counts = new Map<DealStage, Deal[]>();
  for (const stage of allStages) {
    counts.set(stage, []);
  }
  for (const deal of deals) {
    counts.get(deal.stage)?.push(deal);
  }

  const stageOrderIndex = new Map(allStages.map((stage, index) => [stage, index]));

  return allStages.map((stage, index) => {
    const stageDeals = counts.get(stage) ?? [];
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weighted =
      stage === "Closed Won" || stage === "Closed Lost"
        ? totalValue
        : stageDeals.reduce((sum, deal) => sum + weightedValue(deal), 0);

    const ages: number[] = [];
    for (const deal of stageDeals) {
      const created = safeParseDate(deal.createdAt);
      if (!created) continue;
      const endDate =
        stage === "Closed Won" || stage === "Closed Lost"
          ? (safeParseDate(deal.actualCloseDate) ?? reportToday)
          : reportToday;
      ages.push(daysBetween(created, endDate));
    }
    const averageDealAgeDays = ages.length > 0 ? ages.reduce((sum, age) => sum + age, 0) / ages.length : null;

    let conversionToNextStage: number | null = null;
    let conversionInferred = false;
    if (isOpenStage(stage)) {
      const reachedHere = deals.filter(
        (deal) => (stageOrderIndex.get(deal.stage) ?? -1) >= index && deal.stage !== "Closed Lost",
      );
      const beyond = reachedHere.filter((deal) => (stageOrderIndex.get(deal.stage) ?? -1) > index);
      if (reachedHere.length > 0) {
        conversionToNextStage = (beyond.length / reachedHere.length) * 100;
        conversionInferred = true;
      }
    }

    return {
      stage,
      count: stageDeals.length,
      totalValue,
      weightedValue: weighted,
      averageDealAgeDays,
      conversionToNextStage,
      conversionInferred,
    };
  });
}

export function computeExpectedCloseDeals(openDeals: Deal[]): Deal[] {
  return openDeals.filter((deal) => {
    const expected = safeParseDate(deal.expectedCloseDate);
    if (!expected) return false;
    const horizonEnd = new Date(reportToday);
    horizonEnd.setDate(horizonEnd.getDate() + EXPECTED_CLOSE_HORIZON_DAYS);
    return expected.getTime() >= reportToday.getTime() && expected.getTime() <= horizonEnd.getTime();
  });
}

export function computeOverdueDeals(openDeals: Deal[]): Deal[] {
  return openDeals.filter((deal) => {
    const expected = safeParseDate(deal.expectedCloseDate);
    return expected ? expected.getTime() < reportToday.getTime() : false;
  });
}

export function computeStalledDeals(openDeals: Deal[]): Deal[] {
  return openDeals.filter((deal) => {
    const lastActivity = safeParseDate(deal.lastActivityDate);
    if (!lastActivity) return true;
    return daysBetween(lastActivity, reportToday) > STALLED_DEAL_DAYS;
  });
}

export interface BucketSeriesPoint extends SeriesBucket {
  won: number;
  lost: number;
  wonCount: number;
  lostCount: number;
}

export function buildClosedDealSeries(closedDeals: Deal[], range: WindowRange): BucketSeriesPoint[] {
  return buildSeriesBuckets(range).map((bucket) => {
    const inBucket = closedDeals.filter((deal) => {
      const closed = safeParseDate(deal.actualCloseDate);
      return closed ? isWithinWindow(closed, bucket) : false;
    });
    const won = inBucket.filter((deal) => deal.stage === "Closed Won");
    const lost = inBucket.filter((deal) => deal.stage === "Closed Lost");
    return {
      ...bucket,
      won: won.reduce((sum, deal) => sum + deal.value, 0),
      lost: lost.reduce((sum, deal) => sum + deal.value, 0),
      wonCount: won.length,
      lostCount: lost.length,
    };
  });
}

export interface OwnerSeriesPoint {
  ownerId: string | null;
  label: string;
  value: number;
  count: number;
}

export function buildOwnerValueSeries(
  records: { ownerId: string | null; value: number }[],
  getOwnerName: (ownerId: string) => string,
): OwnerSeriesPoint[] {
  const byOwner = new Map<string, OwnerSeriesPoint>();
  for (const record of records) {
    const key = record.ownerId ?? "unassigned";
    const existing = byOwner.get(key);
    if (existing) {
      existing.value += record.value;
      existing.count += 1;
    } else {
      byOwner.set(key, {
        ownerId: record.ownerId,
        label: record.ownerId ? getOwnerName(record.ownerId) : "Unassigned",
        value: record.value,
        count: 1,
      });
    }
  }
  return [...byOwner.values()].sort((a, b) => b.value - a.value);
}

export interface LeadPerformanceMetrics {
  newLeads: number;
  activeLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  archivedLeads: number;
  conversionRate: number | null;
  averageLeadScore: number | null;
  averageResponseTimeDays: number | null;
}

export function leadResponseTimeDays(lead: Lead): number | null {
  const created = safeParseDate(lead.createdAt);
  const lastActivity = safeParseDate(lead.lastActivity);
  if (!created || !lastActivity) return null;
  return daysBetween(created, lastActivity);
}

export function computeLeadPerformanceMetrics(
  activeLeads: Lead[],
  archivedLeadCount: number,
  newLeadsInRange: number,
): LeadPerformanceMetrics {
  const qualifiedLeads = activeLeads.filter((lead) => lead.status === "Qualified");
  const scores = activeLeads.map((lead) => lead.score).filter((score) => Number.isFinite(score));
  const responseTimes = activeLeads
    .map((lead) => leadResponseTimeDays(lead))
    .filter((days): days is number => days !== null);

  return {
    newLeads: newLeadsInRange,
    activeLeads: activeLeads.length,
    qualifiedLeads: qualifiedLeads.length,
    convertedLeads: qualifiedLeads.length,
    archivedLeads: archivedLeadCount,
    conversionRate: activeLeads.length > 0 ? (qualifiedLeads.length / activeLeads.length) * 100 : null,
    averageLeadScore: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null,
    averageResponseTimeDays:
      responseTimes.length > 0 ? responseTimes.reduce((sum, days) => sum + days, 0) / responseTimes.length : null,
  };
}

export const LEAD_SCORE_BUCKETS: readonly { label: string; min: number; max: number }[] = [
  { label: "0–20", min: 0, max: 20 },
  { label: "21–40", min: 21, max: 40 },
  { label: "41–60", min: 41, max: 60 },
  { label: "61–80", min: 61, max: 80 },
  { label: "81–100", min: 81, max: 100 },
];

export function buildLeadScoreDistribution(leads: Lead[]): { label: string; count: number }[] {
  return LEAD_SCORE_BUCKETS.map((bucket) => ({
    label: bucket.label,
    count: leads.filter((lead) => lead.score >= bucket.min && lead.score <= bucket.max).length,
  }));
}

export interface LeadSourceStat {
  source: LeadSource;
  total: number;
  qualified: number;
  converted: number;
  conversionRate: number | null;
  averageScore: number | null;
  averageResponseTimeDays: number | null;
}

export function computeLeadSourceStats(leads: Lead[]): LeadSourceStat[] {
  const sources = new Map<LeadSource, Lead[]>();
  for (const lead of leads) {
    const list = sources.get(lead.source) ?? [];
    list.push(lead);
    sources.set(lead.source, list);
  }
  return [...sources.entries()]
    .map(([source, sourceLeads]) => {
      const qualified = sourceLeads.filter((lead) => lead.status === "Qualified");
      const scores = sourceLeads.map((lead) => lead.score);
      const responseTimes = sourceLeads
        .map((lead) => leadResponseTimeDays(lead))
        .filter((days): days is number => days !== null);
      return {
        source,
        total: sourceLeads.length,
        qualified: qualified.length,
        converted: qualified.length,
        conversionRate: sourceLeads.length > 0 ? (qualified.length / sourceLeads.length) * 100 : null,
        averageScore: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null,
        averageResponseTimeDays:
          responseTimes.length > 0 ? responseTimes.reduce((sum, days) => sum + days, 0) / responseTimes.length : null,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export function buildLeadCreatedSeries(leads: Lead[], range: WindowRange): { bucket: SeriesBucket; count: number }[] {
  return buildSeriesBuckets(range).map((bucket) => ({
    bucket,
    count: leads.filter((lead) => {
      const created = safeParseDate(lead.createdAt);
      return created ? isWithinWindow(created, bucket) : false;
    }).length,
  }));
}

export interface ActivityPerformanceMetrics {
  totalActivities: number;
  completedActivities: number;
  scheduledActivities: number;
  canceledActivities: number;
  overdueActivities: number;
  taskCompletionRate: number | null;
  callsCompleted: number;
  meetingsCompleted: number;
  averageActivitiesPerDeal: number | null;
}

export function isOverdueActivity(activity: Activity): boolean {
  const activeStatuses: readonly ActivityStatus[] = ["Scheduled", "To Do", "In Progress"];
  if (!activeStatuses.includes(activity.status)) return false;
  const scheduled = safeParseDate(activity.scheduledAt);
  return scheduled ? scheduled.getTime() < reportToday.getTime() : false;
}

export function computeActivityPerformanceMetrics(scopedActivities: Activity[]): ActivityPerformanceMetrics {
  const completed = scopedActivities.filter((activity) => activity.status === "Completed");
  const canceled = scopedActivities.filter((activity) => activity.status === "Canceled");
  const activeStatuses: readonly ActivityStatus[] = ["Scheduled", "To Do", "In Progress"];
  const scheduled = scopedActivities.filter((activity) => activeStatuses.includes(activity.status));
  const overdue = scopedActivities.filter((activity) => isOverdueActivity(activity));

  const tasks = scopedActivities.filter((activity) => activity.type === "Task");
  const completedTasks = tasks.filter((activity) => activity.status === "Completed");

  const dealLinked = scopedActivities.filter((activity) => Boolean(activity.dealId));
  const distinctDeals = new Set(dealLinked.map((activity) => activity.dealId));

  return {
    totalActivities: scopedActivities.length,
    completedActivities: completed.length,
    scheduledActivities: scheduled.length,
    canceledActivities: canceled.length,
    overdueActivities: overdue.length,
    taskCompletionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : null,
    callsCompleted: scopedActivities.filter((activity) => activity.type === "Call" && activity.status === "Completed")
      .length,
    meetingsCompleted: scopedActivities.filter(
      (activity) => activity.type === "Meeting" && activity.status === "Completed",
    ).length,
    averageActivitiesPerDeal: distinctDeals.size > 0 ? dealLinked.length / distinctDeals.size : null,
  };
}

export function buildActivityTypeSeries(activities: Activity[]): { label: ActivityType; count: number }[] {
  const types: ActivityType[] = ["Call", "Meeting", "Email", "Task", "Note"];
  return types.map((type) => ({
    label: type,
    count: activities.filter((activity) => activity.type === type).length,
  }));
}

export function buildActivityStatusSeries(activities: Activity[]): { label: ActivityStatus; count: number }[] {
  const statuses: ActivityStatus[] = ["Scheduled", "To Do", "In Progress", "Completed", "Canceled"];
  return statuses.map((status) => ({
    label: status,
    count: activities.filter((activity) => activity.status === status).length,
  }));
}

export function buildActivityTimeSeries(
  activities: Activity[],
  range: WindowRange,
): { bucket: SeriesBucket; count: number; completed: number }[] {
  return buildSeriesBuckets(range).map((bucket) => {
    const inBucket = activities.filter((activity) => {
      const scheduled = safeParseDate(activity.scheduledAt);
      return scheduled ? isWithinWindow(scheduled, bucket) : false;
    });
    return {
      bucket,
      count: inBucket.length,
      completed: inBucket.filter((activity) => activity.status === "Completed").length,
    };
  });
}

export interface ActivityOwnerStat {
  ownerId: string | null;
  label: string;
  total: number;
  calls: number;
  meetings: number;
  tasks: number;
  completed: number;
  overdue: number;
  canceled: number;
  completionRate: number | null;
}

export function computeActivityOwnerStats(activities: Activity[]): ActivityOwnerStat[] {
  const byOwner = new Map<string, Activity[]>();
  for (const activity of activities) {
    const key = activity.ownerId ?? "unassigned";
    const list = byOwner.get(key) ?? [];
    list.push(activity);
    byOwner.set(key, list);
  }
  return [...byOwner.entries()]
    .map(([key, ownerActivities]) => {
      const completed = ownerActivities.filter((activity) => activity.status === "Completed").length;
      return {
        ownerId: key === "unassigned" ? null : key,
        label: key === "unassigned" ? "Unassigned" : key,
        total: ownerActivities.length,
        calls: ownerActivities.filter((activity) => activity.type === "Call").length,
        meetings: ownerActivities.filter((activity) => activity.type === "Meeting").length,
        tasks: ownerActivities.filter((activity) => activity.type === "Task").length,
        completed,
        overdue: ownerActivities.filter((activity) => isOverdueActivity(activity)).length,
        canceled: ownerActivities.filter((activity) => activity.status === "Canceled").length,
        completionRate: ownerActivities.length > 0 ? (completed / ownerActivities.length) * 100 : null,
      };
    })
    .sort((a, b) => b.completed - a.completed);
}

export interface TeamOwnerRow {
  ownerId: string;
  name: string;
  assignedLeads: number;
  openDeals: number;
  pipelineValue: number;
  wonRevenue: number;
  winRate: number | null;
  activitiesCompleted: number;
  overdueTasks: number;
  averageDealValue: number | null;
}

export function computeTeamRows(input: {
  owners: { id: string; name: string }[];
  activeLeads: Lead[];
  openDeals: Deal[];
  closedDeals: Deal[];
  scopedActivities: Activity[];
}): TeamOwnerRow[] {
  const { owners, activeLeads, openDeals, closedDeals, scopedActivities } = input;

  return owners.map((owner) => {
    const ownerLeads = activeLeads.filter((lead) => lead.ownerId === owner.id);
    const ownerOpenDeals = openDeals.filter((deal) => deal.ownerId === owner.id);
    const ownerClosed = closedDeals.filter((deal) => deal.ownerId === owner.id);
    const ownerWon = ownerClosed.filter((deal) => deal.stage === "Closed Won");
    const ownerLost = ownerClosed.filter((deal) => deal.stage === "Closed Lost");
    const decided = ownerWon.length + ownerLost.length;
    const ownerActivities = scopedActivities.filter((activity) => activity.ownerId === owner.id);

    return {
      ownerId: owner.id,
      name: owner.name,
      assignedLeads: ownerLeads.length,
      openDeals: ownerOpenDeals.length,
      pipelineValue: ownerOpenDeals.reduce((sum, deal) => sum + deal.value, 0),
      wonRevenue: ownerWon.reduce((sum, deal) => sum + deal.value, 0),
      winRate: decided > 0 ? (ownerWon.length / decided) * 100 : null,
      activitiesCompleted: ownerActivities.filter((activity) => activity.status === "Completed").length,
      overdueTasks: ownerActivities.filter((activity) => activity.type === "Task" && isOverdueActivity(activity))
        .length,
      averageDealValue:
        ownerWon.length > 0 ? ownerWon.reduce((sum, deal) => sum + deal.value, 0) / ownerWon.length : null,
    };
  });
}

export type ComparisonKind = "up" | "down" | "flat" | "new" | "no-data";

export interface ComparisonResult {
  kind: ComparisonKind;
  label: string;
}

export function compareMetric(current: number | null, previous: number | null): ComparisonResult {
  if (current === null || previous === null || !Number.isFinite(current) || !Number.isFinite(previous)) {
    return { kind: "no-data", label: "No prior data" };
  }
  if (previous === 0) {
    if (current === 0) return { kind: "flat", label: "No change" };
    return { kind: "new", label: "New this period" };
  }
  const changePercent = ((current - previous) / previous) * 100;
  if (!Number.isFinite(changePercent)) {
    return { kind: "no-data", label: "No prior data" };
  }
  if (Math.abs(changePercent) < 0.05) {
    return { kind: "flat", label: "No change" };
  }
  return {
    kind: changePercent > 0 ? "up" : "down",
    label: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
  };
}
