"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  CircleDotDashed,
  MoreHorizontal,
  RotateCcw,
  SquareCheckBig,
  XCircle,
} from "lucide-react";

import type { Activity } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import {
  activityPriorityMeta,
  activityStatusMeta,
  getRelatedRecords,
  getScheduleState,
  getTaskDueAt,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { EditableCustomCell } from "@/components/crm/table-engine/editable-custom-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableField } from "@/lib/crm-table-engine/types";
import { cn, getInitials } from "@/lib/utils";

const today = new Date(2026, 7, 16);

export type TaskColumnsOptions = {
  onView?: (task: Activity) => void;
  onEditTask?: (task: Activity) => void;
  onStartTask?: (task: Activity) => void;
  onCompleteTask?: (task: Activity) => void;
  onReopenTask?: (task: Activity) => void;
  onRescheduleTask?: (task: Activity) => void;
  onCancelTask?: (task: Activity) => void;
};

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

function StatusIcon({ status }: { status: Activity["status"] }) {
  if (status === "Completed") {
    return <SquareCheckBig className="size-3.5 text-emerald-600 dark:text-emerald-400" />;
  }
  if (status === "In Progress") {
    return <CircleDotDashed className="size-3.5 text-amber-600 dark:text-amber-400" />;
  }
  return <Circle className="size-3.5 text-muted-foreground" />;
}

function StatusBadge({ status }: { status: Activity["status"] }) {
  const meta = activityStatusMeta[status];
  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Activity["priority"] }) {
  const meta = activityPriorityMeta[priority];
  return (
    <Badge className={cn("border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      {priority}
    </Badge>
  );
}

function RelatedToCell({ task }: { task: Activity }) {
  const records = getRelatedRecords(task);
  if (records.length === 0) {
    return <span className="text-muted-foreground text-sm">Not linked</span>;
  }
  return (
    <div className="flex max-w-[220px] flex-wrap items-center gap-x-1 gap-y-0.5 text-sm">
      {records.map((record, index) => (
        <span key={`${record.type}-${record.id}`} className="flex items-center gap-1">
          {index > 0 ? <span className="text-border">·</span> : null}
          {record.found ? (
            <Link
              href={record.href}
              className={cn(
                "truncate text-foreground underline-offset-2 hover:underline",
                record.archived && "text-muted-foreground line-through",
              )}
              title={`${record.type}: ${record.name}${record.archived ? " (Archived)" : ""}`}
            >
              {record.name}
            </Link>
          ) : (
            <span className="truncate text-muted-foreground" title={`${record.type}: ${record.id}`}>
              Unknown {record.type.toLowerCase()}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function DueDateCell({ task }: { task: Activity }) {
  const dueAt = getTaskDueAt(task);
  const scheduleState = getScheduleState(task, today);
  return (
    <div className="min-w-0 text-sm">
      <div
        className={cn("font-medium text-foreground tabular-nums", scheduleState === "Overdue" && "text-destructive")}
      >
        {format(parseISO(dueAt), "MMM d, yyyy")}
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs tabular-nums">
        {format(parseISO(dueAt), "h:mm a")}
        {scheduleState === "Overdue" ? (
          <Badge
            className="border-destructive/20 bg-destructive/10 px-1.5 py-0 text-[10px] text-destructive"
            variant="outline"
          >
            Overdue
          </Badge>
        ) : null}
        {scheduleState === "Due Today" ? (
          <Badge
            className="border-amber-200 bg-amber-500/10 px-1.5 py-0 text-[10px] text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300"
            variant="outline"
          >
            Today
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function ReminderCell({ task }: { task: Activity }) {
  if (!task.reminderAt) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }
  return (
    <div className="flex items-center gap-1.5 text-sm tabular-nums">
      <CalendarClock className="size-3.5 text-muted-foreground" />
      <span>{format(parseISO(task.reminderAt), "MMM d, h:mm a")}</span>
    </div>
  );
}

function OwnerCell({ ownerId }: { ownerId: string | null }) {
  if (!ownerId) {
    return <span className="text-muted-foreground text-sm">Unassigned</span>;
  }
  const name = getOwnerName(ownerId);
  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("size-6 font-medium", avatarTone(name))}>
        <AvatarFallback className="text-[10px]">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm">{name}</span>
    </div>
  );
}

export function renderTaskFieldCell(params: {
  field: TableField;
  task: Activity;
  onCommitCustomValue: (
    task: Activity,
    field: TableField,
    value: NonNullable<Activity["customFields"]>[string],
  ) => void;
}) {
  const { field, task, onCommitCustomValue } = params;

  switch (field.key) {
    case "task.title":
      return (
        <Link
          href={`/dashboard/crm/tasks/${task.id}`}
          className="flex min-w-0 max-w-[280px] items-start gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="mt-0.5 shrink-0">
            <StatusIcon status={task.status} />
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "line-clamp-2 font-medium text-foreground text-sm",
                task.status === "Completed" && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </span>
            {task.description ? (
              <span className="line-clamp-1 block text-muted-foreground text-xs">{task.description}</span>
            ) : null}
          </span>
        </Link>
      );
    case "task.status":
      return <StatusBadge status={task.status} />;
    case "task.priority":
      return <PriorityBadge priority={task.priority} />;
    case "task.relatedTo":
      return <RelatedToCell task={task} />;
    case "task.owner":
      return <OwnerCell ownerId={task.ownerId ?? null} />;
    case "task.dueAt":
      return <DueDateCell task={task} />;
    case "task.reminderAt":
      return <ReminderCell task={task} />;
    case "task.outcome":
      return (
        <span className="line-clamp-2 block max-w-[200px] text-muted-foreground text-sm">{task.outcome ?? "—"}</span>
      );
    case "task.updatedAt":
      return (
        <span className="text-muted-foreground text-sm tabular-nums">
          {format(parseISO(task.updatedAt ?? task.createdAt), "MMM d, yyyy")}
        </span>
      );
    default:
      break;
  }

  if (!field.isCore) {
    const isClosed = task.status === "Canceled";
    return (
      <EditableCustomCell
        field={field}
        value={task.customFields?.[field.systemName]}
        disabled={isClosed}
        disabledReason={isClosed ? "Canceled tasks cannot be edited." : undefined}
        onCommit={(value) => onCommitCustomValue(task, field, value)}
      />
    );
  }

  return null;
}

export function getTasksSelectColumn(): ColumnDef<Activity> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all tasks on this page"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.title}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function getTasksActionsColumn(options?: TaskColumnsOptions): ColumnDef<Activity> {
  return {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const task = row.original;
      const isOpen = task.status === "To Do" || task.status === "In Progress";
      const isCompleted = task.status === "Completed";
      const isCanceled = task.status === "Canceled";
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Open actions for ${task.title}`}
                className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => options?.onView?.(task)}>View task</DropdownMenuItem>
              <DropdownMenuItem onClick={() => options?.onEditTask?.(task)}>Edit task</DropdownMenuItem>
              {isOpen ? (
                <>
                  <DropdownMenuSeparator />
                  {task.status === "To Do" ? (
                    <DropdownMenuItem onClick={() => options?.onStartTask?.(task)}>
                      <CircleDotDashed className="size-3.5" />
                      Start Task
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem onClick={() => options?.onCompleteTask?.(task)}>
                    <CheckCircle2 className="size-3.5" />
                    Mark Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => options?.onRescheduleTask?.(task)}>
                    <CalendarClock className="size-3.5" />
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => options?.onCancelTask?.(task)}>
                    <XCircle className="size-3.5" />
                    Cancel Task
                  </DropdownMenuItem>
                </>
              ) : null}
              {isCompleted || isCanceled ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options?.onReopenTask?.(task)}>
                    <RotateCcw className="size-3.5" />
                    Reopen Task
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  };
}
