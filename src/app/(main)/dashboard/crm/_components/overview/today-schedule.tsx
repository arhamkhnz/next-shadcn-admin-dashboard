"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import { ArrowRight, CalendarClock, Check, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getInitials } from "@/lib/utils";

import { reportToday } from "../../reports/_components/report-data/report-dates";
import type { Activity } from "../activities/activity-schema";
import { activityTypeMeta } from "../activities/activity-utils";
import { CompleteActivityDialog, RescheduleActivityDialog } from "../activities/activity-workflows";
import { useActivityStore } from "../activities/use-activity-store";
import { useOverviewFilters } from "./overview-filters";
import { buildTodaySchedule, type TodayItem } from "./overview-selectors";

function ScheduleRow({
  item,
  onComplete,
  onReschedule,
}: {
  item: TodayItem;
  onComplete: (activityId: string) => void;
  onReschedule: (activityId: string) => void;
}) {
  const startActivity = useActivityStore((state) => state.startActivity);
  const Icon = activityTypeMeta[item.type].icon;

  const handleStart = () => {
    const started = startActivity(item.key);
    if (started) {
      toast.success(`Started "${item.title}"`);
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5 first:pt-0 last:pb-0">
      <span className="w-16 shrink-0 font-medium text-muted-foreground text-xs tabular-nums">{item.timeLabel}</span>
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-md ${activityTypeMeta[item.type].badgeClass}`}
        aria-hidden="true"
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">
          <Link href={item.detailHref} className="hover:underline">
            {item.title}
          </Link>
        </p>
        <p className="truncate text-muted-foreground text-xs">
          {item.kind === "task" ? "Task" : item.type}
          {item.relatedName ? ` · ${item.relatedName}` : ""}
        </p>
      </div>
      {item.ownerId ? (
        <Avatar className="size-6" aria-label={`Owner ${item.ownerId}`}>
          <AvatarFallback className="text-[10px]">{getInitials(item.ownerId)}</AvatarFallback>
        </Avatar>
      ) : (
        <Badge variant="outline">Unassigned</Badge>
      )}
      <div className="flex items-center gap-1">
        {item.canStart ? (
          <Button variant="ghost" size="icon-sm" aria-label={`Start ${item.title}`} onClick={handleStart}>
            <Play />
          </Button>
        ) : null}
        {item.canReschedule ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Reschedule ${item.title}`}
            onClick={() => onReschedule(item.key)}
          >
            <RefreshCw />
          </Button>
        ) : null}
        {item.canComplete ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Complete ${item.title}`}
            onClick={() => onComplete(item.key)}
          >
            <Check />
          </Button>
        ) : null}
      </div>
    </li>
  );
}

export function TodaySchedule() {
  const { scopedActivities, names } = useOverviewFilters();
  const [completing, setCompleting] = useState<Activity | null>(null);
  const [rescheduling, setRescheduling] = useState<Activity | null>(null);

  const { timed, unscheduled } = useMemo(
    () => buildTodaySchedule({ scopedActivities, names }),
    [scopedActivities, names],
  );
  const total = timed.length + unscheduled.length;

  const resolveActivity = (activityId: string) =>
    scopedActivities.find((activity) => activity.id === activityId) ?? null;
  const handleComplete = (activityId: string) => setCompleting(resolveActivity(activityId));
  const handleReschedule = (activityId: string) => setRescheduling(resolveActivity(activityId));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Today
          {total > 0 ? <Badge variant="secondary">{total}</Badge> : null}
        </CardTitle>
        <CardDescription>Meetings, calls, and tasks scheduled for {format(reportToday, "MMMM d")}.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/crm/activities">
              All activities
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarClock />
              </EmptyMedia>
              <EmptyTitle>Nothing scheduled today</EmptyTitle>
              <EmptyDescription>Your calendar is clear. A good day to clear overdue work.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col">
            {timed.length > 0 ? (
              <ul className="flex flex-col divide-y">
                {timed.map((item) => (
                  <ScheduleRow key={item.key} item={item} onComplete={handleComplete} onReschedule={handleReschedule} />
                ))}
              </ul>
            ) : null}
            {unscheduled.length > 0 ? (
              <>
                {timed.length > 0 ? (
                  <p className="mt-4 mb-1 font-medium text-muted-foreground text-xs">Any time today</p>
                ) : null}
                <ul className="flex flex-col divide-y">
                  {unscheduled.map((item) => (
                    <ScheduleRow
                      key={item.key}
                      item={item}
                      onComplete={handleComplete}
                      onReschedule={handleReschedule}
                    />
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        )}

        <CompleteActivityDialog
          activity={completing}
          open={Boolean(completing)}
          onOpenChange={(open) => !open && setCompleting(null)}
        />
        <RescheduleActivityDialog
          activity={rescheduling}
          open={Boolean(rescheduling)}
          onOpenChange={(open) => !open && setRescheduling(null)}
        />
      </CardContent>
    </Card>
  );
}
