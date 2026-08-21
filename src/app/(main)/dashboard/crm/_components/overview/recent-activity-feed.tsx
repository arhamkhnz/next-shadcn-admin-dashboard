"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Building2, CircleCheck, Handshake, Mail, PhoneCall, User, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getInitials } from "@/lib/utils";

import { getOwnerName } from "../crm-data/sales-team";
import { useOverviewFilters } from "./overview-filters";
import { buildRecentEvents, type RecentEventEntity } from "./overview-selectors";

const entityIcons: Record<RecentEventEntity, typeof User> = {
  Lead: User,
  Contact: Users,
  Company: Building2,
  Deal: Handshake,
  Activity: PhoneCall,
  Task: CircleCheck,
};

export function RecentActivityFeed() {
  const { activeLeads, contacts, companies, openDeals, scopedActivities, window } = useOverviewFilters();

  const events = useMemo(
    () =>
      buildRecentEvents({
        leads: activeLeads,
        contacts,
        companies,
        deals: openDeals,
        scopedActivities,
        range: window.current,
      }),
    [activeLeads, contacts, companies, openDeals, scopedActivities, window],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest record changes and completions in the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Mail />
              </EmptyMedia>
              <EmptyTitle>No recent activity</EmptyTitle>
              <EmptyDescription>
                Nothing happened in this period yet. Widen the date range to see more.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
            {events.map((event) => {
              const Icon = entityIcons[event.entityType];
              return (
                <li key={event.key} className="flex items-start gap-3 border-b py-2.5 last:border-b-0">
                  <span
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                    aria-hidden="true"
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <span className="font-medium">{event.action}</span>{" "}
                      <Link href={event.href} className="text-muted-foreground hover:underline">
                        {event.description}
                      </Link>
                    </p>
                    <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <time dateTime={event.at.toISOString()}>{event.timeLabel}</time>
                      {event.ownerId ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <Avatar className="size-4">
                            <AvatarFallback className="text-[8px]">
                              {getInitials(getOwnerName(event.ownerId))}
                            </AvatarFallback>
                          </Avatar>
                          {getOwnerName(event.ownerId)}
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
