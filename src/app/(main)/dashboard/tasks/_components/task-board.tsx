"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format, parseISO } from "date-fns";
import { Building2, CalendarClock, GripVertical, Handshake, User, UserRound } from "lucide-react";

import type { Activity, ActivityStatus } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import {
  activityPriorityMeta,
  boardStatusOptions,
  getOwnerLabel,
  getRelatedRecords,
  getScheduleState,
  getTaskDueAt,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";

const today = new Date(2026, 7, 16);

type BoardStatus = (typeof boardStatusOptions)[number];

const boardColumnMeta: Record<BoardStatus, { title: string; dotClass: string }> = {
  "To Do": { title: "To Do", dotClass: "bg-sky-500" },
  "In Progress": { title: "In Progress", dotClass: "bg-amber-500" },
  Completed: { title: "Completed", dotClass: "bg-emerald-500" },
};

function isBoardStatus(status: string): status is BoardStatus {
  return status === "To Do" || status === "In Progress" || status === "Completed";
}

interface TaskBoardProps {
  tasks: Activity[];
  onCompleteTask?: (task: Activity) => void;
}

export function TaskBoard({ tasks, onCompleteTask }: TaskBoardProps) {
  const router = useRouter();
  const [activeTask, setActiveTask] = React.useState<Activity | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const grouped = React.useMemo(() => {
    const groupedTasks = new Map<ActivityStatus, Activity[]>();
    for (const status of boardStatusOptions) {
      groupedTasks.set(status, []);
    }
    for (const task of tasks) {
      if (!isBoardStatus(task.status)) continue;
      groupedTasks.get(task.status)?.push(task);
    }
    return groupedTasks;
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as Activity | undefined;
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task as Activity | undefined;
    if (!task) return;

    let targetStatus: ActivityStatus | null = null;
    if (typeof over.id === "string" && isBoardStatus(over.id)) {
      targetStatus = over.id;
    } else if (over.data.current?.task) {
      targetStatus = (over.data.current.task as Activity).status;
    }

    if (!targetStatus || task.status === targetStatus || !isBoardStatus(targetStatus)) return;

    if (targetStatus === "Completed") {
      onCompleteTask?.(task);
      return;
    }
    router.push(`/dashboard/crm/tasks/${task.id}`);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="scrollbar-thin flex gap-4 overflow-x-auto px-1 pb-4 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-2">
        {boardStatusOptions.map((status) => (
          <BoardColumn key={status} status={status} tasks={grouped.get(status) ?? []} />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>{activeTask ? <TaskCardOverlay task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
}

function BoardColumn({ status, tasks }: { status: BoardStatus; tasks: Activity[] }) {
  const meta = boardColumnMeta[status];
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", meta.dotClass)} />
          <span className="font-medium text-sm">{meta.title}</span>
          <span className="text-muted-foreground text-xs tabular-nums">{tasks.length}</span>
        </div>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[80px] flex-col gap-2.5">
          {tasks.length ? (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-xs">
              No tasks
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

const relatedRecordIcons = {
  Lead: UserRound,
  Contact: User,
  Company: Building2,
  Deal: Handshake,
} as const;

function TaskCardBody({ task }: { task: Activity }) {
  const dueAt = getTaskDueAt(task);
  const scheduleState = getScheduleState(task, today);
  const ownerName = getOwnerLabel(task);
  const records = getRelatedRecords(task);
  const priorityMeta = activityPriorityMeta[task.priority];

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "line-clamp-2 font-medium text-sm leading-snug",
            task.status === "Completed" && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        <GripVertical className="size-3.5 shrink-0 text-muted-foreground/40" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className={cn("border px-1.5 py-0 font-medium text-[10px]", priorityMeta.badgeClass)} variant="outline">
          {task.priority}
        </Badge>
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
            Due Today
          </Badge>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {task.ownerId ? (
            <>
              <Avatar className="size-4 font-medium">
                <AvatarFallback className="text-[8px]">{getInitials(ownerName)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-muted-foreground text-xs">{ownerName}</span>
            </>
          ) : (
            <span className="text-muted-foreground text-xs">Unassigned</span>
          )}
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center gap-0.5 text-muted-foreground text-xs tabular-nums",
            scheduleState === "Overdue" && "font-medium text-destructive",
          )}
        >
          {format(parseISO(dueAt), "MMM d")}
          <CalendarClock className="size-3" />
        </span>
      </div>

      {records.length > 0 ? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 border-t pt-2 text-muted-foreground text-xs">
          {records.slice(0, 2).map((record, index) => {
            const Icon = relatedRecordIcons[record.type];
            return (
              <span key={`${record.type}-${record.id}`} className="flex items-center gap-1">
                {index > 0 ? <span className="text-border">·</span> : null}
                <Icon className="size-3" />
                <span className={cn("max-w-[90px] truncate", !record.found && "italic")}>{record.name}</span>
              </span>
            );
          })}
          {records.length > 2 ? <span>+{records.length - 2}</span> : null}
        </div>
      ) : null}

      {task.reminderAt ? (
        <div className="flex items-center gap-1 text-muted-foreground text-xs tabular-nums">
          <CalendarClock className="size-3" />
          Reminder {format(parseISO(task.reminderAt), "MMM d, h:mm a")}
        </div>
      ) : null}
    </>
  );
}

function SortableTaskCard({ task }: { task: Activity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    data: { type: "task", task },
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-40")}
      {...attributes}
      {...listeners}
    >
      <Link
        href={`/dashboard/crm/tasks/${task.id}`}
        aria-label={`Open ${task.title}`}
        className="group flex cursor-grab flex-col gap-2 rounded-xl border bg-card p-3 text-card-foreground shadow-xs transition-shadow hover:shadow-md active:cursor-grabbing"
      >
        <TaskCardBody task={task} />
      </Link>
    </div>
  );
}

function TaskCardOverlay({ task }: { task: Activity }) {
  return (
    <article className="flex w-64 rotate-2 flex-col gap-2 rounded-xl border bg-card p-3 text-card-foreground shadow-xl">
      <TaskCardBody task={task} />
    </article>
  );
}
