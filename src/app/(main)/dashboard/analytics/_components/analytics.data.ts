import { differenceInCalendarDays, eachDayOfInterval, format, parseISO, startOfDay, subDays } from "date-fns";

export type RiskView = "risk-view" | "momentum" | "quality";

interface AnalyticsFilters {
  from: string;
  to: string;
  enterpriseOnly: boolean;
  stalledOnly: boolean;
  overdueOnly: boolean;
  includeRenewals: boolean;
}

interface TrendPoint {
  period: string;
  closedWon: number;
  weightedPipeline: number;
  target: number;
}

export interface RiskDealRow {
  dealId: string;
  account: string;
  owner: string;
  amount: number;
  stage: string;
  daysInStage: number;
  lastActivityDays: number;
  closeVarianceDays: number;
  riskScore: number;
  nextAction: string;
}

export interface ActionQueueItem {
  priority: "Escalate" | "Coach" | "Reforecast" | "No action";
  owner: string;
  dealId: string;
  reason: string;
  recommendation: string;
}

interface Opportunity {
  id: string;
  accountId: string;
  ownerId: string;
  amount: number;
  stage: keyof typeof STAGE_THRESHOLDS;
  probability: number;
  createdAt: string;
  expectedCloseDate: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  region: "East" | "West" | "Central";
  isRenewal: boolean;
}

interface OpportunityDailySnapshot {
  opportunityId: string;
  snapshotDate: string;
  stage: Opportunity["stage"];
  amount: number;
  probability: number;
  daysInStage: number;
  lastActivityAt: string;
}

interface Activity {
  opportunityId: string;
  activityType: "call" | "email" | "meeting" | "demo" | "proposal";
  occurredAt: string;
}

interface ClosedDeal {
  opportunityId: string;
  outcome: "won" | "lost";
  closedAt: string;
  amount: number;
  cycleDays: number;
}

interface SalesUser {
  ownerId: string;
  name: string;
  managerId: string;
  team: string;
}

interface OpportunityContext {
  opportunity: Opportunity;
  ownerName: string;
  daysInStage: number;
  lastActivityDays: number;
  isOverdue: boolean;
  closeVarianceDays: number;
  riskScore: number;
  atRisk: boolean;
  nextAction: string;
  reason: string;
}

const DATA_ANCHOR = startOfDay(new Date());

const STAGE_THRESHOLDS = {
  Prospecting: 10,
  Qualification: 14,
  Proposal: 16,
  Negotiation: 18,
  Legal: 12,
} as const;

const STAGE_PROBABILITY_BENCHMARK = {
  Prospecting: 0.22,
  Qualification: 0.35,
  Proposal: 0.5,
  Negotiation: 0.65,
  Legal: 0.75,
} as const;

const PRIORITY_ORDER: Record<ActionQueueItem["priority"], number> = {
  Escalate: 0,
  Coach: 1,
  Reforecast: 2,
  "No action": 3,
};

