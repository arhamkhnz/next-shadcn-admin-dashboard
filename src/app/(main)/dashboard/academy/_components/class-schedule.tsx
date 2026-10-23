import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClassSchedule() {
  const today = format(new Date(), "EEEE, d MMMM");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Class Schedule</CardTitle>
        <CardAction className="text-muted-foreground flex items-center gap-1 text-xs">
          View Full Schedule <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        <div className="divide-border flex flex-col divide-y">
          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <div className="flex gap-2">
              <div className="w-1 shrink-0 rounded-md bg-green-600 dark:bg-green-400" />
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">08:00 - 08:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground truncate text-sm leading-none font-medium">Pure Mathematics</div>
              <div className="text-muted-foreground truncate text-xs leading-none">Grade 11A • Room 2.14</div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-md border-green-600/50 bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600 dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400"
            >
              In Progress
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <div className="flex gap-2">
              <div className="w-1 shrink-0 rounded-md bg-yellow-500 dark:bg-yellow-400" />
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">09:00 - 09:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground truncate text-sm leading-none font-medium">English Literature</div>
              <div className="text-muted-foreground truncate text-xs leading-none">Grade 11B • Seminar Room 3</div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-md border-yellow-600/50 bg-yellow-50 px-2.5 py-1 text-[10px] font-medium text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-500/10 dark:text-yellow-300"
            >
              Upcoming
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <div className="flex gap-2">
              <div className="w-1 shrink-0 rounded-md bg-yellow-500 dark:bg-yellow-400" />
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">10:00 - 10:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground truncate text-sm leading-none font-medium">Physics</div>
              <div className="text-muted-foreground truncate text-xs leading-none">Grade 11C • Physics Lab</div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-md border-yellow-600/50 bg-yellow-50 px-2.5 py-1 text-[10px] font-medium text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-500/10 dark:text-yellow-300"
            >
              Upcoming
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <div className="flex gap-2">
              <div className="bg-destructive w-1 shrink-0 rounded-md" />
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">11:00 - 11:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground truncate text-sm leading-none font-medium">Modern European History</div>
              <div className="text-muted-foreground truncate text-xs leading-none">Grade 11A • Room 1.08</div>
            </div>

            <Badge
              variant="secondary"
              className="border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/50 dark:bg-destructive/20 shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium"
            >
              Cancelled
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <div className="flex gap-2">
              <div className="w-1 shrink-0 rounded-md bg-yellow-500 dark:bg-yellow-400" />
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">12:00 - 12:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground truncate text-sm leading-none font-medium">Computer Science</div>
              <div className="text-muted-foreground truncate text-xs leading-none">Grade 11B • Computing Lab</div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 rounded-md border-yellow-600/50 bg-yellow-50 px-2.5 py-1 text-[10px] font-medium text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-500/10 dark:text-yellow-300"
            >
              Upcoming
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
