"use client";

import { useState } from "react";

import Link from "next/link";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import {
  Archive,
  ArrowLeft,
  Building2,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  ListTodo,
  Mail,
  MinusCircle,
  MoreHorizontal,
  Phone,
  Pin,
  RotateCcw,
  TrendingUp,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { ActivityForm } from "@/app/(main)/dashboard/crm/_components/activities/activity-form";
import {
  filterActivitiesForRecord,
  getActivityTimestamp,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { useActivityStore } from "@/app/(main)/dashboard/crm/_components/activities/use-activity-store";
import { currentSalesOwnerId, getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { ContactArchiveRestoreDialog } from "@/app/(main)/dashboard/crm/contacts/_components/contact-archive-restore-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import { ContactForm } from "../../_components/contact-form";
import { contacts as staticContacts } from "../../_components/contacts-data/data";
import type {
  ContactActivityItem,
  ContactLifecycleStage,
  ContactNote,
  ContactTask,
} from "../../_components/contacts-data/schema";
import { useContactStore } from "../../_components/contacts-data/use-contact-store";

const today = new Date(2026, 7, 16);

const lifecycleMeta: Record<ContactLifecycleStage, { badgeClass: string; dotClass: string }> = {
  Subscriber: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Lead: {
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  "Marketing Qualified": {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  "Sales Qualified": {
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Opportunity: {
    badgeClass:
      "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
    dotClass: "bg-purple-500",
  },
  Customer: {
    badgeClass:
      "border-teal-200 bg-teal-500/10 text-teal-700 dark:border-teal-900/40 dark:bg-teal-500/15 dark:text-teal-300",
    dotClass: "bg-teal-500",
  },
  "Former Customer": {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
};

const activityIcons: Record<string, { icon: typeof Mail; color: string }> = {
  creation: { icon: FileText, color: "text-muted-foreground bg-muted/50" },
  email: { icon: Mail, color: "text-blue-600 bg-blue-500/10 dark:text-blue-400" },
  call: { icon: Phone, color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" },
  meeting: { icon: Video, color: "text-purple-600 bg-purple-500/10 dark:text-purple-400" },
  note: { icon: FileText, color: "text-amber-600 bg-amber-500/10 dark:text-amber-400" },
  task: { icon: CheckCircle2, color: "text-sky-600 bg-sky-500/10 dark:text-sky-400" },
  status_change: { icon: MinusCircle, color: "text-orange-600 bg-orange-500/10 dark:text-orange-400" },
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

function formatTimestamp(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "MMM d, yyyy 'at' h:mm a");
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

function getTaskStatusLabel(status: ContactTask["status"]): { label: string; className: string } {
  const map: Record<ContactTask["status"], { label: string; className: string }> = {
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
    cancelled: { label: "Cancelled", className: "border-border bg-muted/50 text-muted-foreground line-through" },
  };
  return map[status];
}

function getPriorityLabel(priority: ContactTask["priority"]): { label: string; className: string } {
  const map: Record<ContactTask["priority"], { label: string; className: string }> = {
    low: { label: "Low", className: "border-border bg-muted/50 text-muted-foreground" },
    medium: {
      label: "Medium",
      className:
        "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
    },
    high: {
      label: "High",
      className:
        "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    },
    urgent: {
      label: "Urgent",
      className:
        "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300",
    },
  };
  return map[priority];
}

function avatarTone(name: string) {
  const tones = [
    "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700 dark:[&_[data-slot=avatar-fallback]]:bg-amber-500/15 dark:[&_[data-slot=avatar-fallback]]:text-amber-300",
    "[&_[data-slot=avatar-fallback]]:bg-orange-100 [&_[data-slot=avatar-fallback]]:text-orange-700 dark:[&_[data-slot=avatar-fallback]]:bg-orange-500/15 dark:[&_[data-slot=avatar-fallback]]:text-orange-300",
    "[&_[data-slot=avatar-fallback]]:bg-rose-100 [&_[data-slot=avatar-fallback]]:text-rose-700 dark:[&_[data-slot=avatar-fallback]]:bg-rose-500/15 dark:[&_[data-slot=avatar-fallback]]:text-rose-300",
    "[&_[data-slot=avatar-fallback]]:bg-pink-100 [&_[data-slot=avatar-fallback]]:text-pink-700 dark:[&_[data-slot=avatar-fallback]]:bg-pink-500/15 dark:[&_[data-slot=avatar-fallback]]:text-pink-300",
    "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700 dark:[&_[data-slot=avatar-fallback]]:bg-purple-500/15 dark:[&_[data-slot=avatar-fallback]]:text-purple-300",
    "[&_[data-slot=avatar-fallback]]:bg-violet-100 [&_[data-slot=avatar-fallback]]:text-violet-700 dark:[&_[data-slot=avatar-fallback]]:bg-violet-500/15 dark:[&_[data-slot=avatar-fallback]]:text-violet-300",
    "[&_[data-slot=avatar-fallback]]:bg-indigo-100 [&_[data-slot=avatar-fallback]]:text-indigo-700 dark:[&_[data-slot=avatar-fallback]]:bg-indigo-500/15 dark:[&_[data-slot=avatar-fallback]]:text-indigo-300",
    "[&_[data-slot=avatar-fallback]]:bg-sky-100 [&_[data-slot=avatar-fallback]]:text-sky-700 dark:[&_[data-slot=avatar-fallback]]:bg-sky-500/15 dark:[&_[data-slot=avatar-fallback]]:text-sky-300",
    "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700 dark:[&_[data-slot=avatar-fallback]]:bg-emerald-500/15 dark:[&_[data-slot=avatar-fallback]]:text-emerald-300",
    "[&_[data-slot=avatar-fallback]]:bg-teal-100 [&_[data-slot=avatar-fallback]]:text-teal-700 dark:[&_[data-slot=avatar-fallback]]:bg-teal-500/15 dark:[&_[data-slot=avatar-fallback]]:text-teal-300",
  ];
  return tones[name.length % tones.length];
}

function ActivityTimelineItem({ item }: { item: ContactActivityItem }) {
  const config = activityIcons[item.type] ?? activityIcons.note;
  const Icon = config.icon;
  const actorName = item.actor ? getOwnerName(item.actor) : undefined;

  return (
    <div className="flex gap-3">
      <div className="relative flex flex-col items-center pt-0.5">
        <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", config.color)}>
          <Icon className="size-3.5" />
        </div>
        <div className="absolute top-8 bottom-0 w-px bg-border" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground text-sm">{item.title}</span>
          {item.outcome ? (
            <Badge className="rounded-full px-2 py-0.5 text-[10px]" variant="outline">
              {item.outcome}
            </Badge>
          ) : null}
        </div>
        {item.description ? <p className="mt-0.5 text-muted-foreground text-sm">{item.description}</p> : null}
        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
          {actorName ? <span>{actorName}</span> : null}
          {actorName ? <span>·</span> : null}
          <span>{formatTimestamp(item.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: ContactTask }) {
  const dueLabel = getTaskDueLabel(task.dueDate);
  const statusLabel = getTaskStatusLabel(task.status);
  const priorityLabel = getPriorityLabel(task.priority);
  const ownerName = task.ownerId ? getOwnerName(task.ownerId) : "Unassigned";
  const isOverdue =
    task.status !== "completed" &&
    task.status !== "cancelled" &&
    task.dueDate &&
    differenceInCalendarDays(parseISO(task.dueDate), today) < 0;
  const isDueToday =
    task.status !== "completed" &&
    task.status !== "cancelled" &&
    task.dueDate &&
    differenceInCalendarDays(parseISO(task.dueDate), today) === 0;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3 py-2.5",
        isOverdue && "border-destructive/30 bg-destructive/5",
        isDueToday && "border-amber-300/30 bg-amber-500/5 dark:border-amber-600/30",
        task.status === "completed" && "bg-muted/20",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn("font-medium text-sm", task.status === "completed" && "text-muted-foreground line-through")}
          >
            {task.title}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <Badge className={cn("rounded-full px-2 py-0.5", statusLabel.className)} variant="outline">
            {statusLabel.label}
          </Badge>
          <Badge className={cn("rounded-full px-2 py-0.5", priorityLabel.className)} variant="outline">
            {priorityLabel.label}
          </Badge>
          <span className="text-muted-foreground">{ownerName}</span>
        </div>
      </div>
      <div className="shrink-0 text-right text-muted-foreground text-xs tabular-nums">
        <div>{dueLabel.label}</div>
        {task.dueDate ? <div>{format(parseISO(task.dueDate), "MMM d")}</div> : null}
      </div>
    </div>
  );
}

function NoteItem({ note }: { note: ContactNote }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border px-3 py-2.5",
        note.pinned && "border-amber-300/30 bg-amber-500/5 dark:border-amber-600/30",
      )}
    >
      <div className="flex items-center gap-2">
        {note.pinned ? <Pin className="size-3 text-amber-500" /> : null}
        <span className="font-medium text-foreground text-sm">{note.author}</span>
        <span className="text-muted-foreground text-xs">{formatDateTime(note.createdAt)}</span>
      </div>
      <p className="whitespace-pre-wrap text-foreground text-sm">{note.content}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-foreground text-sm">
        {value || <span className="text-muted-foreground italic">Not provided</span>}
      </span>
    </div>
  );
}

function LifecycleBadge({ stage }: { stage: ContactLifecycleStage }) {
  const meta = lifecycleMeta[stage];
  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {stage}
    </Badge>
  );
}

function formatCurrencyValue(amount: number): string {
  return formatCurrency(amount, { noDecimals: true });
}

export function ContactDetail({ contactId }: { contactId: string }) {
  const storeContact = useContactStore((s) => s.contacts.find((c) => c.id === contactId));
  const contact = storeContact ?? staticContacts.find((c) => c.id === contactId);
  const archiveContact = useContactStore((s) => s.archiveContact);
  const restoreContact = useContactStore((s) => s.restoreContact);
  const sharedActivities = useActivityStore((s) => s.activities);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [activitySheetOpen, setActivitySheetOpen] = useState(false);
  const [activityDefaultType, setActivityDefaultType] = useState<"Email" | "Call" | "Meeting" | undefined>(undefined);
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);

  function openQuickActivity(type?: "Email" | "Call" | "Meeting") {
    setActivityDefaultType(type);
    setActivitySheetOpen(true);
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <span className="text-muted-foreground text-sm">Contact not found.</span>
        <Link
          href="/dashboard/crm/contacts"
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Contacts
        </Link>
      </div>
    );
  }

  const isArchived = Boolean(contact.archivedAt);
  const hasCompany = Boolean(contact.companyId);
  const ownerName = contact.ownerId ? getOwnerName(contact.ownerId) : "Unassigned";

  const sharedTypeMap = { Call: "call", Meeting: "meeting", Email: "email", Task: "task", Note: "note" } as const;
  const mappedSharedActivities: ContactActivityItem[] = filterActivitiesForRecord(sharedActivities, {
    contactId: contact.id,
  }).map((activity) => ({
    id: activity.id,
    type: sharedTypeMap[activity.type],
    title: activity.title,
    description: activity.description,
    timestamp: getActivityTimestamp(activity),
    actor: activity.ownerId ?? undefined,
    outcome: activity.outcome ?? undefined,
  }));
  const mergedTimeline = [...(contact.activityTimeline ?? []), ...mappedSharedActivities].sort(
    (a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime(),
  );

  const sortedNotes = [...(contact.notes ?? [])].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime();
  });
  const activeTasks = (contact.tasks ?? []).filter((t) => t.status !== "completed" && t.status !== "cancelled");
  const completedTasks = (contact.tasks ?? []).filter((t) => t.status === "completed" || t.status === "cancelled");
  const closedDeals = (contact.relatedDeals ?? []).filter((d) => d.stage === "Closed Won" || d.stage === "Closed Lost");
  const openDeals = (contact.relatedDeals ?? []).filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Link
        href="/dashboard/crm/contacts"
        className="inline-flex w-fit items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Contacts
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className={cn("size-14 font-medium", avatarTone(contact.name))}>
          <AvatarFallback className="text-lg">{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading font-semibold text-2xl text-foreground leading-tight tracking-tight">
            {contact.name}
          </h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            {contact.jobTitle ? <span>{contact.jobTitle}</span> : null}
            {contact.jobTitle && hasCompany ? <span>·</span> : null}
            {hasCompany ? <span>{contact.companyName}</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <LifecycleBadge stage={contact.lifecycleStage} />
            <span className="text-muted-foreground text-sm">Owner: {ownerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isArchived ? (
            <Button variant="outline" size="sm" onClick={() => setRestoreDialogOpen(true)}>
              <RotateCcw className="size-4" />
              Restore
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditSheetOpen(true)}>
                Edit Contact
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    <MoreHorizontal className="size-4" />
                    More Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditSheetOpen(true)}>Edit Contact</DropdownMenuItem>
                  <DropdownMenuItem disabled>Assign Owner (coming soon)</DropdownMenuItem>
                  <DropdownMenuItem disabled>Change Lifecycle Stage (coming soon)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setArchiveDialogOpen(true)} variant="destructive">
                    Archive Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {isArchived ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-500/5 px-4 py-2.5 text-sm dark:border-amber-600/30">
          <Archive className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300">
            This contact is archived. It was archived on{" "}
            {contact.archivedAt ? formatDate(contact.archivedAt) : "an unknown date"}.
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" disabled={isArchived} onClick={() => openQuickActivity("Call")}>
          <Phone className="size-4" />
          Call
        </Button>
        <Button variant="outline" size="sm" disabled={isArchived} onClick={() => openQuickActivity("Meeting")}>
          <CalendarClock className="size-4" />
          Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Relationship Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Open Deals</span>
                  <span className="font-semibold text-2xl tabular-nums">{contact.openDealCount}</span>
                  {contact.openDealCount > 0 ? (
                    <span className="text-muted-foreground text-xs">{formatCurrencyValue(contact.openDealValue)}</span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Closed Deals</span>
                  <span className="font-semibold text-2xl tabular-nums">{contact.closedDealCount ?? 0}</span>
                  {(contact.closedDealValue ?? 0) > 0 ? (
                    <span className="text-muted-foreground text-xs">
                      {formatCurrencyValue(contact.closedDealValue ?? 0)}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Last Contacted</span>
                  <span className="text-foreground text-sm">
                    {contact.lastContacted ? formatDate(contact.lastContacted) : "Never"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Next Activity</span>
                  <span className="text-foreground text-sm">
                    {contact.nextActivity ? formatDate(contact.nextActivity) : "Not scheduled"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardAction className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" disabled={isArchived} onClick={() => setTaskSheetOpen(true)}>
                  <ListTodo className="size-4" />
                  Add Task
                </Button>
                <Button variant="outline" size="sm" disabled={isArchived} onClick={() => openQuickActivity()}>
                  <CalendarPlus className="size-4" />
                  Add Activity
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {mergedTimeline.length > 0 ? (
                <div className="flex flex-col">
                  {mergedTimeline.map((item) => (
                    <ActivityTimelineItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Clock />
                    </EmptyMedia>
                    <EmptyTitle>No activity yet</EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <EmptyDescription>No activity has been recorded for this contact yet.</EmptyDescription>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {(contact.tasks ?? []).length > 0 ? (
                <div className="flex flex-col gap-3">
                  {activeTasks.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {activeTasks
                        .sort((a, b) => {
                          if (!a.dueDate) return 1;
                          if (!b.dueDate) return -1;
                          return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
                        })
                        .map((task) => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                  ) : null}
                  {completedTasks.length > 0 ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <Separator />
                      <span className="mt-1 text-muted-foreground text-xs uppercase tracking-wide">Completed</span>
                      {completedTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CalendarClock />
                    </EmptyMedia>
                    <EmptyTitle>No tasks</EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <EmptyDescription>There are no tasks scheduled for this contact.</EmptyDescription>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedNotes.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {sortedNotes.map((note) => (
                    <NoteItem key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileText />
                    </EmptyMedia>
                    <EmptyTitle>No notes</EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <EmptyDescription>No notes have been added for this contact yet.</EmptyDescription>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <InfoItem
                label="Email"
                value={
                  <a href={`mailto:${contact.email}`} className="hover:underline">
                    {contact.email}
                  </a>
                }
              />
              <InfoItem
                label="Phone"
                value={
                  contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="hover:underline">
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )
                }
              />
              <InfoItem label="Location" value={contact.location} />
              <InfoItem label="Time Zone" value={contact.timezone} />
              <InfoItem
                label="Preferred Contact"
                value={
                  contact.preferredContact
                    ? contact.preferredContact.charAt(0).toUpperCase() +
                      contact.preferredContact.slice(1).replace("_", " ")
                    : undefined
                }
              />
              {contact.profileUrl ? (
                <InfoItem
                  label="Profile"
                  value={
                    <a
                      href={contact.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      View Profile <Globe className="size-3" />
                    </a>
                  }
                />
              ) : null}
            </CardContent>
          </Card>

          {hasCompany ? (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <InfoItem label="Company Name" value={contact.companyName} />
                {contact.companyIndustry ? <InfoItem label="Industry" value={contact.companyIndustry} /> : null}
                {contact.companyWebsite ? (
                  <InfoItem
                    label="Website"
                    value={
                      <a
                        href={contact.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        {contact.companyWebsite.replace(/^https?:\/\//, "")} <Globe className="size-3" />
                      </a>
                    }
                  />
                ) : null}
                {contact.companySize ? <InfoItem label="Company Size" value={contact.companySize} /> : null}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Building2 />
                    </EmptyMedia>
                    <EmptyTitle>No company</EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <EmptyDescription>This contact does not have a company assigned.</EmptyDescription>
                  </EmptyContent>
                </Empty>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>CRM Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <InfoItem label="Source" value={contact.source} />
              <InfoItem label="Lifecycle Stage" value={contact.lifecycleStage} />
              <InfoItem label="Owner" value={ownerName} />
              <InfoItem label="Created" value={formatDate(contact.createdAt)} />
              {contact.updatedAt ? <InfoItem label="Updated" value={formatDate(contact.updatedAt)} /> : null}
              <InfoItem label="Primary Contact" value={contact.isPrimaryContact ? "Yes" : "No"} />
              {isArchived ? (
                <>
                  <InfoItem
                    label="Archived On"
                    value={contact.archivedAt ? formatDate(contact.archivedAt) : undefined}
                  />
                  <InfoItem
                    label="Archived By"
                    value={contact.archivedBy ? getOwnerName(contact.archivedBy) : undefined}
                  />
                </>
              ) : null}
            </CardContent>
          </Card>

          {(openDeals.length > 0 || closedDeals.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Related Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {openDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-sm">{deal.name}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Badge className="rounded-full px-2 py-0.5 text-[10px]" variant="outline">
                            {deal.stage}
                          </Badge>
                        </div>
                      </div>
                      <span className="shrink-0 font-medium text-sm tabular-nums">
                        {formatCurrencyValue(deal.value)}
                      </span>
                    </div>
                  ))}
                  {closedDeals.length > 0 && openDeals.length > 0 ? <Separator /> : null}
                  {closedDeals.length > 0 ? (
                    <>
                      {openDeals.length > 0 ? (
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">Closed</span>
                      ) : null}
                      {closedDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between rounded-lg border px-3 py-2.5 opacity-60"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-sm line-through">{deal.name}</div>
                            <div className="mt-0.5 flex items-center gap-2">
                              <Badge
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px]",
                                  deal.stage === "Closed Won"
                                    ? "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                                    : "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300",
                                )}
                                variant="outline"
                              >
                                {deal.stage}
                              </Badge>
                            </div>
                          </div>
                          <span className="shrink-0 font-medium text-sm tabular-nums">
                            {formatCurrencyValue(deal.value)}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}

          {contact.tags && contact.tags.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} className="rounded-full px-2.5 py-0.5 text-xs" variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {(contact.lastContacted || contact.createdAt) && (
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <InfoItem label="Created" value={formatDate(contact.createdAt)} />
                {contact.lastContacted ? (
                  <InfoItem
                    label="Last Contacted"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <TrendingUp className="size-3 text-emerald-500" />
                        {formatDate(contact.lastContacted)}
                      </span>
                    }
                  />
                ) : null}
                {contact.nextActivity ? (
                  <InfoItem
                    label="Next Activity"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarClock className="size-3 text-blue-500" />
                        {formatDate(contact.nextActivity)}
                      </span>
                    }
                  />
                ) : null}
                {contact.updatedAt ? <InfoItem label="Last Updated" value={formatDate(contact.updatedAt)} /> : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {contact ? <ContactForm contact={contact} open={editSheetOpen} onOpenChange={setEditSheetOpen} /> : null}

      <ActivityForm
        open={activitySheetOpen}
        onOpenChange={(open) => {
          if (!open) setActivitySheetOpen(false);
        }}
        defaultRelated={{ contactId: contact.id }}
        defaultType={activityDefaultType}
      />

      <ActivityForm
        open={taskSheetOpen}
        onOpenChange={(open) => {
          if (!open) setTaskSheetOpen(false);
        }}
        defaultRelated={{ contactId: contact.id }}
        defaultType="Task"
        lockType
      />

      <ContactArchiveRestoreDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        mode="archive"
        count={1}
        contactName={contact.name}
        onConfirm={() => {
          archiveContact(contact.id, currentSalesOwnerId);
          toast("Contact archived", { description: `${contact.name} has been archived.` });
        }}
      />

      <ContactArchiveRestoreDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        mode="restore"
        count={1}
        contactName={contact.name}
        onConfirm={() => {
          restoreContact(contact.id);
          toast("Contact restored", { description: `${contact.name} has been restored.` });
        }}
      />
    </div>
  );
}