const USERS: SalesUser[] = [
  { ownerId: "u1", name: "Maya Chen", managerId: "m1", team: "Enterprise" },
  { ownerId: "u2", name: "Andre Silva", managerId: "m1", team: "Growth" },
  { ownerId: "u3", name: "Rina Patel", managerId: "m2", team: "SMB" },
  { ownerId: "u4", name: "Leo Martinez", managerId: "m2", team: "Strategic" },
];

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "OPP-421",
    accountId: "Acme Industries",
    ownerId: "u1",
    amount: 120_000,
    stage: "Negotiation",
    probability: 0.62,
    createdAt: "2025-11-22",
    expectedCloseDate: "2026-02-02",
    segment: "Enterprise",
    region: "East",
    isRenewal: false,
  },
  {
    id: "OPP-438",
    accountId: "Northwind Labs",
    ownerId: "u2",
    amount: 98_000,
    stage: "Proposal",
    probability: 0.45,
    createdAt: "2025-12-09",
    expectedCloseDate: "2026-02-20",
    segment: "Enterprise",
    region: "West",
    isRenewal: false,
  },
  {
    id: "OPP-447",
    accountId: "Globex Systems",
    ownerId: "u3",
    amount: 76_000,
    stage: "Qualification",
    probability: 0.33,
    createdAt: "2025-12-19",
    expectedCloseDate: "2026-01-28",
    segment: "Mid-Market",
    region: "Central",
    isRenewal: false,
  },
  {
    id: "OPP-452",
    accountId: "Initech",
    ownerId: "u4",
    amount: 38_000,
    stage: "Prospecting",
    probability: 0.25,
    createdAt: "2026-01-10",
    expectedCloseDate: "2026-03-04",
    segment: "SMB",
    region: "East",
    isRenewal: false,
  },
  {
    id: "OPP-459",
    accountId: "Umbrella Corp",
    ownerId: "u1",
    amount: 150_000,
    stage: "Legal",
    probability: 0.58,
    createdAt: "2025-12-16",
    expectedCloseDate: "2026-02-10",
    segment: "Enterprise",
    region: "Central",
    isRenewal: true,
  },
  {
    id: "OPP-463",
    accountId: "Stark Logistics",
    ownerId: "u2",
    amount: 84_000,
    stage: "Negotiation",
    probability: 0.52,
    createdAt: "2026-01-03",
    expectedCloseDate: "2026-02-24",
    segment: "Mid-Market",
    region: "West",
    isRenewal: false,
  },
  {
    id: "OPP-471",
    accountId: "Wayne Devices",
    ownerId: "u3",
    amount: 56_000,
    stage: "Proposal",
    probability: 0.41,
    createdAt: "2025-12-27",
    expectedCloseDate: "2026-02-12",
    segment: "SMB",
    region: "East",
    isRenewal: false,
  },
  {
    id: "OPP-475",
    accountId: "Hooli AI",
    ownerId: "u4",
    amount: 132_000,
    stage: "Qualification",
    probability: 0.36,
    createdAt: "2025-11-30",
    expectedCloseDate: "2026-02-06",
    segment: "Enterprise",
    region: "West",
    isRenewal: false,
  },
  {
    id: "OPP-482",
    accountId: "Soylent Foods",
    ownerId: "u2",
    amount: 91_000,
    stage: "Negotiation",
    probability: 0.64,
    createdAt: "2026-01-05",
    expectedCloseDate: "2026-03-01",
    segment: "Mid-Market",
    region: "Central",
    isRenewal: false,
  },
  {
    id: "OPP-489",
    accountId: "Oscorp Labs",
    ownerId: "u1",
    amount: 174_000,
    stage: "Legal",
    probability: 0.71,
    createdAt: "2025-11-18",
    expectedCloseDate: "2026-01-30",
    segment: "Enterprise",
    region: "East",
    isRenewal: false,
  },
  {
    id: "OPP-493",
    accountId: "Vehement Capital",
    ownerId: "u3",
    amount: 29_000,
    stage: "Prospecting",
    probability: 0.18,
    createdAt: "2026-01-18",
    expectedCloseDate: "2026-03-18",
    segment: "SMB",
    region: "West",
    isRenewal: false,
  },
  {
    id: "OPP-497",
    accountId: "Aperture Health",
    ownerId: "u4",
    amount: 103_000,
    stage: "Proposal",
    probability: 0.47,
    createdAt: "2026-01-09",
    expectedCloseDate: "2026-02-14",
    segment: "Enterprise",
    region: "Central",
    isRenewal: false,
  },
];

