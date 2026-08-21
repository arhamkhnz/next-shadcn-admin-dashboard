"use client";

import { CalendarClock, CheckCircle2, CircleDashed, ListTodo, UserRoundX } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { TaskSummary } from "./task-utils";

interface TaskSummaryCardsProps {
  summary: TaskSummary;
}

const cardMeta = {
  open: { label: "Open Tasks", icon: ListTodo },
  dueToday: { label: "Due Today", icon: CalendarClock },
  overdue: { label: "Overdue", icon: CircleDashed },
  completed: { label: "Completed This Month", icon: CheckCircle2 },
  unassigned: { label: "Unassigned", icon: UserRoundX },
} as const;

export function TaskSummaryCards({ summary }: TaskSummaryCardsProps) {
  const cards = [
    { key: "open" as const, value: summary.openCount, tone: "" },
    {
      key: "dueToday" as const,
      value: summary.dueTodayCount,
      tone: "text-amber-600 dark:text-amber-400",
    },
    { key: "overdue" as const, value: summary.overdueCount, tone: "text-destructive" },
    {
      key: "completed" as const,
      value: summary.completedThisMonthCount,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    { key: "unassigned" as const, value: summary.unassignedCount, tone: "" },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const meta = cardMeta[card.key];
          const Icon = meta.icon;
          return (
            <Card key={card.key} size="sm">
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <Icon className="size-3.5" />
                  {meta.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl tabular-nums leading-none tracking-tight", card.tone)}>{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
