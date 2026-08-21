import { differenceInCalendarDays, endOfDay, format, startOfDay } from "date-fns";

import { formatCurrency } from "@/lib/utils";

import type { Company } from "../../companies/_components/companies-data/schema";
import type { Contact } from "../../contacts/_components/contacts-data/schema";
import type { Deal, DealStage } from "../../deals/_components/deals-data/schema";
import type { Lead } from "../../leads/_components/leads-data/schema";
import type { WindowRange } from "../../reports/_components/report-data/report-dates";
import {
  daysBetween,
  isWithinWindow,
  reportToday,
  safeParseDate,
} from "../../reports/_components/report-data/report-dates";
import {
  type ComparisonResult,
  compareMetric,
  type SalesOverviewMetrics,
  STALLED_DEAL_DAYS,
} from "../../reports/_components/report-data/report-selectors";
import type { Activity, ActivityPriority, ActivityStatus, ActivityType } from "../activities/activity-schema";
import { getTaskDueAt, isActiveStatus, isTaskActivity } from "../activities/activity-utils";

export const START_OF_TODAY = startOfDay(reportToday);
export const END_OF_TODAY = endOfDay(reportToday);

const HOT_LEAD_SCORE = 75;
const HIGH_VALUE_DEAL_THRESHOLD = 50000;
const UPCOMING_HIGH_PRIORITY_WINDOW_DAYS = 7;

const ACTIVITY_PRIORITY_RANK: Record<ActivityPriority, number> = { Urgent: 3, High: 2, Medium: 1, Low: 0 };

const UNSCHEDULED_TYPE_ORDER: Record<ActivityType, number> = { Meeting: 0, Call: 1, Task: 2, Email: 3, Note: 4 };

type ScheduleState = "Overdue" | "Due Today" | "Upcoming" | null;

function effectiveScheduleDate(activity: Activity): Date | null {
  return safeParseDate(isTaskActivity(activity) ? getTaskDueAt(activity) : activity.scheduledAt);
}

function scheduleStateFor(activity: Activity): ScheduleState {
  if (!isActiveStatus(activity.status)) return null;
  const scheduled = effectiveScheduleDate(activity);
  if (!scheduled) return null;
  if (scheduled.getTime() < START_OF_TODAY.getTime()) return "Overdue";
  if (scheduled.getTime() <= END_OF_TODAY.getTime()) return "Due Today";
  return "Upcoming";
}

export interface RelatedRecordNames {
  companyNameById: ReadonlyMap<string, string>;
  contactNameById: ReadonlyMap<string, string>;
  leadNameById: ReadonlyMap<string, string>;
  dealNameById: ReadonlyMap<string, string>;
}

export function resolveRelatedTarget(
  activity: Pick<Activity, "companyId" | "contactId" | "leadId" | "dealId">,
  names: RelatedRecordNames,
): { name: string | null; href: string | null } {
  if (activity.companyId) {
    return {
      name: names.companyNameById.get(activity.companyId) ?? null,
      href: `/dashboard/crm/companies/${activity.companyId}`,
    };
  }
  if (activity.dealId) {
    return {
      name: names.dealNameById.get(activity.dealId) ?? null,
      href: `/dashboard/crm/deals/${activity.dealId}`,
    };
  }
  if (activity.contactId) {
    return {
      name: names.contactNameById.get(activity.contactId) ?? null,
      href: `/dashboard/crm/contacts/${activity.contactId}`,
    };
  }
  if (activity.leadId) {
    return {
      name: names.leadNameById.get(activity.leadId) ?? null,
      href: `/dashboard/crm/leads/${activity.leadId}`,
    };
  }
  return { name: null, href: null };
}

export function relativeDayLabel(date: Date): string {
  const diff = differenceInCalendarDays(START_OF_TODAY, startOfDay(date));
  if (diff === 0) return `Today · ${format(date, "h:mm a")}`;
  if (diff === 1) return `Yesterday · ${format(date, "h:mm a")}`;
  if (diff > 1 && diff < 30) return `${diff} days ago`;
  return format(date, "MMM d, yyyy");
}