const OPPORTUNITY_DAILY_SNAPSHOT: OpportunityDailySnapshot[] = [
  {
    opportunityId: "OPP-421",
    snapshotDate: "2026-02-15",
    stage: "Negotiation",
    amount: 120_000,
    probability: 0.62,
    daysInStage: 26,
    lastActivityAt: "2026-02-03",
  },
  {
    opportunityId: "OPP-438",
    snapshotDate: "2026-02-15",
    stage: "Proposal",
    amount: 98_000,
    probability: 0.45,
    daysInStage: 15,
    lastActivityAt: "2026-02-11",
  },
  {
    opportunityId: "OPP-447",
    snapshotDate: "2026-02-15",
    stage: "Qualification",
    amount: 76_000,
    probability: 0.33,
    daysInStage: 24,
    lastActivityAt: "2026-01-31",
  },
  {
    opportunityId: "OPP-452",
    snapshotDate: "2026-02-15",
    stage: "Prospecting",
    amount: 38_000,
    probability: 0.25,
    daysInStage: 9,
    lastActivityAt: "2026-02-14",
  },
  {
    opportunityId: "OPP-459",
    snapshotDate: "2026-02-15",
    stage: "Legal",
    amount: 150_000,
    probability: 0.58,
    daysInStage: 22,
    lastActivityAt: "2026-02-05",
  },
  {
    opportunityId: "OPP-463",
    snapshotDate: "2026-02-15",
    stage: "Negotiation",
    amount: 84_000,
    probability: 0.52,
    daysInStage: 13,
    lastActivityAt: "2026-02-13",
  },
  {
    opportunityId: "OPP-471",
    snapshotDate: "2026-02-15",
    stage: "Proposal",
    amount: 56_000,
    probability: 0.41,
    daysInStage: 19,
    lastActivityAt: "2026-02-02",
  },
  {
    opportunityId: "OPP-475",
    snapshotDate: "2026-02-15",
    stage: "Qualification",
    amount: 132_000,
    probability: 0.36,
    daysInStage: 27,
    lastActivityAt: "2026-02-01",
  },
  {
    opportunityId: "OPP-482",
    snapshotDate: "2026-02-15",
    stage: "Negotiation",
    amount: 91_000,
    probability: 0.64,
    daysInStage: 11,
    lastActivityAt: "2026-02-10",
  },
  {
    opportunityId: "OPP-489",
    snapshotDate: "2026-02-15",
    stage: "Legal",
    amount: 174_000,
    probability: 0.71,
    daysInStage: 31,
    lastActivityAt: "2026-01-29",
  },
  {
    opportunityId: "OPP-493",
    snapshotDate: "2026-02-15",
    stage: "Prospecting",
    amount: 29_000,
    probability: 0.18,
    daysInStage: 8,
    lastActivityAt: "2026-02-12",
  },
  {
    opportunityId: "OPP-497",
    snapshotDate: "2026-02-15",
    stage: "Proposal",
    amount: 103_000,
    probability: 0.47,
    daysInStage: 17,
    lastActivityAt: "2026-02-04",
  },
];

const ACTIVITIES: Activity[] = [
  { opportunityId: "OPP-421", activityType: "meeting", occurredAt: "2026-02-03" },
  { opportunityId: "OPP-438", activityType: "proposal", occurredAt: "2026-02-11" },
  { opportunityId: "OPP-447", activityType: "email", occurredAt: "2026-01-31" },
  { opportunityId: "OPP-452", activityType: "call", occurredAt: "2026-02-14" },
  { opportunityId: "OPP-459", activityType: "meeting", occurredAt: "2026-02-05" },
  { opportunityId: "OPP-463", activityType: "call", occurredAt: "2026-02-13" },
  { opportunityId: "OPP-471", activityType: "email", occurredAt: "2026-02-02" },
  { opportunityId: "OPP-475", activityType: "demo", occurredAt: "2026-02-01" },
  { opportunityId: "OPP-482", activityType: "meeting", occurredAt: "2026-02-10" },
  { opportunityId: "OPP-489", activityType: "meeting", occurredAt: "2026-01-29" },
  { opportunityId: "OPP-493", activityType: "call", occurredAt: "2026-02-12" },
  { opportunityId: "OPP-497", activityType: "proposal", occurredAt: "2026-02-04" },
];

