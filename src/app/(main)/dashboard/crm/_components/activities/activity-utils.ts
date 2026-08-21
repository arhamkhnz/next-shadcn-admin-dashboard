import { format, parseISO } from "date-fns";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, FileText, Mail, Phone, Video } from "lucide-react";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { useDealStore } from "@/app/(main)/dashboard/crm/deals/_components/deals-data/use-deal-store";
import { useLeadStore } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/use-lead-store";

import type {
  Activity,
  ActivityPriority,
  ActivityRelatedRecordType,
  ActivityStatus,
  ActivityType,
} from "./activity-schema";

export const activityTypeOptions: readonly ActivityType[] = ["Call", "Meeting", "Email", "Task", "Note"];

export const activityStatusOptions: readonly ActivityStatus[] = [
  "Scheduled",
  "To Do",
  "In Progress",
  "Completed",
  "Canceled",
];

export const taskStatusOptions: readonly ActivityStatus[] = ["To Do", "In Progress", "Completed", "Canceled"];

export const boardStatusOptions = ["To Do", "In Progress", "Completed"] as const;

export const activityPriorityOptions: readonly ActivityPriority[] = ["Low", "Medium", "High", "Urgent"];

export const activityRelatedRecordTypeOptions: readonly ActivityRelatedRecordType[] = [
  "Lead",
  "Contact",
  "Company",
  "Deal",
];

export const activityTypeMeta: Record<ActivityType, { icon: LucideIcon; badgeClass: string }> = {
  Call: {
    icon: Phone,
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  Meeting: {
    icon: Video,
    badgeClass:
      "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
  },
  Email: {
    icon: Mail,
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
  },
  Task: {
    icon: CheckCircle2,
    badgeClass: "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
  },
  Note: {
    icon: FileText,
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
  },
};

export const activityStatusMeta: Record<ActivityStatus, { badgeClass: string; dotClass: string }> = {
  Scheduled: {
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  Completed: {
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Canceled: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  "To Do": {
    badgeClass: "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
    dotClass: "bg-sky-500",
  },
  "In Progress": {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
};

export const activityPriorityMeta: Record<ActivityPriority, { badgeClass: string }> = {
  Low: { badgeClass: "border-border bg-muted/50 text-muted-foreground" },
  Medium: {
    badgeClass: "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
  },
  High: {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
  },
  Urgent: {
    badgeClass: "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300",
  },
};

function findLead(id: string) {
  return useLeadStore.getState().getLeadById(id);
}

function findContact(id: string) {
  return useContactStore.getState().getContactById(id);
}

function findCompany(id: string) {
  return useCompanyStore.getState().getCompanyById(id);
}

function findDeal(id: string) {
  return useDealStore.getState().getDealById(id);
}

export interface RelatedRecordRef {
  id: string;
  type: ActivityRelatedRecordType;
  name: string;
  href: string;
  found: boolean;
  archived: boolean;
}

function leadRef(id: string): RelatedRecordRef {
  const lead = findLead(id);
  return {
    id,
    type: "Lead",
    name: lead ? lead.name : "Unknown lead",
    href: `/dashboard/crm/leads/${id}`,
    found: Boolean(lead),
    archived: Boolean(lead?.archivedAt),
  };
}

function contactRef(id: string): RelatedRecordRef {
  const contact = findContact(id);
  return {
    id,
    type: "Contact",
    name: contact ? contact.name : "Unknown contact",
    href: `/dashboard/crm/contacts/${id}`,
    found: Boolean(contact),
    archived: Boolean(contact?.archivedAt),
  };
}

function companyRef(id: string): RelatedRecordRef {
  const company = findCompany(id);
  return {
    id,
    type: "Company",
    name: company ? company.name : "Unknown company",
    href: `/dashboard/crm/companies/${id}`,
    found: Boolean(company),
    archived: Boolean(company?.archivedAt),
  };
}

function dealRef(id: string): RelatedRecordRef {
  const deal = findDeal(id);
  return {
    id,
    type: "Deal",
    name: deal ? deal.name : "Unknown deal",
    href: `/dashboard/crm/deals/${id}`,
    found: Boolean(deal),
    archived: Boolean(deal?.archivedAt),
  };
}

export function getRelatedRecords(activity: Activity): RelatedRecordRef[] {
  const refs: RelatedRecordRef[] = [];
  if (activity.dealId) refs.push(dealRef(activity.dealId));
  if (activity.companyId) refs.push(companyRef(activity.companyId));
  if (activity.contactId) refs.push(contactRef(activity.contactId));
  if (activity.leadId) refs.push(leadRef(activity.leadId));
  return refs;
}

export function isTaskActivity(activity: Activity): boolean {
  return activity.type === "Task";
}

export function isActiveStatus(status: ActivityStatus): boolean {
  return status === "Scheduled" || status === "To Do" || status === "In Progress";
}

export function isOpenTask(activity: Activity): boolean {
  return isTaskActivity(activity) && isActiveStatus(activity.status);
}

export function getTaskDueAt(activity: Activity): string {
  return activity.dueAt ?? activity.scheduledAt;
}

const allowedTaskTransitions: Record<ActivityStatus, readonly ActivityStatus[]> = {
  Scheduled: ["To Do", "In Progress", "Completed", "Canceled"],
  "To Do": ["In Progress", "Completed", "Canceled"],
  "In Progress": ["To Do", "Completed", "Canceled"],
  Completed: ["To Do"],
  Canceled: ["To Do"],
};

export function canTransitionStatus(from: ActivityStatus, to: ActivityStatus): boolean {
  if (from === to) return false;
  return allowedTaskTransitions[from].includes(to);
}

export function getScheduleState(
  activity: Activity,
  today: Date,
): "Overdue" | "Due Today" | "Upcoming" | "Past" | null {
  if (!isActiveStatus(activity.status)) return null;
  const scheduled = parseISO(activity.scheduledAt);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  if (scheduled.getTime() < startOfToday.getTime()) return "Overdue";
  if (scheduled.getTime() <= endOfToday.getTime()) return "Due Today";
  return "Upcoming";
}

export function isCompletedThisMonth(activity: Activity, today: Date): boolean {
  if (activity.status !== "Completed" || !activity.completedAt) return false;
  const completed = parseISO(activity.completedAt);
  return completed.getMonth() === today.getMonth() && completed.getFullYear() === today.getFullYear();
}

export function getActivityTimestamp(activity: Activity): string {
  return activity.completedAt ?? activity.scheduledAt;
}

export function formatActivityDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy 'at' h:mm a");
}

export function formatActivityDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function getOwnerLabel(activity: Activity): string {
  return activity.ownerId ? getOwnerName(activity.ownerId) : "Unassigned";
}

export function buildSearchHaystack(activity: Activity): string {
  const parts = [
    activity.title,
    activity.description ?? "",
    activity.outcome ?? "",
    getOwnerLabel(activity),
    ...getRelatedRecords(activity).map((r) => r.name),
  ];
  return parts.join(" ").toLowerCase();
}

export function filterActivitiesForRecord(
  items: Activity[],
  ref: { leadId?: string; contactId?: string; companyId?: string; dealId?: string },
): Activity[] {
  function matches(activity: Activity): boolean {
    if (ref.leadId && activity.leadId === ref.leadId) return true;
    if (ref.contactId && activity.contactId === ref.contactId) return true;
    if (ref.companyId && activity.companyId === ref.companyId) return true;
    if (ref.dealId && activity.dealId === ref.dealId) return true;
    return false;
  }
  return items.filter(matches);
}
