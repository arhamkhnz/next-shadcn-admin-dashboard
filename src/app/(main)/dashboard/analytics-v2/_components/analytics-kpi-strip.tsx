import { ArrowDownRight, ArrowUpRight, Ellipsis } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsKpiStrip() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10 xl:col-span-12">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Unique Visitors</CardTitle>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl leading-none tracking-tight">213.1k</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight />
                2.8%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                from <span className="text-foreground">207.3k</span>
              </span>
              <span>•</span>
              <span>last 4 weeks</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Sessions</CardTitle>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl leading-none tracking-tight">248.6k</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight />
                2.1%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                from <span className="text-foreground">243.5k</span>
              </span>
              <span>•</span>
              <span>last 4 weeks</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Pageviews</CardTitle>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl leading-none tracking-tight">547.9k</div>
              <Badge className="bg-destructive/10 text-destructive">
                <ArrowDownRight />
                3.3%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                from <span className="text-foreground">566.8k</span>
              </span>
              <span>•</span>
              <span>last 4 weeks</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Engagement Rate</CardTitle>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl leading-none tracking-tight">61.4%</div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUpRight />
                4.2%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                from <span className="text-foreground">58.9%</span>
              </span>
              <span>•</span>
              <span>last 4 weeks</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Conversion Rate</CardTitle>
            <CardAction>
              <Ellipsis className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl leading-none tracking-tight">8.4%</div>
              <Badge className="bg-destructive/10 text-destructive">
                <ArrowDownRight />
                5.6%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>
                from <span className="text-foreground">8.9%</span>
              </span>
              <span>•</span>
              <span>last 4 weeks</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
