"use client";

import { useState } from "react";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

import { format, parseISO } from "date-fns";
import {
  Archive,
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Clock,
  FileText,
  ListTodo,
  Mail,
  MinusCircle,
  PenLine,
  Phone,
  Pin,
  RotateCcw,
  Tag,
  Trophy,
  UserCheck,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { ActivityForm } from "@/app/(main)/dashboard/crm/_components/activities/activity-form";
import {
  filterActivitiesForRecord,
  getActivityTimestamp,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { useActivityStore } from "@/app/(main)/dashboard/crm/_components/activities/use-activity-store";
import { currentSalesOwnerId, getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { CustomFieldsCard } from "@/components/crm/table-engine/custom-fields-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import { DealArchiveRestoreDialog } from "../../_components/deal-archive-restore-dialog";
import { DealForm } from "../../_components/deal-form";
import { ChangeStageDialog, MarkLostDialog, MarkWonDialog, ReopenDealDialog } from "../../_components/deal-workflows";
import { deals } from "../../_components/deals-data/data";
import type { DealActivity, DealNote, DealStage, DealTask } from "../../_components/deals-data/schema";
import { useDealStore } from "../../_components/deals-data/use-deal-store";

const today = new Date(2026, 7, 16);

const stageBadgeVariant: Record<DealStage, string> = {
  Discovery: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  Qualified: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "Proposal Sent": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Negotiation: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  "Closed Won": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "Closed Lost": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

const healthBadgeVariant: Record<string, string> = {
  Healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Attention: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "At Risk": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

const avatarTones = [
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

function avatarTone(name: string) {
  return avatarTones[name.length % avatarTones.length];
}

const activityIconMap: Record<string, { icon: typeof Mail; className: string }> = {
  email: { icon: Mail, className: "text-blue-600 dark:text-blue-400" },
  call: { icon: Phone, className: "text-emerald-600 dark:text-emerald-400" },
  meeting: { icon: Video, className: "text-purple-600 dark:text-purple-400" },
  note: { icon: FileText, className: "text-amber-600 dark:text-amber-400" },
  status_change: { icon: MinusCircle, className: "text-orange-600 dark:text-orange-400" },
  task: { icon: CheckCircle2, className: "text-sky-600 dark:text-sky-400" },
  creation: { icon: FileText, className: "text-muted-foreground" },
  assignment: { icon: UserCheck, className: "text-indigo-600 dark:text-indigo-400" },
};

function formatDate(d: string | null): string {
  if (!d) return "—";
  return format(parseISO(d), "MMM d, yyyy");
}

function formatDateTime(d: string): string {
  return format(parseISO(d), "MMM d, yyyy 'at' h:mm a");
}

function getTaskDueLabel(dueDate: string | null): { label: string; className: string } {
  if (!dueDate) return { label: "No due date", className: "text-muted-foreground" };
  const due = parseISO(dueDate);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `Overdue by ${Math.abs(diff)}d`, className: "text-destructive font-medium" };
  if (diff === 0) return { label: "Due today", className: "text-amber-600 dark:text-amber-400 font-medium" };
  if (diff <= 3) return { label: `Due in ${diff}d`, className: "text-amber-600 dark:text-amber-400" };
  return { label: `Due in ${diff}d`, className: "text-muted-foreground" };
}

function getTaskStatusLabel(status: DealTask["status"]): { label: string; className: string } {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      };
    case "in_progress":
      return { label: "In Progress", className: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" };
    case "pending":
      return { label: "Pending", className: "bg-muted text-muted-foreground" };
  }
}

function probabilityColor(p: number): string {
  if (p >= 60) return "bg-emerald-500";
  if (p >= 30) return "bg-amber-500";
  return "bg-muted-foreground/30";
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-foreground text-sm">{children}</span>
    </div>
  );
}

function ActivityTimelineItem({ activity }: { activity: DealActivity }) {
  const { icon: Icon, className } = activityIconMap[activity.type] ?? activityIconMap.note;
  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      <div className="absolute top-8 bottom-0 left-[11px] w-px bg-border" />
      <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background">
        <Icon className={cn("size-3", className)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground text-sm">{activity.title}</span>
        </div>
        {activity.description && <p className="mt-0.5 text-muted-foreground text-xs">{activity.description}</p>}
        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
          <span>{formatDate(activity.date)}</span>
          {activity.createdBy && (
            <>
              <span className="text-border">·</span>
              <span>{getOwnerName(activity.createdBy)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: DealTask }) {
  const due = getTaskDueLabel(task.dueDate);
  const status = getTaskStatusLabel(task.status);
  const isCompleted = task.status === "completed";
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border/60 p-3",
        isCompleted && "bg-muted/30 opacity-70",
        !isCompleted && task.dueDate && parseISO(task.dueDate).getTime() < today.getTime() && "border-destructive/30",
      )}
    >
      <div className="mt-0.5">
        {isCompleted ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : (
          <Clock className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("font-medium text-sm", isCompleted && "text-muted-foreground line-through")}>
          {task.title}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <Badge className={cn("font-medium", status.className)}>{status.label}</Badge>
          <Badge className="bg-muted font-medium text-muted-foreground">{task.priority}</Badge>
          <span className={cn("tabular-nums", due.className)}>{due.label}</span>
          {task.assigneeId && <span className="text-muted-foreground">· {getOwnerName(task.assigneeId)}</span>}
        </div>
      </div>
    </div>
  );
}

function NoteItem({ note }: { note: DealNote }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 p-3",
        note.pinned && "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-500/5",
      )}
    >
      <div className="flex items-center gap-2">
        {note.pinned && <Pin className="size-3 text-amber-500" />}
        <span className="text-muted-foreground text-xs">{formatDateTime(note.createdAt)}</span>
        {note.authorId && (
          <>
            <span className="text-border">·</span>
            <span className="text-muted-foreground text-xs">{getOwnerName(note.authorId)}</span>
          </>
        )}
      </div>
      <p className="mt-1.5 text-foreground text-sm leading-relaxed">{note.content}</p>
    </div>
  );
}

export function DealDetail({ dealId }: { dealId: string }) {
  const storeDeal = useDealStore((s) => s.deals.find((d) => d.id === dealId));
  const deal = storeDeal ?? deals.find((d) => d.id === dealId);
  if (!deal) notFound();

  const router = useRouter();
  const archiveDeal = useDealStore((s) => s.archiveDeal);
  const restoreDeal = useDealStore((s) => s.restoreDeal);
  const sharedActivities = useActivityStore((s) => s.activities);

  const [editOpen, setEditOpen] = useState(false);
  const [changeStageOpen, setChangeStageOpen] = useState(false);
  const [markWonOpen, setMarkWonOpen] = useState(false);
  const [markLostOpen, setMarkLostOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const isArchived = Boolean(deal.archivedAt);

  const company = useCompanyStore((s) => s.getCompanyById(deal.companyId));
  const contact = useContactStore((s) => (deal.primaryContactId ? s.getContactById(deal.primaryContactId) : null));
  const ownerName = deal.ownerId ? getOwnerName(deal.ownerId) : "Unassigned";
  const weightedValue = Math.round((deal.value * deal.probability) / 100);

  const [activeTab, setActiveTab] = useState<"timeline" | "tasks" | "notes">("timeline");

  let closeDateLabel = "—";
  let closeDateClass = "text-muted-foreground";
  if (deal.expectedCloseDate) {
    const diff = Math.ceil((parseISO(deal.expectedCloseDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) {
      closeDateLabel = `Overdue by ${Math.abs(diff)} days`;
      closeDateClass = "text-destructive font-medium";
    } else if (diff === 0) {
      closeDateLabel = "Due today";
      closeDateClass = "text-amber-600 dark:text-amber-400 font-medium";
    } else {
      closeDateLabel = `${diff} days remaining`;
      closeDateClass = diff <= 7 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground";
    }
  }

  const sharedTypeMap = { Call: "call", Meeting: "meeting", Email: "email", Task: "task", Note: "note" } as const;
  const mappedSharedActivities: DealActivity[] = filterActivitiesForRecord(sharedActivities, {
    dealId: deal.id,
  }).map((activity) => ({
    id: activity.id,
    type: sharedTypeMap[activity.type],
    title: activity.title,
    description: activity.description,
    date: getActivityTimestamp(activity),
    createdBy: activity.ownerId,
  }));
  const sortedActivities = [...deal.activities, ...mappedSharedActivities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const pendingTasks = deal.tasks.filter((t) => t.status !== "completed");
  const completedTasks = deal.tasks.filter((t) => t.status === "completed");

  const stageOrder: DealStage[] = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"];
  let closedStage: DealStage | null = null;
  if (deal.stage === "Closed Won") closedStage = "Closed Won";
  else if (deal.stage === "Closed Lost") closedStage = "Closed Lost";
  const currentStageIdx = stageOrder.indexOf(deal.stage);
  const isClosedStage = deal.stage === "Closed Won" || deal.stage === "Closed Lost";

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        <Link
          href="/dashboard/crm/deals"
          className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Deals
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className={cn("size-14 font-medium", avatarTone(deal.name))}>
              <AvatarFallback className="text-lg">{getInitials(deal.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="font-heading font-semibold text-xl tracking-tight">{deal.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span className="font-mono text-xs">{deal.id}</span>
                <span className="text-border">·</span>
                <Badge className={cn("font-medium", stageBadgeVariant[deal.stage])}>{deal.stage}</Badge>
                <Badge className={cn("font-medium", healthBadgeVariant[deal.health])}>{deal.health}</Badge>
              </div>
              <div className="text-muted-foreground text-sm">
                {formatCurrency(deal.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                {ownerName !== "Unassigned" && (
                  <>
                    <span className="mx-1.5 text-border">·</span>
                    {ownerName}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isArchived ? (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setRestoreDialogOpen(true)}>
                <RotateCcw className="size-3.5" />
                Restore
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
                  <PenLine className="size-3.5" />
                  Edit
                </Button>
                {isClosedStage ? (
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setReopenOpen(true)}>
                    <RotateCcw className="size-3.5" />
                    Reopen Deal
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setChangeStageOpen(true)}>
                      Change Stage
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={() => setMarkWonOpen(true)}>
                      <Trophy className="size-3.5" />
                      Mark Won
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setMarkLostOpen(true)}>
                      <XCircle className="size-3.5" />
                      Mark Lost
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setArchiveDialogOpen(true)}>
                  <Archive className="size-3.5" />
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
              This deal is archived. It was archived on{" "}
              {deal.archivedAt ? format(parseISO(deal.archivedAt), "MMM d, yyyy") : "an unknown date"}.
            </span>
          </div>
        ) : null}

        {/* Stage progression */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1">
              {stageOrder.map((stage, i) => {
                const reached = !isClosedStage && currentStageIdx >= i;
                const isCurrent = !isClosedStage && currentStageIdx === i;
                return (
                  <div key={stage} className="flex flex-1 items-center gap-1">
                    <div className="flex flex-1 flex-col items-center gap-1.5">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border-2 font-semibold text-xs transition-colors",
                          reached
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground",
                          isCurrent && "ring-2 ring-primary/20",
                        )}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-center text-[10px] leading-tight sm:text-xs",
                          reached ? "font-medium text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {stage}
                      </span>
                    </div>
                    {i < stageOrder.length - 1 && (
                      <div
                        className={cn("h-0.5 flex-1 rounded-full", i < currentStageIdx ? "bg-primary" : "bg-border")}
                      />
                    )}
                  </div>
                );
              })}
              {closedStage && (
                <div className="flex items-center gap-1">
                  <div className="h-0.5 w-4 rounded-full bg-primary" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border-2 font-semibold text-xs",
                        closedStage === "Closed Won"
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-rose-500 bg-rose-500 text-white",
                      )}
                    >
                      {closedStage === "Closed Won" ? (
                        <Trophy className="size-3.5" />
                      ) : (
                        <XCircle className="size-3.5" />
                      )}
                    </div>
                    <span className="font-medium text-[10px] leading-tight sm:text-xs">{closedStage}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Value</div>
                  <div className="mt-1 font-semibold text-lg tabular-nums">
                    {formatCurrency(deal.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Probability</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", probabilityColor(deal.probability))}
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                    <span className="font-semibold text-sm tabular-nums">{deal.probability}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Weighted Value</div>
                  <div className="mt-1 font-semibold text-lg tabular-nums">
                    {formatCurrency(weightedValue, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Expected Close</div>
                  <div className="mt-1 text-sm">{formatDate(deal.expectedCloseDate)}</div>
                  {deal.expectedCloseDate && (
                    <div className={cn("mt-0.5 text-xs", closeDateClass)}>{closeDateLabel}</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Last Activity</div>
                  <div className="mt-1 text-sm">{formatDate(deal.lastActivityDate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Next Activity</div>
                  <div className="mt-1 text-sm">{formatDate(deal.nextActivityDate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Source</div>
                  <div className="mt-1 text-sm">{deal.source}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-muted-foreground text-xs">Status</div>
                  <div className="mt-1 text-sm">
                    {(() => {
                      if (deal.stage === "Closed Won") return "Won";
                      if (deal.stage === "Closed Lost") return "Lost";
                      return "Open";
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
              {(["timeline", "tasks", "notes"] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 font-medium text-sm capitalize transition-colors",
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab}
                  {tab === "timeline" && sortedActivities.length > 0 && (
                    <span className="ml-1.5 text-muted-foreground text-xs">({sortedActivities.length})</span>
                  )}
                  {tab === "tasks" && pendingTasks.length > 0 && (
                    <span className="ml-1.5 text-muted-foreground text-xs">({pendingTasks.length})</span>
                  )}
                  {tab === "notes" && deal.notes.length > 0 && (
                    <span className="ml-1.5 text-muted-foreground text-xs">({deal.notes.length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "timeline" && (
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardAction className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={isArchived}
                      onClick={() => setAddTaskOpen(true)}
                    >
                      <ListTodo className="size-3.5" />
                      Add Task
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={isArchived}
                      onClick={() => setAddActivityOpen(true)}
                    >
                      <CalendarPlus className="size-3.5" />
                      Add Activity
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  {sortedActivities.length > 0 ? (
                    <div className="space-y-0">
                      {sortedActivities.map((activity) => (
                        <ActivityTimelineItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileText />
                        </EmptyMedia>
                        <EmptyTitle>No activities</EmptyTitle>
                        <EmptyDescription>No activity has been recorded for this deal yet.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "tasks" && (
              <Card>
                <CardHeader>
                  <CardTitle>Tasks &amp; Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingTasks.length > 0 && (
                    <div className="space-y-2">
                      {pendingTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  )}
                  {completedTasks.length > 0 && (
                    <>
                      {pendingTasks.length > 0 && <Separator />}
                      <div className="space-y-2">
                        <span className="font-medium text-muted-foreground text-xs uppercase">Completed</span>
                        {completedTasks.map((task) => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                      </div>
                    </>
                  )}
                  {deal.tasks.length === 0 && (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CheckCircle2 />
                        </EmptyMedia>
                        <EmptyTitle>No tasks</EmptyTitle>
                        <EmptyDescription>No tasks have been created for this deal.</EmptyDescription>
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
                <CardContent className="space-y-3">
                  {deal.notes.length > 0 ? (
                    deal.notes.map((note) => <NoteItem key={note.id} note={note} />)
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileText />
                        </EmptyMedia>
                        <EmptyTitle>No notes</EmptyTitle>
                        <EmptyDescription>No notes have been added to this deal.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Products */}
            {deal.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products &amp; Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-border border-b text-left text-muted-foreground text-xs">
                          <th className="pb-2 font-medium">Product</th>
                          <th className="pb-2 text-right font-medium">Qty</th>
                          <th className="pb-2 text-right font-medium">Unit Price</th>
                          <th className="pb-2 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deal.products.map((product, i) => (
                          <tr key={i} className="border-border/50 border-b last:border-b-0">
                            <td className="py-2.5 font-medium text-foreground">{product.name}</td>
                            <td className="py-2.5 text-right tabular-nums">{product.quantity}</td>
                            <td className="py-2.5 text-right tabular-nums">
                              {formatCurrency(product.unitPrice, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="py-2.5 text-right font-medium tabular-nums">
                              {formatCurrency(product.unitPrice * product.quantity, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-border border-t font-medium">
                          <td className="pt-2.5" colSpan={3}>
                            Total
                          </td>
                          <td className="pt-2.5 text-right tabular-nums">
                            {formatCurrency(
                              deal.products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0),
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              },
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Deal information */}
            <CustomFieldsCard entityType="deal" pluralLabel="Deals" values={deal.customFields} />

            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem label="Stage">
                  <Badge className={cn("font-medium", stageBadgeVariant[deal.stage])}>{deal.stage}</Badge>
                </InfoItem>
                <InfoItem label="State">
                  {deal.stage === "Closed Won" ? "Won" : deal.stage === "Closed Lost" ? "Lost" : "Open"}
                </InfoItem>
                <InfoItem label="Value">
                  {formatCurrency(deal.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </InfoItem>
                <InfoItem label="Probability">{deal.probability}%</InfoItem>
                <InfoItem label="Weighted Value">
                  {formatCurrency(weightedValue, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </InfoItem>
                <InfoItem label="Health">
                  <Badge className={cn("font-medium", healthBadgeVariant[deal.health])}>{deal.health}</Badge>
                </InfoItem>
                <InfoItem label="Priority">{deal.priority}</InfoItem>
                <InfoItem label="Source">{deal.source}</InfoItem>
                {deal.tags && deal.tags.length > 0 && (
                  <InfoItem label="Tags">
                    <div className="flex flex-wrap gap-1">
                      {deal.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="font-normal text-xs">
                          <Tag className="mr-1 size-2.5" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </InfoItem>
                )}
                <InfoItem label="Owner">
                  {deal.ownerId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className={cn("size-5 font-medium", avatarTone(ownerName))}>
                        <AvatarFallback className="text-[10px]">{getInitials(ownerName)}</AvatarFallback>
                      </Avatar>
                      {ownerName}
                    </div>
                  ) : (
                    "Unassigned"
                  )}
                </InfoItem>
                <Separator />
                <InfoItem label="Created">{formatDate(deal.createdAt)}</InfoItem>
                {deal.updatedAt && <InfoItem label="Updated">{formatDate(deal.updatedAt)}</InfoItem>}
                <InfoItem label="Expected Close">{formatDate(deal.expectedCloseDate)}</InfoItem>
                {deal.actualCloseDate && <InfoItem label="Actual Close">{formatDate(deal.actualCloseDate)}</InfoItem>}
                {deal.lostReason && (
                  <>
                    <Separator />
                    <InfoItem label="Lost Reason">
                      <span className="text-rose-600 dark:text-rose-400">{deal.lostReason}</span>
                    </InfoItem>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Related Company */}
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
              </CardHeader>
              <CardContent>
                {company ? (
                  <Link
                    href={`/dashboard/crm/companies/${company.id}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <Avatar className={cn("size-10 font-medium", avatarTone(company.name))}>
                      <AvatarFallback className="text-xs">
                        <Tag className="size-3.5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-sm">{company.name}</div>
                      <div className="text-muted-foreground text-xs">{company.id}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="text-muted-foreground text-sm">No company linked</div>
                )}
              </CardContent>
            </Card>

            {/* Primary Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Contact</CardTitle>
              </CardHeader>
              <CardContent>
                {contact ? (
                  <Link
                    href={`/dashboard/crm/contacts/${contact.id}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <Avatar className={cn("size-10 font-medium", avatarTone(contact.name))}>
                      <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-sm">{contact.name}</div>
                      {contact.email && <div className="truncate text-muted-foreground text-xs">{contact.email}</div>}
                    </div>
                  </Link>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <UserCheck />
                      </EmptyMedia>
                      <EmptyTitle>No primary contact</EmptyTitle>
                      <EmptyDescription>This deal does not have a primary contact assigned.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <DealForm open={editOpen} onOpenChange={setEditOpen} deal={deal} />
      <ActivityForm
        open={addActivityOpen}
        onOpenChange={(open) => {
          if (!open) setAddActivityOpen(false);
        }}
        defaultRelated={{ dealId: deal.id }}
      />
      <ActivityForm
        open={addTaskOpen}
        onOpenChange={(open) => {
          if (!open) setAddTaskOpen(false);
        }}
        defaultRelated={{ dealId: deal.id }}
        defaultType="Task"
        lockType
      />
      <ChangeStageDialog deal={deal} open={changeStageOpen} onOpenChange={setChangeStageOpen} />
      <MarkWonDialog deal={deal} open={markWonOpen} onOpenChange={setMarkWonOpen} />
      <MarkLostDialog deal={deal} open={markLostOpen} onOpenChange={setMarkLostOpen} />
      <ReopenDealDialog deal={deal} open={reopenOpen} onOpenChange={setReopenOpen} />
      <DealArchiveRestoreDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        mode="archive"
        count={1}
        dealName={deal.name}
        onConfirm={() => {
          archiveDeal(deal.id, currentSalesOwnerId);
          toast("Deal archived", { description: `${deal.name} has been archived.` });
          router.push("/dashboard/crm/deals");
        }}
      />
      <DealArchiveRestoreDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        mode="restore"
        count={1}
        dealName={deal.name}
        onConfirm={() => {
          restoreDeal(deal.id);
          toast("Deal restored", { description: `${deal.name} has been restored.` });
        }}
      />
    </>
  );
}