const CLOSED_DEALS: ClosedDeal[] = [
  { opportunityId: "CLS-101", outcome: "won", closedAt: "2026-01-05", amount: 82_000, cycleDays: 31 },
  { opportunityId: "CLS-102", outcome: "won", closedAt: "2026-01-08", amount: 66_000, cycleDays: 27 },
  { opportunityId: "CLS-103", outcome: "lost", closedAt: "2026-01-10", amount: 39_000, cycleDays: 24 },
  { opportunityId: "CLS-104", outcome: "won", closedAt: "2026-01-12", amount: 128_000, cycleDays: 36 },
  { opportunityId: "CLS-105", outcome: "lost", closedAt: "2026-01-15", amount: 57_000, cycleDays: 29 },
  { opportunityId: "CLS-106", outcome: "won", closedAt: "2026-01-18", amount: 94_000, cycleDays: 34 },
  { opportunityId: "CLS-107", outcome: "won", closedAt: "2026-01-22", amount: 73_000, cycleDays: 28 },
  { opportunityId: "CLS-108", outcome: "lost", closedAt: "2026-01-24", amount: 61_000, cycleDays: 30 },
  { opportunityId: "CLS-109", outcome: "won", closedAt: "2026-01-27", amount: 108_000, cycleDays: 33 },
  { opportunityId: "CLS-110", outcome: "won", closedAt: "2026-01-30", amount: 84_000, cycleDays: 26 },
  { opportunityId: "CLS-111", outcome: "won", closedAt: "2026-02-02", amount: 97_000, cycleDays: 32 },
  { opportunityId: "CLS-112", outcome: "lost", closedAt: "2026-02-03", amount: 64_000, cycleDays: 30 },
  { opportunityId: "CLS-113", outcome: "won", closedAt: "2026-02-05", amount: 122_000, cycleDays: 35 },
  { opportunityId: "CLS-114", outcome: "won", closedAt: "2026-02-07", amount: 88_000, cycleDays: 31 },
  { opportunityId: "CLS-115", outcome: "lost", closedAt: "2026-02-09", amount: 74_000, cycleDays: 29 },
  { opportunityId: "CLS-116", outcome: "won", closedAt: "2026-02-10", amount: 105_000, cycleDays: 37 },
  { opportunityId: "CLS-117", outcome: "won", closedAt: "2026-02-12", amount: 116_000, cycleDays: 34 },
  { opportunityId: "CLS-118", outcome: "lost", closedAt: "2026-02-13", amount: 58_000, cycleDays: 26 },
  { opportunityId: "CLS-119", outcome: "won", closedAt: "2026-02-14", amount: 91_000, cycleDays: 30 },
  { opportunityId: "CLS-120", outcome: "won", closedAt: "2026-02-15", amount: 104_000, cycleDays: 32 },
];

const TREND_POINTS: TrendPoint[] = [
  { period: "W1", closedWon: 48_000, weightedPipeline: 192_000, target: 70_000 },
  { period: "W2", closedWon: 61_000, weightedPipeline: 204_000, target: 70_000 },
  { period: "W3", closedWon: 54_000, weightedPipeline: 198_000, target: 70_000 },
  { period: "W4", closedWon: 66_000, weightedPipeline: 209_000, target: 70_000 },
  { period: "W5", closedWon: 58_000, weightedPipeline: 215_000, target: 72_000 },
  { period: "W6", closedWon: 72_000, weightedPipeline: 226_000, target: 72_000 },
  { period: "W7", closedWon: 63_000, weightedPipeline: 232_000, target: 72_000 },
  { period: "W8", closedWon: 69_000, weightedPipeline: 241_000, target: 72_000 },
  { period: "W9", closedWon: 74_000, weightedPipeline: 246_000, target: 74_000 },
  { period: "W10", closedWon: 71_000, weightedPipeline: 254_000, target: 74_000 },
  { period: "W11", closedWon: 77_000, weightedPipeline: 261_000, target: 74_000 },
  { period: "W12", closedWon: 81_000, weightedPipeline: 272_000, target: 74_000 },
];

export function getForecastTrendChartData() {
  return TREND_POINTS;
}

export const DEFAULT_ANALYTICS_RANGE = {
  from: subDays(DATA_ANCHOR, 29),
  to: DATA_ANCHOR,
};

export const DEFAULT_ANALYTICS_FILTERS: Omit<AnalyticsFilters, "from" | "to"> = {
  enterpriseOnly: false,
  stalledOnly: false,
  overdueOnly: false,
  includeRenewals: true,
};

