"use client";

import { useMemo } from "react";

import Link from "next/link";

import { AlarmClock, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { activityPriorityMeta } from "../activities/activity-utils";
import { useOverviewFilters } from "./overview-filters";
import { buildOverdueTasks } from "./overview-selectors";

export function OverdueTasksCard() {
  const { scopedActivities, names } = useOverviewFilters();
  const items = useMemo(() => buildOverdueTasks({ scopedActivities, names }), [scopedActivities, names]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Overdue tasks
          {items.length > 0 ? <Badge variant="destructive">{items.length}</Badge> : null}
        </CardTitle>
        <CardDescription>Open tasks past their due date, oldest first.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/tasks?view=overdue">
              Open task board
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlarmClock />
              </EmptyMedia>
              <EmptyTitle>No overdue tasks</EmptyTitle>
              <EmptyDescription>Every open task is still within its due date.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y">
            {items.map((item) => (
              <li key={item.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">
                    <Link href={item.detailHref} className="hover:underline">
                      {item.title}
                    </Link>
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    Due {item.dueLabel}
                    {item.relatedName ? ` · ${item.relatedName}` : ""}
                  </p>
                </div>
                <Badge className={activityPriorityMeta[item.priority].badgeClass}>{item.priority}</Badge>
                <Badge variant="destructive" className="shrink-0 tabular-nums">
                  {item.daysOverdue === 1 ? "1 day late" : `${item.daysOverdue} days late`}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
