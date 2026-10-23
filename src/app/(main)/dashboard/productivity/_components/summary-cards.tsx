import { ArrowRight, Clock3, Focus, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const summaryCards = [
  { title: "Today", value: "4", description: "tasks scheduled", icon: Clock3 },
  { title: "This Week", value: "68%", description: "progress", icon: TrendingUp },
  { title: "Focus", value: "Deep Work", description: "2 hours remaining", icon: Focus },
] as const;

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryCards.map((item) => (
        <Card key={item.title} className="shadow-xs">
          <CardHeader>
            <CardTitle>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <div className="bg-muted grid size-7 place-items-center rounded-lg border">
                  <item.icon className="size-4" />
                </div>
                {item.title}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl leading-none tracking-tight">{item.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground leading-none tabular-nums">{item.description}</p>
                <ArrowRight className="text-muted-foreground size-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
