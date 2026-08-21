"use client";

import { useState } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDotDashed,
  Handshake,
  ListTodo,
  RotateCcw,
  User,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  activityPriorityMeta,
  activityStatusMeta,
  getOwnerLabel,
  getRelatedRecords,
  getScheduleState,
  getTaskDueAt,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import { ActivityForm } from "../../../_components/activities/activity-form";
import {
  CancelActivityDialog,
  CompleteActivityDialog,
  ReopenTaskDialog,
  RescheduleActivityDialog,
} from "../../../_components/activities/activity-workflows";
import { useActivityStore } from "../../../_components/activities/use-activity-store";

const today = new Date(2026, 7, 16);

const relatedRecordIcons = {
  Lead: UserRound,
  Contact: User,
  Company: Building2,
  Deal: Handshake,
} as const;

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-foreground text-sm">{children}</span>
    </div>
  );
}

export function TaskDetail({ taskId }: { taskId: string }) {
  const task = useActivityStore((s) => s.activities.find((a) => a.id === taskId && a.type === "Task"));
  const startActivity = useActivityStore((s) => s.startActivity);

  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);

  if (!task) notFound();

  const statusMeta = activityStatusMeta[task.status];
  const priorityMeta = activityPriorityMeta[task.priority];
  const scheduleState = getScheduleState(task, today);
  const ownerName = getOwnerLabel(task);
  const relatedRecords = getRelatedRecords(task);
  const dueAt = getTaskDueAt(task);

  const isToDo = task.status === "To Do";
  const isInProgress = task.status === "In Progress";
  const isOpen = isToDo || isInProgress;
  const isCompleted = task.status === "Completed";
  const isCanceled = task.status === "Canceled";

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        <Link
          href="/dashboard/tasks"
          className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Tasks
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300">
              <ListTodo className="size-6" />
            </div>
            <div className="min-w-0 space-y-1">
              <h1
                className={cn(
                  "font-heading font-semibold text-xl tracking-tight",
                  isCompleted && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                <span className="font-mono text-xs">{task.id}</span>
                <span className="text-border">·</span>
                <Badge className={cn("gap-1.5 font-medium", statusMeta.badgeClass)} variant="outline">
                  <span className={cn("size-1.5 rounded-full", statusMeta.dotClass)} />
                  {task.status}
                </Badge>
                <Badge className={cn("font-medium", priorityMeta.badgeClass)} variant="outline">
                  {task.priority}
                </Badge>
              </div>
              <div className="text-muted-foreground text-sm tabular-nums">
                Due {format(parseISO(dueAt), "EEE, MMM d, yyyy 'at' h:mm a")}
                {scheduleState === "Overdue" ? (
                  <span className="ml-2 font-medium text-destructive">Overdue</span>
                ) : null}
                {scheduleState === "Due Today" ? (
                  <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">Due today</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            {isToDo ? (
              <Button size="sm" className="gap-1.5" onClick={() => startActivity(task.id)}>
                <CircleDotDashed className="size-3.5" />
                Start Task
              </Button>
            ) : null}
            {isOpen ? (
              <>
                <Button size="sm" className="gap-1.5" onClick={() => setCompleteOpen(true)}>
                  <CheckCircle2 className="size-3.5" />
                  Mark Complete
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setRescheduleOpen(true)}>
                  <CalendarClock className="size-3.5" />
                  Reschedule
                </Button>
                <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setCancelOpen(true)}>
                  <XCircle className="size-3.5" />
                  Cancel Task
                </Button>
              </>
            ) : null}
            {isCompleted || isCanceled ? (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setReopenOpen(true)}>
                <RotateCcw className="size-3.5" />
                Reopen Task
              </Button>
            ) : null}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {task.description ? (
                  <p className="text-foreground text-sm leading-relaxed">{task.description}</p>
                ) : (
                  <p className="text-muted-foreground text-sm">No description provided.</p>
                )}
              </CardContent>
            </Card>

            {isCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle>Completion Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem label="Completed On">
                    {task.completedAt ? format(parseISO(task.completedAt), "MMM d, yyyy 'at' h:mm a") : "—"}
                  </InfoItem>
                  <Separator />
                  <InfoItem label="Outcome">
                    {task.outcome ?? <span className="text-muted-foreground">No outcome recorded.</span>}
                  </InfoItem>
                  {task.completionNotes ? (
                    <InfoItem label="Completion Notes">
                      <p className="text-foreground text-sm leading-relaxed">{task.completionNotes}</p>
                    </InfoItem>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {isCanceled ? (
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem label="Canceled On">
                    {task.updatedAt ? format(parseISO(task.updatedAt), "MMM d, yyyy 'at' h:mm a") : "—"}
                  </InfoItem>
                  <InfoItem label="Reason">
                    {task.cancelReason ?? <span className="text-muted-foreground">No reason recorded.</span>}
                  </InfoItem>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem label="Owner">
                  {task.ownerId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5 font-medium">
                        <AvatarFallback className="text-[10px]">{getInitials(ownerName)}</AvatarFallback>
                      </Avatar>
                      {ownerName}
                    </div>
                  ) : (
                    "Unassigned"
                  )}
                </InfoItem>
                <InfoItem label="Due Date">{format(parseISO(dueAt), "EEE, MMM d, yyyy 'at' h:mm a")}</InfoItem>
                {task.reminderAt ? (
                  <InfoItem label="Reminder">
                    {format(parseISO(task.reminderAt), "EEE, MMM d, yyyy 'at' h:mm a")}
                  </InfoItem>
                ) : (
                  <InfoItem label="Reminder">None</InfoItem>
                )}
                <Separator />
                <InfoItem label="Created">{format(parseISO(task.createdAt), "MMM d, yyyy 'at' h:mm a")}</InfoItem>
                {task.updatedAt ? (
                  <InfoItem label="Updated">{format(parseISO(task.updatedAt), "MMM d, yyyy 'at' h:mm a")}</InfoItem>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Records</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedRecords.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {relatedRecords.map((record) => {
                      const Icon = relatedRecordIcons[record.type];
                      return record.found ? (
                        <Link
                          key={`${record.type}-${record.id}`}
                          href={record.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-muted/50",
                            record.archived && "opacity-70",
                          )}
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-sm">{record.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {record.type}
                              {record.archived ? " · Archived" : ""}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div
                          key={`${record.type}-${record.id}`}
                          className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5 opacity-70"
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-sm">Unknown {record.type.toLowerCase()}</div>
                            <div className="truncate text-muted-foreground text-xs">{record.id}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ListTodo />
                      </EmptyMedia>
                      <EmptyTitle>No linked records</EmptyTitle>
                      <EmptyDescription>This task is not linked to any CRM record.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ActivityForm
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) setEditOpen(false);
        }}
        activity={task}
      />
      <CompleteActivityDialog
        activity={task}
        open={completeOpen}
        onOpenChange={(open) => {
          if (!open) setCompleteOpen(false);
        }}
      />
      <CancelActivityDialog
        activity={task}
        open={cancelOpen}
        onOpenChange={(open) => {
          if (!open) setCancelOpen(false);
        }}
      />
      <RescheduleActivityDialog
        activity={task}
        open={rescheduleOpen}
        onOpenChange={(open) => {
          if (!open) setRescheduleOpen(false);
        }}
      />
      <ReopenTaskDialog
        activity={task}
        open={reopenOpen}
        onOpenChange={(open) => {
          if (!open) setReopenOpen(false);
        }}
      />
    </>
  );
}
