"use client";

import * as React from "react";

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
  ListTodo,
  Mail,
  MinusCircle,
  Pencil,
  Phone,
  Pin,
  RotateCcw,
  UserCheck,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import { ArchiveRestoreDialog } from "../../_components/archive-restore-dialog";
import { LeadForm } from "../../_components/lead-form";
import { getScoreClassification } from "../../_components/leads-columns";
import type { ActivityItem, LeadNote, LeadStatus, LeadTask } from "../../_components/leads-data/schema";
import { useLeadStore } from "../../_components/leads-data/use-lead-store";

const today = new Date(2026, 7, 16);

const statusMeta: Record<LeadStatus, { badgeClass: string; dotClass: string }> = {
  New: {
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  Contacted: {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  Qualified: {
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Unqualified: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Nurturing: {
    badgeClass:
      "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
    dotClass: "bg-purple-500",
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
  assignment: { icon: UserCheck, color: "text-indigo-600 bg-indigo-500/10 dark:text-indigo-400" },
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

function getTaskStatusLabel(status: LeadTask["status"]): { label: string; className: string } {
  const map: Record<LeadTask["status"], { label: string; className: string }> = {
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

function getPriorityLabel(priority: LeadTask["priority"]): { label: string; className: string } {
  const map: Record<LeadTask["priority"], { label: string; className: string }> = {
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

function ActivityTimelineItem({ item }: { item: ActivityItem }) {
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

function TaskItem({ task }: { task: LeadTask }) {
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

function NoteItem({ note }: { note: LeadNote }) {
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

function getClassificationBadgeClass(classification: "Hot" | "Warm" | "Cold"): string {
  if (classification === "Hot") {
    return "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300";
  }
  if (classification === "Warm") {
    return "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300";
  }
  return "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300";
}

export function LeadDetail({ leadId }: { leadId: string }) {
  const lead = useLeadStore((s) => s.getLeadById(leadId));
  const archiveLead = useLeadStore((s) => s.archiveLead);
  const restoreLead = useLeadStore((s) => s.restoreLead);
  const sharedActivities = useActivityStore((s) => s.activities);
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = React.useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = React.useState(false);
  const [addActivityOpen, setAddActivityOpen] = React.useState(false);
  const [addTaskOpen, setAddTaskOpen] = React.useState(false);

  if (!lead) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <span className="text-muted-foreground text-sm">Lead not found.</span>
        <Link
          href="/dashboard/crm/leads"
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Leads
        </Link>
      </div>
    );
  }
  const classification = getScoreClassification(lead.score);
  const statusMeta_ = statusMeta[lead.status];
  const ownerName = lead.ownerId ? getOwnerName(lead.ownerId) : "Unassigned";
  const isArchived = Boolean(lead.archivedAt);

  const sharedTypeMap = { Call: "call", Meeting: "meeting", Email: "email", Task: "task", Note: "note" } as const;
  const mappedSharedActivities: ActivityItem[] = filterActivitiesForRecord(sharedActivities, {
    leadId: lead.id,
  }).map((activity) => ({
    id: activity.id,
    type: sharedTypeMap[activity.type],
    title: activity.title,
    description: activity.description,
    timestamp: getActivityTimestamp(activity),
    actor: activity.ownerId ?? undefined,
    outcome: activity.outcome ?? undefined,
  }));
  const mergedTimeline = [...(lead.activityTimeline ?? []), ...mappedSharedActivities].sort(
    (a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime(),
  );

  const sortedNotes = [...(lead.notes ?? [])].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime();
  });

  const activeTasks = (lead.tasks ?? []).filter((t) => t.status !== "completed" && t.status !== "cancelled");
  const completedTasks = (lead.tasks ?? []).filter((t) => t.status === "completed" || t.status === "cancelled");
  const hasCompany = Boolean(lead.company);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Link
        href="/dashboard/crm/leads"
        className="inline-flex w-fit items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Leads
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className={cn("size-14 font-medium", avatarTone(lead.name))}>
          <AvatarFallback className="text-lg">{getInitials(lead.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading font-semibold text-2xl text-foreground leading-tight tracking-tight">
            {lead.name}
          </h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            {lead.jobTitle ? <span>{lead.jobTitle}</span> : null}
            {lead.jobTitle && hasCompany ? <span>·</span> : null}
            {hasCompany ? <span>{lead.company}</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", statusMeta_.badgeClass)} variant="outline">
              <span className={cn("size-1.5 rounded-full", statusMeta_.dotClass)} />
              {lead.status}
            </Badge>
            <Badge
              className={cn("gap-1.5 border px-2 py-1 font-medium", getClassificationBadgeClass(classification))}
              variant="outline"
            >
              Score {lead.score} · {classification}
            </Badge>
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
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setArchiveDialogOpen(true)}>
                <Archive className="size-4" />
                Archive
              </Button>
            </>
          )}
        </div>
      </div>

      {isArchived ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-500/5 px-4 py-2.5 text-sm dark:border-amber-600/30">
          <Archive className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300">
            This lead is archived. It was archived on{" "}
            {lead.archivedAt ? formatDate(lead.archivedAt) : "an unknown date"}.
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              label="Email"
              value={
                <a href={`mailto:${lead.email}`} className="hover:underline">
                  {lead.email}
                </a>
              }
            />
            <InfoItem
              label="Phone"
              value={
                lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )
              }
            />
            <InfoItem label="Location" value={lead.location} />
            <InfoItem label="Time Zone" value={lead.timezone} />
            <InfoItem
              label="Preferred Contact"
              value={
                lead.preferredContact
                  ? lead.preferredContact.charAt(0).toUpperCase() + lead.preferredContact.slice(1).replace("_", " ")
                  : undefined
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem label="Source" value={lead.source} />
            <InfoItem label="Status" value={lead.status} />
            <InfoItem label="Score" value={`${lead.score} / 100`} />
            <InfoItem
              label="Tags"
              value={
                lead.tags && lead.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag) => (
                      <Badge key={tag} className="rounded-full px-2 py-0.5 text-xs" variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">No tags</span>
                )
              }
            />
            <InfoItem label="Owner" value={ownerName} />
            <InfoItem label="Created" value={formatDate(lead.createdAt)} />
            {lead.updatedAt ? <InfoItem label="Updated" value={formatDate(lead.updatedAt)} /> : null}
            <InfoItem label="Last Activity" value={formatDate(lead.lastActivity)} />
            <InfoItem
              label="Next Activity"
              value={lead.nextActivity ? formatDate(lead.nextActivity) : "Not scheduled"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCompany ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem label="Company Name" value={lead.company} />
                {lead.companyIndustry ? <InfoItem label="Industry" value={lead.companyIndustry} /> : null}
                {lead.companyWebsite ? (
                  <InfoItem
                    label="Website"
                    value={
                      <a
                        href={lead.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {lead.companyWebsite.replace(/^https?:\/\//, "")}
                      </a>
                    }
                  />
                ) : null}
                {lead.companySize ? <InfoItem label="Company Size" value={lead.companySize} /> : null}
                {lead.location ? <InfoItem label="Location" value={lead.location} /> : null}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Building2 />
                  </EmptyMedia>
                  <EmptyTitle>No company associated</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <EmptyDescription>This lead does not have a company assigned yet.</EmptyDescription>
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
                  <EmptyDescription>No notes have been added for this lead yet.</EmptyDescription>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>

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
                <EmptyDescription>No activity has been recorded for this lead yet.</EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Activities and Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {(lead.tasks ?? []).length > 0 ? (
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
                <EmptyTitle>No upcoming activities</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>There are no tasks or activities scheduled for this lead.</EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      <LeadForm open={editOpen} onOpenChange={setEditOpen} lead={lead} />
      <ActivityForm
        open={addActivityOpen}
        onOpenChange={(open) => {
          if (!open) setAddActivityOpen(false);
        }}
        defaultRelated={{ leadId: lead.id }}
      />
      <ActivityForm
        open={addTaskOpen}
        onOpenChange={(open) => {
          if (!open) setAddTaskOpen(false);
        }}
        defaultType="Task"
        lockType
        defaultRelated={{ leadId: lead.id }}
      />
      <ArchiveRestoreDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        mode="archive"
        count={1}
        onConfirm={() => {
          archiveLead(lead.id, currentSalesOwnerId);
          toast("Lead archived", { description: `${lead.name} has been archived.` });
        }}
      />
      <ArchiveRestoreDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        mode="restore"
        count={1}
        onConfirm={() => {
          restoreLead(lead.id);
          toast("Lead restored", { description: `${lead.name} has been restored.` });
        }}
      />
    </div>
  );
}
