import { cn } from "cn";
import { CalendarDays, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const proposalSent = 12;
const proposalGoal = 18;
const proposalProgressPercentage = Math.round((proposalSent / proposalGoal) * 100);
const proposalGoalBarCount = 42;
const activeProposalBars = Math.round((proposalSent / proposalGoal) * proposalGoalBarCount);

const proposalGoalBars = Array.from({ length: proposalGoalBarCount }, (_, index) => ({
  id: `proposal-goal-${index + 1}`,
  active: index < activeProposalBars,
}));

export function TaskReminders() {
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
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
              <div className="flex flex-col items-center gap-1">
                <span>08:45</span>
                <span className="bg-border h-2 w-px" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span>09:00</span>
                <span className="bg-border h-2 w-px" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span>10:00</span>
                <span className="bg-border h-2 w-px" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span>10:20</span>
                <span className="bg-border h-2 w-px" />
              </div>
            </div>

            <div className="relative h-14">
              <div className="bg-border/80 absolute inset-x-3 top-1/2 h-px -translate-y-1/2" />
              <div className="bg-primary text-primary-foreground absolute top-2 bottom-2 left-[22%] flex w-[44%] items-center rounded-lg px-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-background text-primary flex size-7 items-center justify-center rounded-full">
                    <CalendarRange className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-primary-foreground truncate text-xs leading-none font-medium">
                      Product demo with Tim
                    </div>
                    <div className="text-primary-foreground/75 truncate text-[10px]">Weblabs Studio</div>
                  </div>
                </div>
              </div>
              <div className="bg-background/90 absolute top-4 bottom-4 left-[64%] w-1 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Proposal Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-end justify-between gap-3">
            <div className="text-2xl leading-none font-medium tabular-nums">
              {proposalSent} <span className="text-muted-foreground text-base font-normal">sent</span>
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
            {proposalProgressPercentage}% of this month&apos;s proposal target reached.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
