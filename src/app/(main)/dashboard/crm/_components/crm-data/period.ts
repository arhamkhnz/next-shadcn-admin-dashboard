import { differenceInCalendarDays, endOfDay, format, isWithinInterval, startOfDay, subDays } from "date-fns";

import type { QualifiedFlowEntry } from "./schema";

export type PeriodValue = "last-30-days" | "last-3-months" | "last-6-months" | "last-12-months" | "custom";

export interface DateRangeValue {
  from: Date;
  to: Date;
}

export interface WindowRange {
  start: Date;
  end: Date;
}

export interface CrmPeriodWindow {
  current: WindowRange;
  previous: WindowRange;
  label: string;
  comparisonLabel: string;
}

const PERIOD_DURATIONS: Record<Exclude<PeriodValue, "custom">, number> = {
  "last-30-days": 30,
  "last-3-months": 90,
  "last-6-months": 180,
  "last-12-months": 365,
};

const MOCK_DATA_ANCHOR = new Date(2026, 7, 16);

export const today: Date = startOfDay(MOCK_DATA_ANCHOR);

export function getPeriodDurationDays(period: PeriodValue, customRange?: DateRangeValue): number {
  if (period === "custom") {
    if (!customRange?.from || !customRange.to) {
      return PERIOD_DURATIONS["last-30-days"];
    }
    return Math.max(1, differenceInCalendarDays(customRange.to, customRange.from) + 1);
  }
  return PERIOD_DURATIONS[period];
}

function humanizeDuration(days: number): string {
  if (days <= 30) return "30 days";
  if (days <= 90) return "3 months";
  if (days <= 180) return "6 months";
  if (days <= 365) return "12 months";
  return `${days} days`;
}

export function getPeriodWindow(period: PeriodValue, customRange?: DateRangeValue): CrmPeriodWindow {
  const duration = getPeriodDurationDays(period, customRange);

  if (period === "custom" && customRange?.from && customRange.to) {
    const end = endOfDay(customRange.to);
    const start = startOfDay(customRange.from);
    const previousEnd = startOfDay(subDays(start, 1));
    const previousStart = startOfDay(subDays(previousEnd, duration - 1));
    return {
      current: { start, end },
      previous: { start: previousStart, end: previousEnd },
      label: `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`,
      comparisonLabel: `prior ${humanizeDuration(duration)}`,
    };
  }

  const end = endOfDay(today);
  const start = startOfDay(subDays(end, duration - 1));
  const previousEnd = startOfDay(subDays(start, 1));
  const previousStart = startOfDay(subDays(previousEnd, duration - 1));

  const label = (() => {
    switch (period) {
      case "last-3-months":
        return "last 3 months";
      case "last-6-months":
        return "last 6 months";
      case "last-12-months":
        return "last 12 months";
      default:
        return "last 30 days";
    }
  })();

  return {
    current: { start, end },
    previous: { start: previousStart, end: previousEnd },
    label,
    comparisonLabel: `prior ${humanizeDuration(duration)}`,
  };
}

export function entriesInWindow(
  entries: QualifiedFlowEntry[],
  range: WindowRange,
  ownerId: string | null,
): QualifiedFlowEntry[] {
  const ownerEntries = ownerId ? entries.filter((entry) => entry.ownerId === ownerId) : entries;
  return ownerEntries.filter((entry) => isWithinInterval(entry.date, { start: range.start, end: range.end }));
}

export interface FlowBucket {
  key: string;
  label: string;
  tooltipLabel: string;
  qualified: number;
}

const WEEK_SHARES = [0.26, 0.27, 0.24, 0.23] as const;

export function buildFlowBuckets(
  entries: QualifiedFlowEntry[],
  range: WindowRange,
  ownerId: string | null,
): FlowBucket[] {
  const inWindow = entriesInWindow(entries, range, ownerId);
  const totalQualified = inWindow.reduce((sum, entry) => sum + entry.qualified, 0);

  if (totalQualified === 0) {
    return [];
  }

  const duration = differenceInCalendarDays(range.end, range.start) + 1;

  if (duration <= 45) {
    return WEEK_SHARES.map((share, index) => {
      const weekEnd = subDays(range.end, (WEEK_SHARES.length - 1 - index) * 7);
      const weekStart = subDays(weekEnd, 6);
      return {
        key: `week-${index}`,
        label: format(weekStart, "MMM d"),
        tooltipLabel: `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d")}`,
        qualified: Math.round(totalQualified * share),
      };
    }).filter((bucket) => bucket.qualified > 0);
  }

  const monthlyBuckets = new Map<string, FlowBucket>();
  for (const entry of [...inWindow].sort((a, b) => a.date.getTime() - b.date.getTime())) {
    const key = format(entry.date, "yyyy-MM");
    const existing = monthlyBuckets.get(key);
    if (existing) {
      existing.qualified += entry.qualified;
    } else {
      monthlyBuckets.set(key, {
        key,
        label: format(entry.date, "MMM"),
        tooltipLabel: format(entry.date, "MMM yyyy"),
        qualified: entry.qualified,
      });
    }
  }
  return [...monthlyBuckets.values()];
}
