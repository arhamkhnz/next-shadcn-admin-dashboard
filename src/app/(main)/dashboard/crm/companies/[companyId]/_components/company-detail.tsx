"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import {
  Archive,
  ArrowLeft,
  Building2,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  ListTodo,
  Mail,
  MinusCircle,
  Phone,
  RotateCcw,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { ActivityForm } from "@/app/(main)/dashboard/crm/_components/activities/activity-form";
import {
  filterActivitiesForRecord,
  getActivityTimestamp,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { useActivityStore } from "@/app/(main)/dashboard/crm/_components/activities/use-activity-store";
import { currentSalesOwnerId, getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { useLeadStore } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/use-lead-store";
import { CustomFieldsCard } from "@/components/crm/table-engine/custom-fields-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type {
  Company,
  CompanyActivityItem,
  CompanyDeal,
  CompanyNote,
  CompanyTask,
} from "../../_components/companies-data/schema";
import { useCompanyStore } from "../../_components/companies-data/use-company-store";
import { CompanyArchiveRestoreDialog } from "../../_components/company-archive-restore-dialog";

const today = new Date(2026, 7, 16);

const typeMeta: Record<Company["type"], { badgeClass: string; dotClass: string }> = {
  Customer: {
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Prospect: {
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  Partner: {
    badgeClass:
      "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
    dotClass: "bg-purple-500",
  },
  "Former Customer": {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
};

const activityIcons: Record<CompanyActivityItem["type"], { icon: typeof Mail; color: string }> = {
  email: { icon: Mail, color: "text-blue-600 bg-blue-500/10 dark:text-blue-400" },
  call: { icon: Phone, color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" },
  meeting: { icon: Users, color: "text-purple-600 bg-purple-500/10 dark:text-purple-400" },
  note: { icon: FileText, color: "text-amber-600 bg-amber-500/10 dark:text-amber-400" },
  status_change: { icon: MinusCircle, color: "text-orange-600 bg-orange-500/10 dark:text-orange-400" },
  task: { icon: CheckCircle2, color: "text-sky-600 bg-sky-500/10 dark:text-sky-400" },
};

function formatDateTime(dateStr: string): string {
  const date = parseISO(dateStr);
  const diff = differenceInCalendarDays(today, date);
  const timeStr = format(date, "h:mm a");

  if (diff === 0) return `Today at ${timeStr}`;
  if (diff === 1) return `Yesterday at ${timeStr}`;
  if (diff < 7) return `${diff} days ago at ${timeStr}`;
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  const diff = differenceInCalendarDays(today, date);

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return format(date, "MMM d, yyyy");
}

function getTaskDueLabel(dueDate: string | null): {
  label: string;
  variant: "destructive" | "warning" | "default" | "secondary";
} {
  if (!dueDate) return { label: "No due date", variant: "default" };
  const diff = differenceInCalendarDays(parseISO(dueDate), today);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, variant: "destructive" };
  if (diff === 0) return { label: "Due today", variant: "warning" };
  if (diff === 1) return { label: "Due tomorrow", variant: "default" };
  return { label: `Due in ${diff} days`, variant: "default" };
}

function getTaskStatusLabel(status: CompanyTask["status"]): { label: string; className: string } {
  const map: Record<CompanyTask["status"], { label: string; className: string }> = {
    pending: { label: "Pending", className: "border-border bg-muted/50 text-muted-foreground" },
    in_progress: {
      label: "In Progress",
      className:
        "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    },
    completed: {
      label: "Completed",
      className:
        "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
  };
  return map[status];
}

function getDealStatusLabel(status: CompanyDeal["status"]): { label: string; className: string } {
  const map: Record<CompanyDeal["status"], { label: string; className: string }> = {
    Prospecting: {
      label: "Prospecting",
      className: "border-border bg-muted/50 text-muted-foreground",
    },
    Qualification: {
      label: "Qualification",
      className:
        "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    },
    Proposal: {
      label: "Proposal",
      className:
        "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    },
    Negotiation: {
      label: "Negotiation",
      className:
        "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
    },
    "Closed Won": {
      label: "Won",
      className:
        "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    "Closed Lost": {
      label: "Lost",
      className: "border-border bg-muted/50 text-muted-foreground",
    },
  };
  return map[status];
}

function avatarTone(name: string) {
  const tones = [
    "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700 dark:[&_[data-slot=avatar-fallback]]:bg-amber-500/15 dark:[&_[data-slot=avatar-fallback]]:text-amber-300",
    "[&_[data-slot=avatar-fallback]]:bg-orange-100 [&_[data-slot=avatar-fallback]]:text-orange-700 dark:[&_[data-slot=avatar-fallback]]:bg-orange-500/15 dark:[&_[data-slot=avatar-fallback]]:text-orange-300",
    "[&_[data-slot=avatar-fallback]]:bg-rose-100 [&_[data-slot=avatar-fallback]]:text-rose-700 dark:[&_[data-slot=avatar-fallback]]:bg-rose-500/15 dark:[&_[data-slot=avatar-fallback]]:text-rose-300",
    "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700 dark:[&_[data-slot=avatar-fallback]]:bg-purple-500/15 dark:[&_[data-slot=avatar-fallback]]:text-purple-300",
    "[&_[data-slot=avatar-fallback]]:bg-indigo-100 [&_[data-slot=avatar-fallback]]:text-indigo-700 dark:[&_[data-slot=avatar-fallback]]:bg-indigo-500/15 dark:[&_[data-slot=avatar-fallback]]:text-indigo-300",
    "[&_[data-slot=avatar-fallback]]:bg-sky-100 [&_[data-slot=avatar-fallback]]:text-sky-700 dark:[&_[data-slot=avatar-fallback]]:bg-sky-500/15 dark:[&_[data-slot=avatar-fallback]]:text-sky-300",
    "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700 dark:[&_[data-slot=avatar-fallback]]:bg-emerald-500/15 dark:[&_[data-slot=avatar-fallback]]:text-emerald-300",
    "[&_[data-slot=avatar-fallback]]:bg-teal-100 [&_[data-slot=avatar-fallback]]:text-teal-700 dark:[&_[data-slot=avatar-fallback]]:bg-teal-500/15 dark:[&_[data-slot=avatar-fallback]]:text-teal-300",
  ];
  return tones[name.length % tones.length];
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-muted-foreground text-xs">{label}</span>
      <span className="text-right text-foreground text-xs">{children}</span>
    </div>
  );
}

function ActivityTimelineItem({ item }: { item: CompanyActivityItem }) {
  const meta = activityIcons[item.type];
  const Icon = meta.icon;

  return (
    <div className="flex gap-3">
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", meta.color)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {item.subject ? (
            <span className="font-medium text-foreground text-sm">{item.subject}</span>
          ) : (
            <span className="font-medium text-foreground text-sm capitalize">{item.type.replace("_", " ")}</span>
          )}
          {item.contactName ? <span className="text-muted-foreground text-xs">· {item.contactName}</span> : null}
        </div>
        {item.description ? (
          <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{item.description}</p>
        ) : null}
        <span className="mt-1 block text-muted-foreground text-xs">{formatDateTime(item.timestamp)}</span>
      </div>
    </div>
  );
}

export function CompanyDetail({ companyId }: { companyId: string }) {
  const router = useRouter();
  const company = useCompanyStore((s) => s.getCompanyById(companyId));
  const archiveCompany = useCompanyStore((s) => s.archiveCompany);
  const restoreCompany = useCompanyStore((s) => s.restoreCompany);
  const sharedActivities = useActivityStore((s) => s.activities);
  const allContacts = useContactStore((s) => s.contacts);
  const allLeads = useLeadStore((s) => s.leads);
  const [activeTab, setActiveTab] = useState<"timeline" | "deals" | "contacts" | "leads" | "notes">("timeline");
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  if (!company) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <Link
          className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/dashboard/crm/companies"
        >
          <ArrowLeft className="size-4" />
          Companies
        </Link>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2 className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Company not found</EmptyTitle>
            <EmptyDescription>The requested company could not be found.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const ownerName = company.ownerId ? getOwnerName(company.ownerId) : null;
  const isArchived = Boolean(company.archivedAt);
  const primaryContact = company.primaryContactId ? allContacts.find((c) => c.id === company.primaryContactId) : null;

  const relatedContacts = allContacts.filter((c) => c.companyId === company.id && c.id !== company.primaryContactId);

  const relatedLeads = allLeads.filter((l) => l.company === company.name);

  const openDeals = (company.deals ?? []).filter((d) => d.status !== "Closed Won" && d.status !== "Closed Lost");
  const allDeals = company.deals ?? [];

  const pendingTasks = (company.tasks ?? []).filter((t) => t.status !== "completed");
  const upcomingTasks = pendingTasks
    .filter((t) => t.dueDate)
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));

  const totalContacts = relatedContacts.length + (primaryContact ? 1 : 0);

  const sharedTypeMap = { Call: "call", Meeting: "meeting", Email: "email", Task: "task", Note: "note" } as const;
  const mappedSharedActivities: CompanyActivityItem[] = filterActivitiesForRecord(sharedActivities, {
    companyId: company.id,
  }).map((activity) => ({
    id: activity.id,
    type: sharedTypeMap[activity.type],
    subject: activity.title,
    description: activity.description,
    timestamp: getActivityTimestamp(activity),
    contactName: activity.contactId ? allContacts.find((c) => c.id === activity.contactId)?.name : undefined,
  }));
  const mergedTimeline = [...(company.activityTimeline ?? []), ...mappedSharedActivities].sort(
    (a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime(),
  );
  const lastActivityItem = mergedTimeline[0];
  const nextTask = upcomingTasks[0];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Link
        className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
        href="/dashboard/crm/companies"
      >
        <ArrowLeft className="size-4" />
        Companies
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className={cn("size-14 font-medium", avatarTone(company.name))}>
            <AvatarFallback>
              <Building2 className="size-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate font-semibold text-foreground text-xl tracking-tight">{company.name}</h1>
              <Badge className={cn("text-xs", typeMeta[company.type].badgeClass)} variant="outline">
                <span className={cn("mr-1 size-1.5 rounded-full", typeMeta[company.type].dotClass)} />
                {company.type}
              </Badge>
            </div>
            {company.domain ? (
              <div className="mt-0.5 flex items-center gap-1 text-muted-foreground text-sm">
                <Globe className="size-3.5 shrink-0" />
                <span>{company.domain}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isArchived ? (
            <Button variant="outline" size="sm" onClick={() => setRestoreDialogOpen(true)}>
              <RotateCcw className="size-4" />
              Restore
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setArchiveDialogOpen(true)}>
              <Archive className="size-4" />
              Archive
            </Button>
          )}
        </div>
      </div>

      {isArchived ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-500/5 px-4 py-2.5 text-sm dark:border-amber-600/30">
          <Archive className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300">
            This company is archived. It was archived on{" "}
            {company.archivedAt ? formatDate(company.archivedAt) : "an unknown date"}.
          </span>
        </div>
      ) : null}

      {company.tags && company.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <Badge key={tag} className="text-xs" variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground tabular-nums">{totalContacts}</div>
              <div className="text-muted-foreground text-xs">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground tabular-nums">{openDeals.length}</div>
              <div className="text-muted-foreground text-xs">Open Deals</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground tabular-nums">
                {formatCurrency(company.openPipelineValue, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-muted-foreground text-xs">Open Pipeline</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground tabular-nums">
                {formatCurrency(company.wonRevenue, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-muted-foreground text-xs">Closed-Won</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground text-sm">
                {lastActivityItem ? formatDateTime(lastActivityItem.timestamp) : "—"}
              </div>
              <div className="text-muted-foreground text-xs">Last Activity</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground text-sm">
                {nextTask?.dueDate ? formatDate(nextTask.dueDate) : "—"}
              </div>
              <div className="text-muted-foreground text-xs">Next Activity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
            {(["timeline", "deals", "contacts", "leads", "notes"] as const).map((tab) => (
              <button
                key={tab}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 font-medium text-sm capitalize transition-colors",
                  activeTab === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                type="button"
                onClick={() => setActiveTab(tab)}
              >
                {tab === "timeline" && "Timeline"}
                {tab === "deals" && `Deals (${allDeals.length})`}
                {tab === "contacts" && `Contacts (${totalContacts})`}
                {tab === "leads" && `Leads (${relatedLeads.length})`}
                {tab === "notes" && `Notes (${(company.notes ?? []).length})`}
              </button>
            ))}
          </div>

          {activeTab === "timeline" && (
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardAction className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" disabled={isArchived} onClick={() => setAddTaskOpen(true)}>
                    <ListTodo className="size-4" />
                    Add Task
                  </Button>
                  <Button variant="outline" size="sm" disabled={isArchived} onClick={() => setAddActivityOpen(true)}>
                    <CalendarPlus className="size-4" />
                    Add Activity
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                {mergedTimeline.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {mergedTimeline.map((item) => (
                      <ActivityTimelineItem key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Clock className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>No activity yet</EmptyTitle>
                      <EmptyDescription>Activity will appear here as it happens.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "deals" && (
            <Card>
              <CardHeader>
                <CardTitle>Deals</CardTitle>
              </CardHeader>
              <CardContent>
                {allDeals.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {allDeals.map((deal) => {
                      const status = getDealStatusLabel(deal.status);
                      return (
                        <div key={deal.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-foreground text-sm">{deal.title}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-muted-foreground text-xs">
                              <Badge className={cn("text-xs", status.className)} variant="outline">
                                {status.label}
                              </Badge>
                              {deal.expectedCloseDate ? (
                                <span>Expected: {formatDate(deal.expectedCloseDate)}</span>
                              ) : null}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground text-sm tabular-nums">
                              {formatCurrency(deal.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <TrendingUp className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>No deals</EmptyTitle>
                      <EmptyDescription>Deals for this company will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "contacts" && (
            <Card>
              <CardHeader>
                <CardTitle>Related Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                {primaryContact || relatedContacts.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {primaryContact ? (
                      <Link
                        className="flex items-center gap-3 rounded-lg border p-3 transition-opacity hover:opacity-80"
                        href={`/dashboard/crm/contacts/${primaryContact.id}`}
                      >
                        <Avatar className={cn("font-medium", avatarTone(primaryContact.name))}>
                          <AvatarFallback>{getInitials(primaryContact.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground text-sm">{primaryContact.name}</div>
                          <div className="text-muted-foreground text-xs">{primaryContact.email}</div>
                        </div>
                        <Badge className="text-xs" variant="secondary">
                          Primary
                        </Badge>
                      </Link>
                    ) : null}
                    {relatedContacts.map((contact) => (
                      <Link
                        key={contact.id}
                        className="flex items-center gap-3 rounded-lg border p-3 transition-opacity hover:opacity-80"
                        href={`/dashboard/crm/contacts/${contact.id}`}
                      >
                        <Avatar className={cn("font-medium", avatarTone(contact.name))}>
                          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground text-sm">{contact.name}</div>
                          <div className="text-muted-foreground text-xs">{contact.email}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>No contacts</EmptyTitle>
                      <EmptyDescription>Contacts at this company will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "leads" && (
            <Card>
              <CardHeader>
                <CardTitle>Related Leads</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedLeads.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {relatedLeads.map((lead) => (
                      <Link
                        key={lead.id}
                        className="flex items-center gap-3 rounded-lg border p-3 transition-opacity hover:opacity-80"
                        href={`/dashboard/crm/leads/${lead.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground text-sm">{lead.name}</div>
                          <div className="text-muted-foreground text-xs">{lead.email}</div>
                        </div>
                        <Badge className="text-xs" variant="outline">
                          {lead.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <TrendingUp className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>No leads</EmptyTitle>
                      <EmptyDescription>Leads for this company will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "notes" && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {(company.notes ?? []).length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {(company.notes ?? []).map((n: CompanyNote) => (
                      <div key={n.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground text-sm">{n.authorName}</span>
                          <span className="text-muted-foreground text-xs">{formatDateTime(n.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{n.content}</p>
                        {n.updatedAt && n.updatedAt !== n.createdAt ? (
                          <span className="mt-1 block text-muted-foreground text-xs">
                            Edited {formatDateTime(n.updatedAt)}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileText className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>No notes</EmptyTitle>
                      <EmptyDescription>Notes about this company will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CustomFieldsCard entityType="company" pluralLabel="Companies" values={company.customFields} />

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <InfoRow label="Industry">
                <span>{company.industry}</span>
              </InfoRow>
              <Separator />
              <InfoRow label="Size">
                <span>{company.size} employees</span>
              </InfoRow>
              <Separator />
              <InfoRow label="Location">
                <span>{company.location ?? "—"}</span>
              </InfoRow>
              {company.phone ? (
                <>
                  <Separator />
                  <InfoRow label="Phone">
                    <span>{company.phone}</span>
                  </InfoRow>
                </>
              ) : null}
              {company.website ? (
                <>
                  <Separator />
                  <InfoRow label="Website">
                    <a
                      className="flex items-center gap-1 text-foreground text-xs transition-colors hover:text-primary"
                      href={company.website}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  </InfoRow>
                </>
              ) : null}
              {company.address ? (
                <>
                  <Separator />
                  <InfoRow label="Address">
                    <span>{company.address}</span>
                  </InfoRow>
                </>
              ) : null}
              {company.description ? (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground text-xs">Description</span>
                    <p className="mt-1 text-foreground text-xs leading-relaxed">{company.description}</p>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ownership & Classification</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <InfoRow label="Owner">
                {ownerName ? (
                  <div className="flex items-center gap-2">
                    <Avatar className={cn("size-5 font-medium", avatarTone(ownerName))}>
                      <AvatarFallback className="text-[10px]">{getInitials(ownerName)}</AvatarFallback>
                    </Avatar>
                    <span>{ownerName}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </InfoRow>
              <Separator />
              <InfoRow label="Primary Contact">
                {primaryContact ? (
                  <Link
                    className="flex items-center gap-1 text-foreground text-xs transition-colors hover:text-primary"
                    href={`/dashboard/crm/contacts/${primaryContact.id}`}
                  >
                    {primaryContact.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </InfoRow>
              <Separator />
              <InfoRow label="Type">
                <Badge className={cn("text-xs", typeMeta[company.type].badgeClass)} variant="outline">
                  {company.type}
                </Badge>
              </InfoRow>
              <Separator />
              <InfoRow label="Source">
                <span>{company.source ?? "—"}</span>
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {upcomingTasks.slice(0, 5).map((t) => {
                    const due = getTaskDueLabel(t.dueDate);
                    const status = getTaskStatusLabel(t.status);
                    return (
                      <div key={t.id} className="rounded-lg border p-3">
                        <div className="font-medium text-foreground text-sm">{t.title}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge className={cn("text-[10px]", status.className)} variant="outline">
                            {status.label}
                          </Badge>
                          <Badge
                            className={cn("text-[10px]", {
                              "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300":
                                due.variant === "destructive",
                              "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300":
                                due.variant === "warning",
                              "border-border bg-muted/50 text-muted-foreground": due.variant === "default",
                            })}
                            variant="outline"
                          >
                            <CalendarClock className="mr-1 size-3" />
                            {due.label}
                          </Badge>
                        </div>
                        {t.assigneeName ? (
                          <span className="mt-1 block text-muted-foreground text-xs">Assigned to {t.assigneeName}</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CheckCircle2 className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle>No tasks</EmptyTitle>
                    <EmptyDescription>No upcoming tasks for this company.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <InfoRow label="Created">
                <span>{formatDate(company.createdAt)}</span>
              </InfoRow>
              {company.updatedAt ? (
                <>
                  <Separator />
                  <InfoRow label="Updated">
                    <span>{formatDateTime(company.updatedAt)}</span>
                  </InfoRow>
                </>
              ) : null}
              {company.lastActivity ? (
                <>
                  <Separator />
                  <InfoRow label="Last Activity">
                    <span>{formatDateTime(company.lastActivity)}</span>
                  </InfoRow>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <ActivityForm
        open={addActivityOpen}
        onOpenChange={(open) => {
          if (!open) setAddActivityOpen(false);
        }}
        defaultRelated={{ companyId: company.id }}
      />
      <ActivityForm
        open={addTaskOpen}
        onOpenChange={(open) => {
          if (!open) setAddTaskOpen(false);
        }}
        defaultRelated={{ companyId: company.id }}
        defaultType="Task"
        lockType
      />
      <CompanyArchiveRestoreDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        mode="archive"
        count={1}
        companyName={company.name}
        onConfirm={() => {
          archiveCompany(company.id, currentSalesOwnerId);
          toast("Company archived", { description: `${company.name} has been archived.` });
          router.push("/dashboard/crm/companies");
        }}
      />
      <CompanyArchiveRestoreDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        mode="restore"
        count={1}
        companyName={company.name}
        onConfirm={() => {
          restoreCompany(company.id);
          toast("Company restored", { description: `${company.name} has been restored.` });
        }}
      />
    </div>
  );
}
