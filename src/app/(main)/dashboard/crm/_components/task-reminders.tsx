"use client";

import { addDays, differenceInCalendarDays, format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

import { companyById } from "./crm-data/companies";
import { crmMeetings, upcomingMeetings } from "./crm-data/meetings";
import { countProposalStage, getProposalTarget } from "./crm-data/metrics";
import { filterOpportunities, opportunityRows } from "./crm-data/opportunities";
import { useCrmFilters } from "./crm-filters";

const proposalGoalBarCount = 42;

export function TaskReminders() {
  const { window, ownerId } = useCrmFilters();

  const durationDays = differenceInCalendarDays(window.current.end, window.current.start) + 1;
  const meetings = upcomingMeetings(crmMeetings, addDays(window.current.end, durationDays), ownerId).slice(0, 4);

  const opportunities = filterOpportunities(opportunityRows, window.current, ownerId);
  const proposalSent = countProposalStage(opportunities);
  const proposalGoal = getProposalTarget(ownerId, durationDays);
  const proposalProgressPercentage = proposalGoal > 0 ? Math.round((proposalSent / proposalGoal) * 100) : 0;
  const activeProposalBars = Math.round((Math.min(proposalProgressPercentage, 100) / 100) * proposalGoalBarCount);

  const proposalGoalBars = Array.from({ length: proposalGoalBarCount }, (_, index) => ({
    id: `proposal-goal-${index + 1}`,
    active: index < activeProposalBars,
  }));

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-8">
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <CalendarDays data-icon="inline-start" />
              View Calendar
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {meetings.length > 0 ? (
            <div className="flex flex-col">
              {meetings.map((meeting) => {
                const company = companyById.get(meeting.companyId);
                return (
                  <div
                    key={meeting.id}
                    className="flex items-center gap-3 border-b border-border/50 py-3 last:border-b-0"
                  >
                    <div className="flex w-12 shrink-0 flex-col items-center gap-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {format(meeting.startsAt, "EEE")}
                      </span>
                      <span className="font-medium text-xl leading-none tabular-nums">
                        {format(meeting.startsAt, "d")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-sm">{meeting.title}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {company?.name} · {meeting.contact}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground tabular-nums">
                      <div>{format(meeting.startsAt, "h:mm a")}</div>
                      <div>{meeting.durationMinutes}m</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarDays />
                </EmptyMedia>
                <EmptyTitle>No upcoming meetings</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>No meetings are scheduled within the current period for this owner.</EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-4">
        <CardHeader>
          <CardTitle>Proposal Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-end justify-between gap-3">
            <div className="font-medium text-2xl tabular-nums leading-none">
              {proposalSent} <span className="font-normal text-base text-muted-foreground">sent</span>
            </div>
            <div className="text-muted-foreground text-sm tabular-nums">{proposalGoal} target</div>
          </div>
          <div className="flex h-10 w-full items-end gap-0.5">
            {proposalGoalBars.map((bar) => (
              <div key={bar.id} className="flex flex-1 justify-center">
                <div
                  className={cn(
                    "h-10 w-1.5 rounded-full",
                    bar.active ? "bg-muted-foreground/75" : "bg-muted-foreground/25",
                  )}
                />
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            {proposalProgressPercentage}% of the {window.label} proposal target reached.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