function upcomingDayLabel(date: Date): string {
  const diff = differenceInCalendarDays(startOfDay(date), START_OF_TODAY);
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export interface OverviewKpi {
  id: string;
  label: string;
  value: string;
  caption: string;
  comparison?: ComparisonResult;
  href: string;
  linkLabel: string;
}

export function buildOverviewKpis(input: {
  activeLeads: Lead[];
  currentMetrics: SalesOverviewMetrics;
  previousMetrics: SalesOverviewMetrics;
  scopedActivities: Activity[];
}): OverviewKpi[] {
  const { activeLeads, currentMetrics, previousMetrics, scopedActivities } = input;

  const tasksDueToday = scopedActivities.filter(
    (activity) =>
      isTaskActivity(activity) && isActiveStatus(activity.status) && scheduleStateFor(activity) === "Due Today",
  ).length;
  const overdueTasks = scopedActivities.filter(
    (activity) =>
      isTaskActivity(activity) && isActiveStatus(activity.status) && scheduleStateFor(activity) === "Overdue",
  ).length;
  const upcomingActivities = scopedActivities.filter((activity) => {
    if (isTaskActivity(activity) || !isActiveStatus(activity.status)) return false;
    const scheduled = safeParseDate(activity.scheduledAt);
    return scheduled ? scheduled.getTime() > END_OF_TODAY.getTime() : false;
  }).length;

  return [
    {
      id: "active-leads",
      label: "Active Leads",
      value: String(activeLeads.length),
      caption: "Non-archived leads · live snapshot",
      href: "/dashboard/crm/leads",
      linkLabel: "View leads",
    },
    {
      id: "open-deals",
      label: "Open Deals",
      value: String(currentMetrics.openDeals),
      caption: "Discovery through Negotiation · live snapshot",
      href: "/dashboard/crm/deals",
      linkLabel: "View deals",
    },
    {
      id: "pipeline-value",
      label: "Pipeline Value",
      value: formatCurrency(currentMetrics.totalPipelineValue),
      caption: "Sum of open deal values",
      href: "/dashboard/crm/reports",
      linkLabel: "View pipeline report",
    },
    {
      id: "weighted-pipeline",
      label: "Weighted Pipeline",
      value: formatCurrency(currentMetrics.weightedPipelineValue),
      caption: "Deal value × stage probability",
      href: "/dashboard/crm/reports",
      linkLabel: "View forecast",
    },
    {
      id: "won-revenue",
      label: "Won Revenue",
      value: formatCurrency(currentMetrics.wonRevenue),
      caption: "Closed-won value this period",
      comparison: compareMetric(currentMetrics.wonRevenue, previousMetrics.wonRevenue),
      href: "/dashboard/crm/reports",
      linkLabel: "View sales report",
    },
    {
      id: "tasks-due-today",
      label: "Tasks Due Today",
      value: String(tasksDueToday),
      caption: "Open tasks scheduled for today",
      href: "/dashboard/tasks",
      linkLabel: "Open tasks",
    },
    {
      id: "overdue-tasks",
      label: "Overdue Tasks",
      value: String(overdueTasks),
      caption: "Past due and still open",
      href: "/dashboard/tasks?view=overdue",
      linkLabel: "Review overdue tasks",
    },
    {
      id: "upcoming-activities",
      label: "Upcoming Activities",
      value: String(upcomingActivities),
      caption: "Calls, meetings, and emails after today",
      href: "/dashboard/crm/activities",
      linkLabel: "View activities",
    },
  ];
}

// ---------------------------------------------------------------------------
// Attention queue
// ---------------------------------------------------------------------------

export type AttentionEntityType = "Task" | "Activity" | "Deal" | "Lead";

export interface AttentionItem {
  key: string;
  id: string;
  tier: number;
  sortKey: number;
  reason: string;
  title: string;
  entityType: AttentionEntityType;
  ownerId: string | null;
  dateLabel: string | null;
  priorityLabel: string | null;
  href: string;
  actionLabel: string;
}

export function buildAttentionQueue(input: {
  scopedActivities: Activity[];
  openDeals: Deal[];
  activeLeads: Lead[];
}): AttentionItem[] {
  const { scopedActivities, openDeals, activeLeads } = input;
  const items: AttentionItem[] = [];

  for (const activity of scopedActivities) {
    if (!isActiveStatus(activity.status)) continue;
    const isTask = isTaskActivity(activity);
    const scheduled = effectiveScheduleDate(activity);
    if (!scheduled) continue;
    const state = scheduleStateFor(activity);
    const entityType: AttentionEntityType = isTask ? "Task" : "Activity";
    const base = {
      key: `${entityType}:${activity.id}`,
      id: activity.id,
      title: activity.title,
      entityType,
      ownerId: activity.ownerId,
      priorityLabel: activity.priority,
      href: isTask ? `/dashboard/crm/tasks/${activity.id}` : `/dashboard/crm/activities/${activity.id}`,
      actionLabel: isTask ? "Open task" : "Open activity",
    };

    if (state === "Overdue") {
      const urgent = activity.priority === "Urgent" || activity.priority === "High";
      items.push({
        ...base,
        tier: urgent ? 0 : 1,
        sortKey: scheduled.getTime() - ACTIVITY_PRIORITY_RANK[activity.priority] * 1000,
        reason: urgent ? `Overdue ${activity.priority.toLowerCase()} priority` : "Overdue",
        dateLabel: `Was due ${format(scheduled, "MMM d")}`,
      });
    } else if (state === "Due Today") {
      items.push({
        ...base,
        tier: 3,
        sortKey: scheduled.getTime(),
        reason: isTask ? "Task due today" : "Scheduled today",
        dateLabel:
          scheduled.getHours() === 0 && scheduled.getMinutes() === 0 ? "Any time today" : format(scheduled, "h:mm a"),
      });
    } else if (
      !isTask &&
      (activity.priority === "Urgent" || activity.priority === "High") &&
      scheduled.getTime() <= END_OF_TODAY.getTime() + UPCOMING_HIGH_PRIORITY_WINDOW_DAYS * 86400000
    ) {
      items.push({
        ...base,
        tier: 5,
        sortKey: scheduled.getTime(),
        reason: `${activity.priority} priority ${activity.type.toLowerCase()} coming up`,
        dateLabel: format(scheduled, "EEE, MMM d · h:mm a"),
      });
    }
  }

  for (const deal of openDeals) {
    const expected = safeParseDate(deal.expectedCloseDate);
    if (expected && expected.getTime() < START_OF_TODAY.getTime()) {
      items.push({
        key: `Deal:${deal.id}:overdue`,
        id: deal.id,
        tier: 2,
        sortKey: expected.getTime(),
        reason: "Past expected close date",
        title: deal.name,
        entityType: "Deal",
        ownerId: deal.ownerId,
        dateLabel: `Expected ${format(expected, "MMM d")}`,
        priorityLabel: deal.priority,
        href: `/dashboard/crm/deals/${deal.id}`,
        actionLabel: "Open deal",
      });
    }

    const alreadyFlagged = items.some((item) => item.entityType === "Deal" && item.id === deal.id);
    if (!alreadyFlagged) {
      const lastActivity = safeParseDate(deal.lastActivityDate);
      const idleDays = lastActivity ? daysBetween(lastActivity, reportToday) : null;
      if (idleDays === null || idleDays > STALLED_DEAL_DAYS) {
        items.push({
          key: `Deal:${deal.id}:stalled`,
          id: deal.id,
          tier: 6,
          sortKey: lastActivity ? lastActivity.getTime() : 0,
          reason: lastActivity ? `No activity in ${idleDays} days` : "No recorded activity",
          title: deal.name,
          entityType: "Deal",
          ownerId: deal.ownerId,
          dateLabel: lastActivity ? `Last touch ${format(lastActivity, "MMM d")}` : null,
          priorityLabel: deal.priority,
          href: `/dashboard/crm/deals/${deal.id}`,
          actionLabel: "Open deal",
        });
      }
    }

    if (!deal.ownerId) {
      items.push({
        key: `Deal:${deal.id}:unassigned`,
        id: deal.id,
        tier: 4,
        sortKey: -deal.value,
        reason: "Unassigned open deal",
        title: deal.name,
        entityType: "Deal",
        ownerId: null,
        dateLabel: formatCurrency(deal.value),
        priorityLabel: deal.priority,
        href: `/dashboard/crm/deals/${deal.id}`,
        actionLabel: "Assign owner",
      });
    }
  }

  for (const lead of activeLeads) {
    const nextActivity = safeParseDate(lead.nextActivity);
    if (nextActivity && nextActivity.getTime() < START_OF_TODAY.getTime()) {
      items.push({
        key: `Lead:${lead.id}:follow-up`,
        id: lead.id,
        tier: 1,
        sortKey: nextActivity.getTime(),
        reason: "Follow-up overdue",
        title: lead.name,
        entityType: "Lead",
        ownerId: lead.ownerId,
        dateLabel: `Was due ${format(nextActivity, "MMM d")}`,
        priorityLabel: null,
        href: `/dashboard/crm/leads/${lead.id}`,
        actionLabel: "Open lead",
      });
      continue;
    }

    if (!lead.ownerId) {
      items.push({
        key: `Lead:${lead.id}:unassigned`,
        id: lead.id,
        tier: 4,
        sortKey: -lead.score,
        reason: "Unassigned lead",
        title: lead.name,
        entityType: "Lead",
        ownerId: null,
        dateLabel: `Score ${lead.score}`,
        priorityLabel: null,
        href: `/dashboard/crm/leads/${lead.id}`,
        actionLabel: "Assign owner",
      });
      continue;
    }

    const lastActivity = safeParseDate(lead.lastActivity);
    if (lead.score >= HOT_LEAD_SCORE && lastActivity && daysBetween(lastActivity, reportToday) > STALLED_DEAL_DAYS) {
      items.push({
        key: `Lead:${lead.id}:hot-stale`,
        id: lead.id,
        tier: 7,
        sortKey: -lead.score,
        reason: "Hot lead going cold",
        title: lead.name,
        entityType: "Lead",
        ownerId: lead.ownerId,
        dateLabel: `Last touch ${format(lastActivity, "MMM d")}`,
        priorityLabel: null,
        href: `/dashboard/crm/leads/${lead.id}`,
        actionLabel: "Open lead",
      });
    }
  }

  const deduped = new Map<string, AttentionItem>();
  for (const item of items) {
    const existing = deduped.get(item.key.split(":").slice(0, 2).join(":"));
    if (!existing || item.tier < existing.tier) {
      deduped.set(item.key.split(":").slice(0, 2).join(":"), item);
    }
  }

  return [...deduped.values()].sort(
    (a, b) => a.tier - b.tier || a.sortKey - b.sortKey || a.title.localeCompare(b.title),
  );
}

// ---------------------------------------------------------------------------
// Today schedule
// ---------------------------------------------------------------------------

export interface TodayItem {
  key: string;
  kind: "task" | "activity";
  timeLabel: string;
  sortTime: number;
  type: ActivityType;
  title: string;
  ownerId: string | null;
  status: ActivityStatus;
  priority: ActivityPriority;
  relatedName: string | null;
  relatedHref: string | null;
  detailHref: string;
  canComplete: boolean;
  canStart: boolean;
  canReschedule: boolean;
}

export function buildTodaySchedule(input: { scopedActivities: Activity[]; names: RelatedRecordNames }): {
  timed: TodayItem[];
  unscheduled: TodayItem[];
} {
  const timed: TodayItem[] = [];
  const unscheduled: TodayItem[] = [];

  for (const activity of input.scopedActivities) {
    if (!isActiveStatus(activity.status)) continue;
    if (scheduleStateFor(activity) !== "Due Today") continue;
    const scheduled = effectiveScheduleDate(activity);
    if (!scheduled) continue;
    const isTask = isTaskActivity(activity);
    const related = resolveRelatedTarget(activity, input.names);
    const hasTime = scheduled.getHours() !== 0 || scheduled.getMinutes() !== 0;
    const item: TodayItem = {
      key: activity.id,
      kind: isTask ? "task" : "activity",
      timeLabel: hasTime ? format(scheduled, "h:mm a") : "Any time",
      sortTime: hasTime ? scheduled.getTime() : UNSCHEDULED_TYPE_ORDER[activity.type] * 1000000,
      type: activity.type,
      title: activity.title,
      ownerId: activity.ownerId,
      status: activity.status,
      priority: activity.priority,
      relatedName: related.name,
      relatedHref: related.href,
      detailHref: isTask ? `/dashboard/crm/tasks/${activity.id}` : `/dashboard/crm/activities/${activity.id}`,
      canComplete: true,
      canStart: !isTask && activity.type !== "Note" && activity.status === "Scheduled",
      canReschedule: activity.status === "Scheduled" || activity.status === "To Do",
    };
    if (hasTime) {
      timed.push(item);
    } else {
      unscheduled.push(item);
    }
  }

  timed.sort((a, b) => a.sortTime - b.sortTime || a.title.localeCompare(b.title));
  unscheduled.sort((a, b) => a.sortTime - b.sortTime || a.title.localeCompare(b.title));
  return { timed, unscheduled };
}

// ---------------------------------------------------------------------------
// Upcoming activities
// ---------------------------------------------------------------------------

export interface UpcomingItem {
  key: string;
  dateLabel: string;
  dayLabel: string;
  type: ActivityType;
  title: string;
  ownerId: string | null;
  relatedName: string | null;
  detailHref: string;
}

export function buildUpcomingActivities(input: {
  scopedActivities: Activity[];
  names: RelatedRecordNames;
  limit?: number;
}): UpcomingItem[] {
  const items: UpcomingItem[] = [];
  for (const activity of input.scopedActivities) {
    if (isTaskActivity(activity) || !isActiveStatus(activity.status)) continue;
    const scheduled = safeParseDate(activity.scheduledAt);
    if (!scheduled || scheduled.getTime() <= END_OF_TODAY.getTime()) continue;
    const related = resolveRelatedTarget(activity, input.names);
    items.push({
      key: activity.id,
      dateLabel: format(scheduled, "EEE, MMM d · h:mm a"),
      dayLabel: upcomingDayLabel(scheduled),
      type: activity.type,
      title: activity.title,
      ownerId: activity.ownerId,
      relatedName: related.name,
      detailHref: `/dashboard/crm/activities/${activity.id}`,
    });
  }
  return items.sort((a, b) => a.dateLabel.localeCompare(b.dateLabel)).slice(0, input.limit ?? 6);
}

// ---------------------------------------------------------------------------
// Overdue tasks
// ---------------------------------------------------------------------------

export interface OverdueTaskItem {
  key: string;
  title: string;
  dueLabel: string;
  daysOverdue: number;
  priority: ActivityPriority;
  ownerId: string | null;
  relatedName: string | null;
  detailHref: string;
}

export function buildOverdueTasks(input: {
  scopedActivities: Activity[];
  names: RelatedRecordNames;
  limit?: number;
}): OverdueTaskItem[] {
  const items: OverdueTaskItem[] = [];
  for (const activity of input.scopedActivities) {
    if (!isTaskActivity(activity) || !isActiveStatus(activity.status)) continue;
    if (scheduleStateFor(activity) !== "Overdue") continue;
    const due = effectiveScheduleDate(activity);
    if (!due) continue;
    const related = resolveRelatedTarget(activity, input.names);
    items.push({
      key: activity.id,
      title: activity.title,
      dueLabel: format(due, "MMM d"),
      daysOverdue: Math.max(1, differenceInCalendarDays(START_OF_TODAY, startOfDay(due))),
      priority: activity.priority,
      ownerId: activity.ownerId,
      relatedName: related.name,
      detailHref: `/dashboard/crm/tasks/${activity.id}`,
    });
  }
  return items.sort((a, b) => b.daysOverdue - a.daysOverdue).slice(0, input.limit ?? 6);
}

// ---------------------------------------------------------------------------
// Deals requiring attention
// ---------------------------------------------------------------------------

export interface DealAttentionRow {
  key: string;
  dealId: string;
  name: string;
  companyName: string | null;
  stage: DealStage;
  valueLabel: string;
  reason: string;
  severity: number;
  ownerId: string | null;
  detailHref: string;
}

export function buildDealsRequiringAttention(input: {
  openDeals: Deal[];
  companyNames: ReadonlyMap<string, string>;
  limit?: number;
}): DealAttentionRow[] {
  const rows: DealAttentionRow[] = [];
  for (const deal of input.openDeals) {
    const expected = safeParseDate(deal.expectedCloseDate);
    const lastActivity = safeParseDate(deal.lastActivityDate);
    const idleDays = lastActivity ? daysBetween(lastActivity, reportToday) : null;
    const nextActivity = safeParseDate(deal.nextActivityDate);

    let severity: number | null = null;
    let reason = "";
    if (expected && expected.getTime() < START_OF_TODAY.getTime()) {
      severity = 0;
      reason = `Past expected close (${format(expected, "MMM d")})`;
    } else if (deal.health === "At Risk") {
      severity = 1;
      reason = "Health flagged At Risk";
    } else if (idleDays === null || idleDays > STALLED_DEAL_DAYS) {
      severity = 2;
      reason = lastActivity ? `No activity in ${idleDays} days` : "No recorded activity";
    } else if (deal.value >= HIGH_VALUE_DEAL_THRESHOLD && !nextActivity) {
      severity = 3;
      reason = "High-value deal without a next step";
    }
    if (severity === null) continue;

    rows.push({
      key: deal.id,
      dealId: deal.id,
      name: deal.name,
      companyName: input.companyNames.get(deal.companyId) ?? null,
      stage: deal.stage,
      valueLabel: formatCurrency(deal.value),
      reason,
      severity,
      ownerId: deal.ownerId,
      detailHref: `/dashboard/crm/deals/${deal.id}`,
    });
  }
  return rows.sort((a, b) => a.severity - b.severity || a.name.localeCompare(b.name)).slice(0, input.limit ?? 6);
}

// ---------------------------------------------------------------------------
// Leads needing follow-up
// ---------------------------------------------------------------------------

export interface LeadFollowupRow {
  key: string;
  leadId: string;
  name: string;
  company: string | null;
  score: number;
  reason: string;
  severity: number;
  ownerId: string | null;
  nextActivityLabel: string | null;
  detailHref: string;
}

export function buildLeadsNeedingFollowUp(input: { activeLeads: Lead[]; limit?: number }): LeadFollowupRow[] {
  const rows: LeadFollowupRow[] = [];
  for (const lead of input.activeLeads) {
    const nextActivity = safeParseDate(lead.nextActivity);
    const lastActivity = safeParseDate(lead.lastActivity);

    let severity: number | null = null;
    let reason = "";
    const nextActivityLabel: string | null = null;
    if (nextActivity && nextActivity.getTime() < START_OF_TODAY.getTime()) {
      severity = 0;
      reason = `Follow-up overdue (${format(nextActivity, "MMM d")})`;
    } else if (!lead.ownerId) {
      severity = 1;
      reason = "Waiting for an owner";
    } else if (
      lead.score >= HOT_LEAD_SCORE &&
      lastActivity &&
      daysBetween(lastActivity, reportToday) > STALLED_DEAL_DAYS
    ) {
      severity = 2;
      reason = `Hot lead, no touch since ${format(lastActivity, "MMM d")}`;
    }
    if (severity === null) continue;

    rows.push({
      key: lead.id,
      leadId: lead.id,
      name: lead.name,
      company: lead.company ?? null,
      score: lead.score,
      reason,
      severity,
      ownerId: lead.ownerId,
      nextActivityLabel,
      detailHref: `/dashboard/crm/leads/${lead.id}`,
    });
  }
  return rows.sort((a, b) => a.severity - b.severity || b.score - a.score).slice(0, input.limit ?? 6);
}

// ---------------------------------------------------------------------------
// Recent activity feed
// ---------------------------------------------------------------------------

export type RecentEventEntity = "Lead" | "Contact" | "Company" | "Deal" | "Activity" | "Task";

export interface RecentEvent {
  key: string;
  action: string;
  description: string;
  entityType: RecentEventEntity;
  ownerId: string | null;
  at: Date;
  timeLabel: string;
  href: string;
}

interface EventCandidate {
  key: string;
  action: string;
  description: string;
  entityType: RecentEventEntity;
  ownerId: string | null;
  at: Date;
  href: string;
}

export function buildRecentEvents(input: {
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  scopedActivities: Activity[];
  range: WindowRange;
  limit?: number;
}): RecentEvent[] {
  const candidates: EventCandidate[] = [];

  const push = (candidate: EventCandidate) => {
    if (isWithinWindow(candidate.at, input.range)) {
      candidates.push(candidate);
    }
  };

  for (const lead of input.leads) {
    const createdAt = safeParseDate(lead.createdAt);
    if (createdAt) {
      push({
        key: `lead-created:${lead.id}`,
        action: "Lead created",
        description: lead.name,
        entityType: "Lead",
        ownerId: lead.ownerId,
        at: createdAt,
        href: `/dashboard/crm/leads/${lead.id}`,
      });
    }
  }

  for (const contact of input.contacts) {
    const createdAt = safeParseDate(contact.createdAt);
    if (createdAt) {
      push({
        key: `contact-created:${contact.id}`,
        action: "Contact created",
        description: contact.name,
        entityType: "Contact",
        ownerId: contact.ownerId ?? null,
        at: createdAt,
        href: `/dashboard/crm/contacts/${contact.id}`,
      });
    }
  }

  for (const company of input.companies) {
    const createdAt = safeParseDate(company.createdAt);
    if (createdAt) {
      push({
        key: `company-created:${company.id}`,
        action: "Company created",
        description: company.name,
        entityType: "Company",
        ownerId: company.ownerId ?? null,
        at: createdAt,
        href: `/dashboard/crm/companies/${company.id}`,
      });
    }
  }

  for (const deal of input.deals) {
    const createdAt = safeParseDate(deal.createdAt);
    if (createdAt) {
      push({
        key: `deal-created:${deal.id}`,
        action: "Deal created",
        description: deal.name,
        entityType: "Deal",
        ownerId: deal.ownerId,
        at: createdAt,
        href: `/dashboard/crm/deals/${deal.id}`,
      });
    }
    const closed = safeParseDate(deal.actualCloseDate);
    if (closed) {
      const won = deal.stage === "Closed Won";
      push({
        key: `deal-closed:${deal.id}`,
        action: won ? "Deal won" : "Deal lost",
        description: `${deal.name} · ${formatCurrency(deal.value)}`,
        entityType: "Deal",
        ownerId: deal.ownerId,
        at: closed,
        href: `/dashboard/crm/deals/${deal.id}`,
      });
    }
    const archived = safeParseDate(deal.archivedAt ?? null);
    if (archived) {
      push({
        key: `deal-archived:${deal.id}`,
        action: "Deal archived",
        description: deal.name,
        entityType: "Deal",
        ownerId: deal.ownerId,
        at: archived,
        href: `/dashboard/crm/deals/${deal.id}`,
      });
    }
    for (const entry of deal.activities) {
      if (entry.type !== "status_change") continue;
      const at = safeParseDate(entry.date);
      if (!at) continue;
      push({
        key: `deal-stage:${deal.id}:${entry.id}`,
        action: entry.title,
        description: deal.name,
        entityType: "Deal",
        ownerId: deal.ownerId,
        at,
        href: `/dashboard/crm/deals/${deal.id}`,
      });
    }
  }

  for (const activity of input.scopedActivities) {
    if (!activity.completedAt) continue;
    const completed = safeParseDate(activity.completedAt);
    if (!completed) continue;
    const isTask = isTaskActivity(activity);
    push({
      key: `activity-completed:${activity.id}`,
      action: isTask ? "Task completed" : "Activity completed",
      description: activity.title,
      entityType: isTask ? "Task" : "Activity",
      ownerId: activity.ownerId,
      at: completed,
      href: isTask ? `/dashboard/crm/tasks/${activity.id}` : `/dashboard/crm/activities/${activity.id}`,
    });
  }

  return candidates
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, input.limit ?? 12)
    .map((candidate) => ({ ...candidate, timeLabel: relativeDayLabel(candidate.at) }));
}
