import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
} from "date-fns";

export interface WindowRange {
  start: Date;
  end: Date;
}

export interface ReportWindow {
  current: WindowRange;
  previous: WindowRange;
  label: string;
  comparisonLabel: string;
}

export const reportRangePresetValues = [
  "last-7-days",
  "last-30-days",
  "last-90-days",
  "this-month",
  "last-month",
  "this-quarter",
  "this-year",
  "custom",
] as const;

export type ReportRangePreset = (typeof reportRangePresetValues)[number];

export const reportRangePresetOptions: readonly { value: ReportRangePreset; label: string }[] = [
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-90-days", label: "Last 90 days" },
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "this-quarter", label: "This quarter" },
  { value: "this-year", label: "This year" },
  { value: "custom", label: "Custom range" },
];

export interface DateRangeValue {
  from: Date;
  to: Date;
}

const MOCK_DATA_ANCHOR = new Date(2026, 7, 16);

export const reportToday: Date = startOfDay(MOCK_DATA_ANCHOR);

function rangeLabel(range: WindowRange): string {
  const sameYear = range.start.getFullYear() === range.end.getFullYear();
  const startLabel = sameYear ? format(range.start, "MMM d") : format(range.start, "MMM d, yyyy");
  return `${startLabel} – ${format(range.end, "MMM d, yyyy")}`;
}

function windowFromBounds(start: Date, end: Date, comparisonLabel: string): ReportWindow {
  const currentStart = startOfDay(start);
  const currentEnd = endOfDay(end);
  const durationDays = Math.max(1, differenceInCalendarDays(currentEnd, currentStart) + 1);
  const previousEnd = startOfDay(subDays(currentStart, 1));
  const previousStart = startOfDay(subDays(previousEnd, durationDays - 1));
  return {
    current: { start: currentStart, end: currentEnd },
    previous: { start: previousStart, end: endOfDay(previousEnd) },
    label: rangeLabel({ start: currentStart, end: currentEnd }),
    comparisonLabel,
  };
}

function calendarPreviousLabel(unit: "month" | "quarter" | "year"): string {
  switch (unit) {
    case "month":
      return "vs previous month";
    case "quarter":
      return "vs previous quarter";
    default:
      return "vs previous year";
  }
}

export function getReportWindow(preset: ReportRangePreset, customRange?: DateRangeValue): ReportWindow {
  if (preset === "custom") {
    if (!customRange?.from || !customRange.to || !isValid(customRange.from) || !isValid(customRange.to)) {
      return getReportWindow("last-30-days");
    }
    const from = customRange.from <= customRange.to ? customRange.from : customRange.to;
    const to = customRange.from <= customRange.to ? customRange.to : customRange.from;
    return windowFromBounds(from, to, "vs prior period of equal length");
  }

  if (preset === "last-month") {
    const monthStart = startOfMonth(subDays(startOfMonth(reportToday), 1));
    return windowFromBounds(monthStart, endOfMonth(monthStart), "vs previous month");
  }

  if (preset === "this-month") {
    return windowFromBounds(startOfMonth(reportToday), reportToday, calendarPreviousLabel("month"));
  }

  if (preset === "this-quarter") {
    return windowFromBounds(startOfQuarter(reportToday), reportToday, calendarPreviousLabel("quarter"));
  }

  if (preset === "this-year") {
    return windowFromBounds(startOfYear(reportToday), reportToday, calendarPreviousLabel("year"));
  }

  const durationByPreset: Record<"last-7-days" | "last-30-days" | "last-90-days", number> = {
    "last-7-days": 7,
    "last-30-days": 30,
    "last-90-days": 90,
  };
  const duration = durationByPreset[preset];
  return windowFromBounds(subDays(reportToday, duration - 1), reportToday, `vs prior ${duration} days`);
}

export function safeParseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = typeof value === "string" && value.includes("T") ? parseISO(value) : parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function isWithinWindow(date: Date, range: WindowRange): boolean {
  const time = date.getTime();
  return time >= range.start.getTime() && time <= range.end.getTime();
}

export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, differenceInCalendarDays(to, from));
}

export interface SeriesBucket {
  key: string;
  label: string;
  tooltipLabel: string;
  start: Date;
  end: Date;
}

export function buildSeriesBuckets(range: WindowRange): SeriesBucket[] {
  const durationDays = differenceInCalendarDays(range.end, range.start) + 1;

  if (durationDays <= 31) {
    const buckets: SeriesBucket[] = [];
    let cursor = range.start;
    while (cursor <= range.end) {
      const rawEnd = addDays(cursor, 6);
      const bucketEnd = endOfDay(rawEnd > range.end ? range.end : rawEnd);
      const singleDay = format(cursor, "yyyy-MM-dd") === format(bucketEnd, "yyyy-MM-dd");
      buckets.push({
        key: `w-${format(cursor, "yyyy-MM-dd")}`,
        label: format(cursor, "MMM d"),
        tooltipLabel: singleDay
          ? format(cursor, "MMM d, yyyy")
          : `${format(cursor, "MMM d")} – ${format(bucketEnd, "MMM d")}`,
        start: cursor,
        end: bucketEnd,
      });
      cursor = startOfDay(addDays(bucketEnd, 1));
    }
    return buckets;
  }

  const buckets: SeriesBucket[] = [];
  let cursor = startOfMonth(range.start);
  while (cursor <= range.end) {
    const monthEnd = endOfMonth(cursor);
    const bucketEnd = monthEnd > range.end ? range.end : monthEnd;
    buckets.push({
      key: `m-${format(cursor, "yyyy-MM")}`,
      label: format(cursor, "MMM"),
      tooltipLabel: format(cursor, "MMM yyyy"),
      start: cursor,
      end: bucketEnd,
    });
    cursor = startOfMonth(addDays(monthEnd, 1));
  }
  return buckets;
}
