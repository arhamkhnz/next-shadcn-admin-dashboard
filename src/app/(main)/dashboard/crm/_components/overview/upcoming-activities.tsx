"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ArrowRight, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { activityTypeMeta } from "../activities/activity-utils";
import { useOverviewFilters } from "./overview-filters";
import { buildUpcomingActivities } from "./overview-selectors";

export function UpcomingActivities() {
  const { scopedActivities, names } = useOverviewFilters();
  const items = useMemo(() => buildUpcomingActivities({ scopedActivities, names }), [scopedActivities, names]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Upcoming activities
          {items.length > 0 ? <Badge variant="secondary">{items.length}</Badge> : null}
        </CardTitle>
        <CardDescription>Next calls, meetings, and emails after today.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/crm/activities">
              View all
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
                <CalendarDays />
              </EmptyMedia>
              <EmptyTitle>No upcoming activities</EmptyTitle>
              <EmptyDescription>Nothing is scheduled after today for the current filters.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y">
            {items.map((item) => {
              const Icon = activityTypeMeta[item.type].icon;
              return (
                <li key={item.key} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
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
                      {item.dateLabel}
                      {item.relatedName ? ` · ${item.relatedName}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {item.dayLabel}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