export function toISODate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getOwnerName(ownerId: string) {
  return USERS.find((user) => user.ownerId === ownerId)?.name ?? "Unassigned";
}

function getCurrentRange(filters: AnalyticsFilters) {
  const from = parseISO(filters.from);
  const to = parseISO(filters.to);
  const normalizedFrom = startOfDay(from);
  const normalizedTo = startOfDay(to);
  if (normalizedFrom <= normalizedTo) {
    return { from: normalizedFrom, to: normalizedTo };
  }
  return { from: normalizedTo, to: normalizedFrom };
}

function getLatestSnapshot(opportunityId: string, to: Date) {
  return OPPORTUNITY_DAILY_SNAPSHOT.filter(
    (snapshot) => snapshot.opportunityId === opportunityId && parseISO(snapshot.snapshotDate) <= to,
  ).sort((a, b) => (a.snapshotDate > b.snapshotDate ? -1 : 1))[0];
}

function getLastActivity(opportunityId: string, to: Date) {
  return ACTIVITIES.filter(
    (activity) => activity.opportunityId === opportunityId && parseISO(activity.occurredAt) <= to,
  ).sort((a, b) => (a.occurredAt > b.occurredAt ? -1 : 1))[0]?.occurredAt;
}

function getRecommendation(score: number, overdue: boolean, inactivityDays: number) {
  if (score >= 80 || (overdue && inactivityDays >= 10)) {
    return "Escalate with manager";
  }
  if (score >= 65) {
    return "Coach owner on stage exit";
  }
  if (score >= 45) {
    return "Reforecast commit category";
  }
  return "Monitor in weekly review";
}

function getPriority(score: number): ActionQueueItem["priority"] {
  if (score >= 80) {
    return "Escalate";
  }
  if (score >= 65) {
    return "Coach";
  }
  if (score >= 45) {
    return "Reforecast";
  }
  return "No action";
}

function buildOpportunityContexts(filters: AnalyticsFilters, to: Date) {
  const byRenewal = OPPORTUNITIES.filter((opportunity) => filters.includeRenewals || !opportunity.isRenewal);
  const ownerLoad = byRenewal.reduce<Record<string, number>>((acc, opportunity) => {
    acc[opportunity.ownerId] = (acc[opportunity.ownerId] ?? 0) + 1;
    return acc;
  }, {});

  return byRenewal
    .map((opportunity) => {
      const snapshot = getLatestSnapshot(opportunity.id, to);
      const daysInStage = snapshot?.daysInStage ?? STAGE_THRESHOLDS[opportunity.stage];
      const lastActivityAt = getLastActivity(opportunity.id, to) ?? snapshot?.lastActivityAt ?? opportunity.createdAt;
      const lastActivityDays = Math.max(0, differenceInCalendarDays(to, parseISO(lastActivityAt)));
      const closeVarianceDays = differenceInCalendarDays(to, parseISO(opportunity.expectedCloseDate));
      const isOverdue = closeVarianceDays > 0;
      const stageThreshold = STAGE_THRESHOLDS[opportunity.stage];
      const benchmark = STAGE_PROBABILITY_BENCHMARK[opportunity.stage];

      const closeDateOverdueFactor = clamp(closeVarianceDays / 30, 0, 1);
      const inactivityFactor = clamp(lastActivityDays / 14, 0, 1);
      const stageAgingFactor = clamp((daysInStage - stageThreshold) / stageThreshold, 0, 1);
      const probabilityGapFactor = clamp((benchmark - opportunity.probability) / benchmark, 0, 1);
      const ownerOverCapacityFactor = clamp(((ownerLoad[opportunity.ownerId] ?? 0) - 3) / 4, 0, 1);

      const riskScore = Math.round(
        100 *
          (0.35 * closeDateOverdueFactor +
            0.25 * inactivityFactor +
            0.2 * stageAgingFactor +
            0.1 * probabilityGapFactor +
            0.1 * ownerOverCapacityFactor),
      );

      const atRisk = isOverdue || daysInStage > stageThreshold || lastActivityDays > 7;
      const nextAction = getRecommendation(riskScore, isOverdue, lastActivityDays);
      const reason = isOverdue
        ? `Close date overdue by ${closeVarianceDays} days`
        : lastActivityDays > 7
          ? `${lastActivityDays} days since last activity`
          : `Stage aging at ${daysInStage} days`;

      return {
        opportunity,
        ownerName: getOwnerName(opportunity.ownerId),
        daysInStage,
        lastActivityDays,
        isOverdue,
        closeVarianceDays,
        riskScore,
        atRisk,
        nextAction,
        reason,
      } satisfies OpportunityContext;
    })
    .filter((context) => {
      if (filters.enterpriseOnly && context.opportunity.segment !== "Enterprise") {
        return false;
      }
      if (filters.stalledOnly && context.daysInStage <= 14) {
        return false;
      }
      if (filters.overdueOnly && !context.isOverdue) {
        return false;
      }
      return true;
    });
}

