"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { CalendarClock, CheckCircle2, MoreHorizontal, RotateCcw, XCircle } from "lucide-react";

import type { Activity, ActivityPriority } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import {
  activityPriorityMeta,
  activityStatusMeta,
  activityTypeMeta,
  getOwnerLabel,
  getRelatedRecords,
  getScheduleState,
} from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

const today = new Date(2026, 7, 16);

export type ActivitiesColumnsOptions = {
  onView?: (activity: Activity) => void;
  onEditActivity?: (activity: Activity) => void;
  onCompleteActivity?: (activity: Activity) => void;
  onCancelActivity?: (activity: Activity) => void;
  onRescheduleActivity?: (activity: Activity) => void;
};

const prioritySortOrder: Record<ActivityPriority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Urgent: 3,
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

function TypeBadge({ type }: { type: Activity["type"] }) {
  const meta = activityTypeMeta[type];
  const Icon = meta.icon;
  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <Icon className="size-3" />
      {type}
    </Badge>
  );
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

function PriorityBadge({ priority }: { priority: ActivityPriority }) {
  const meta = activityPriorityMeta[priority];
  return (
    <Badge className={cn("border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      {priority}
    </Badge>
  );
}

function RelatedToCell({ activity }: { activity: Activity }) {
  const records = getRelatedRecords(activity);
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

function ScheduledCell({ activity }: { activity: Activity }) {
  const scheduleState = getScheduleState(activity, today);
  return (
    <div className="min-w-0 text-sm">
      <div className="font-medium text-foreground tabular-nums">
        {format(parseISO(activity.scheduledAt), "MMM d, yyyy")}
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs tabular-nums">
        {format(parseISO(activity.scheduledAt), "h:mm a")}
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

export function getActivitiesColumns(options?: ActivitiesColumnsOptions): ColumnDef<Activity>[] {
  return [
    {
      accessorKey: "title",
      header: "Activity",
      cell: ({ row }) => {
        const meta = activityTypeMeta[row.original.type];
        const Icon = meta.icon;
        return (
          <Link
            href={`/dashboard/crm/activities/${row.original.id}`}
            className="flex min-w-0 max-w-[260px] items-start gap-2.5 transition-opacity hover:opacity-80"
          >
            <span
              className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", meta.badgeClass)}
            >
              <Icon className="size-3" />
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 font-medium text-foreground text-sm">{row.original.title}</span>
              {row.original.description ? (
                <span className="line-clamp-1 block text-muted-foreground text-xs">{row.original.description}</span>
              ) : null}
            </span>
          </Link>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      filterFn: "equalsString",
      cell: ({ row }) => <TypeBadge type={row.original.type} />,
    },
    {
      id: "relatedTo",
      header: "Related To",
      enableSorting: false,
      cell: ({ row }) => <RelatedToCell activity={row.original} />,
    },
    {
      id: "owner",
      accessorFn: (row) => getOwnerLabel(row),
      header: "Owner",
      cell: ({ row }) => {
        if (!row.original.ownerId) {
          return <span className="text-muted-foreground text-sm">Unassigned</span>;
        }
        const name = getOwnerLabel(row.original);
        return (
          <div className="flex items-center gap-2">
            <Avatar className={cn("size-6 font-medium", avatarTone(name))}>
              <AvatarFallback className="text-[10px]">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "scheduledAt",
      accessorFn: (row) => parseISO(row.scheduledAt).getTime(),
      id: "scheduled",
      header: "Scheduled",
      cell: ({ row }) => <ScheduledCell activity={row.original} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "priority",
      accessorFn: (row) => prioritySortOrder[row.priority],
      header: "Priority",
      filterFn: "equalsString",
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="line-clamp-2 block max-w-[200px] text-muted-foreground text-sm">
          {row.original.outcome ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const activity = row.original;
        const isScheduled = activity.status === "Scheduled";
        const isCanceled = activity.status === "Canceled";
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label={`Open actions for ${activity.title}`}
                  className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                  size="icon-sm"
                  variant="ghost"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => options?.onView?.(activity)}>View activity</DropdownMenuItem>
                <DropdownMenuItem onClick={() => options?.onEditActivity?.(activity)}>Edit activity</DropdownMenuItem>
                {isScheduled ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => options?.onCompleteActivity?.(activity)}>
                      <CheckCircle2 className="size-3.5" />
                      Mark Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => options?.onRescheduleActivity?.(activity)}>
                      <CalendarClock className="size-3.5" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => options?.onCancelActivity?.(activity)}>
                      <XCircle className="size-3.5" />
                      Cancel Activity
                    </DropdownMenuItem>
                  </>
                ) : null}
                {isCanceled ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => options?.onRescheduleActivity?.(activity)}>
                      <RotateCcw className="size-3.5" />
                      Reschedule
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
    },
  ];
}
