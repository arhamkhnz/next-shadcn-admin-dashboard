import { ArrowUpRight, Ellipsis } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    label: "Unique Visitors",
    value: "213.1k",
    previous: "207.3k",
    change: "2.8%",
  },
  {
    label: "Sessions",
    value: "248.6k",
    previous: "243.5k",
    change: "2.1%",
  },
  {
    label: "Pageviews",
    value: "547.9k",
    previous: "529.4k",
    change: "3.5%",
  },
  {
    label: "Engagement Rate",
    value: "61.4%",
    previous: "58.9%",
    change: "4.2%",
  },
  {
    label: "Conversion Rate",
    value: "8.4%",
    previous: "7.8%",
    change: "7.7%",
  },
] as const;

export function AnalyticsKpiStrip() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10 xl:col-span-12">
      <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-none ring-0">
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">{metric.label}</CardTitle>
              <CardAction>
                <Ellipsis className="size-4 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-2xl leading-none tracking-tight">{metric.value}</div>
                <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                  <ArrowUpRight />
                  {metric.change}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span>
                  from <span className="text-foreground">{metric.previous}</span>
                </span>
                <span>•</span>
                <span>last 4 weeks</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