export function buildRevenueChartData(to: Date) {
  const start = subDays(to, 29);
  const wonDeals = CLOSED_DEALS.filter((deal) => deal.outcome === "won");

  if (wonDeals.length === 0) {
    return eachDayOfInterval({ start, end: to }).map((day) => ({
      day: format(day, "MMM d"),
      revenue: 0,
    }));
  }

  const latestWonDate = wonDeals.reduce((latest, deal) => {
    const closedDate = parseISO(deal.closedAt);
    return closedDate > latest ? closedDate : latest;
  }, parseISO(wonDeals[0].closedAt));

  const shiftedRevenueByDay = new Map<string, number>();
  for (const deal of wonDeals) {
    const closedDate = parseISO(deal.closedAt);
    const offset = differenceInCalendarDays(latestWonDate, closedDate);
    const shiftedDate = subDays(to, offset);
    if (shiftedDate < start || shiftedDate > to) {
      continue;
    }
    const key = format(shiftedDate, "yyyy-MM-dd");
    shiftedRevenueByDay.set(key, (shiftedRevenueByDay.get(key) ?? 0) + deal.amount);
  }

  return eachDayOfInterval({ start, end: to }).map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const dayRevenue = shiftedRevenueByDay.get(key) ?? 0;
    return {
      day: format(day, "MMM d"),
      revenue: dayRevenue,
    };
  });
}

function buildActionQueue(contexts: OpportunityContext[]) {
  const sortedByRisk = [...contexts].sort((a, b) => b.riskScore - a.riskScore);
  const queueContexts = sortedByRisk.slice(0, 7);

  return queueContexts
    .map((context) => {
      const priority = getPriority(context.riskScore);
      const recommendation =
        priority === "Escalate"
          ? "Join next customer call and reset close plan."
          : priority === "Coach"
            ? "Review deal strategy and unblock stage exit."
            : priority === "Reforecast"
              ? "Adjust forecast category and expected close."
              : "No immediate intervention required.";
      return {
        priority,
        owner: context.ownerName,
        dealId: context.opportunity.id,
        reason: context.reason,
        recommendation,
      } satisfies ActionQueueItem;
    })
    .sort((a, b) => {
      const priorityDifference = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priorityDifference !== 0) {
        return priorityDifference;
      }
      return a.dealId.localeCompare(b.dealId);
    });
}

export function buildAnalyticsSnapshot(filters: AnalyticsFilters) {
  const currentRange = getCurrentRange(filters);
  const contexts = buildOpportunityContexts(filters, currentRange.to);

  const riskDeals = contexts
    .filter((context) => context.atRisk)
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((context) => ({
      dealId: context.opportunity.id,
      account: context.opportunity.accountId,
      owner: context.ownerName,
      amount: context.opportunity.amount,
      stage: context.opportunity.stage,
      daysInStage: context.daysInStage,
      lastActivityDays: context.lastActivityDays,
      closeVarianceDays: context.closeVarianceDays,
      riskScore: context.riskScore,
      nextAction: context.nextAction,
    }));

  return {
    actions: {
      riskDeals,
      actionQueue: buildActionQueue(contexts),
    },
  };
}
