import { format } from "date-fns";

import type { Activity } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import type { Deal } from "@/app/(main)/dashboard/crm/deals/_components/deals-data/schema";
import type { Lead } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/schema";
import { formatCurrency } from "@/lib/utils";

import { safeParseDate } from "./report-data/report-dates";
import type { DrillDownRow } from "./reports-context";

const badgeClassByKey: Record<string, string> = {
  Discovery: "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
  Qualified:
    "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
  "Proposal Sent":
    "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
  Negotiation:
    "border-orange-200 bg-orange-500/10 text-orange-700 dark:border-orange-900/40 dark:bg-orange-500/15 dark:text-orange-300",
  "Closed Won":
    "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
  "Closed Lost": "border-border bg-muted/50 text-muted-foreground",
  New: "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
  Contacted:
    "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
  Unqualified: "border-border bg-muted/50 text-muted-foreground",
  Nurturing:
    "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
  Scheduled:
    "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
  "To Do": "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
  "In Progress":
    "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
  Completed:
    "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
  Canceled: "border-border bg-muted/50 text-muted-foreground",
};

export function dealDrillRow(deal: Deal): DrillDownRow {
  return {
    id: deal.id,
    title: deal.name,
    subtitle: deal.ownerId ? getOwnerName(deal.ownerId) : "Unassigned",
    href: `/dashboard/crm/deals/${deal.id}`,
    badge: { label: deal.stage, className: badgeClassByKey[deal.stage] ?? "" },
    meta: [formatCurrency(deal.value, { noDecimals: true })],
  };
}

export function leadDrillRow(lead: Lead): DrillDownRow {
  return {
    id: lead.id,
    title: lead.name,
    subtitle: lead.ownerId ? getOwnerName(lead.ownerId) : "Unassigned",
    href: `/dashboard/crm/leads/${lead.id}`,
    badge: { label: lead.status, className: badgeClassByKey[lead.status] ?? "" },
    meta: [`Score ${lead.score}`, lead.source],
  };
}

export function activityDrillRow(activity: Activity): DrillDownRow {
  const scheduled = safeParseDate(activity.scheduledAt);
  return {
    id: activity.id,
    title: activity.title,
    subtitle: activity.ownerId ? getOwnerName(activity.ownerId) : "Unassigned",
    href: activity.type === "Task" ? `/dashboard/crm/tasks/${activity.id}` : `/dashboard/crm/activities/${activity.id}`,
    badge: { label: activity.status, className: badgeClassByKey[activity.status] ?? "" },
    meta: [activity.type, scheduled ? format(scheduled, "MMM d, yyyy") : "No date"],
  };
}
