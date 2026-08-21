"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";

import { buildFlowBuckets, entriesInWindow } from "./crm-data/period";
import { qualifiedFlow, sumFlowEntries } from "./crm-data/qualified-flow";
import { useCrmFilters } from "./crm-filters";

const pipelineChartConfig = {
  qualified: {
    label: "Qualified",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PipelineActivity() {
  const { window, ownerId } = useCrmFilters();

  const buckets = buildFlowBuckets(qualifiedFlow, window.current, ownerId);
  const totals = sumFlowEntries(entriesInWindow(qualifiedFlow, window.current, ownerId));
  const discoveryCallsBooked = totals.discoveryBooked;
  const discoveryProgress = totals.qualified > 0 ? Math.round((discoveryCallsBooked / totals.qualified) * 100) : 0;

  const tooltipLabels = new Map(buckets.map((bucket) => [bucket.label, bucket.tooltipLabel]));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-12">
        <CardHeader>
          <CardTitle>Qualified Lead Flow</CardTitle>
          <CardAction>
            <span className="text-muted-foreground text-sm">{window.label}</span>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {buckets.length > 0 ? (
              <ChartContainer config={pipelineChartConfig} className="h-72 w-full lg:col-span-8">
                <BarChart data={buckets} margin={{ left: 0, right: 0, top: 0, bottom: 0 }} barSize={38}>
                  <defs>
                    <pattern
                      id="crm-qualified-pattern"
                      width="4"
                      height="4"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <rect width="6" height="6" fill="var(--color-qualified)" fillOpacity="0.15" />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="6"
                        stroke="var(--color-qualified)"
                        strokeWidth="1.25"
                        strokeOpacity="0.4"
                      />
                    </pattern>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="0" />
                  <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideIndicator
                        labelFormatter={(value) => tooltipLabels.get(String(value)) ?? String(value)}
                      />
                    }
                  />
                  <Bar
                    dataKey="qualified"
                    fill="url(#crm-qualified-pattern)"
                    radius={[8, 8, 0, 0]}
                    stroke="var(--color-qualified)"
                    strokeOpacity={0.5}
                    strokeWidth={0.5}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-72 w-full items-center justify-center lg:col-span-8">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BarChart3 />
                    </EmptyMedia>
                    <EmptyTitle>No qualified leads</EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <EmptyDescription>
                      No qualified lead flow matches the current period and owner filters.
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              </div>
            )}

            <div className="flex flex-col gap-5 rounded-lg p-4 lg:col-span-4">
              <div className="flex flex-col gap-1">
                <div className="font-medium text-4xl tabular-nums leading-none">
                  {totals.qualified} <span className="font-normal text-lg text-muted-foreground">leads</span>
                </div>
                <p className="text-muted-foreground text-sm">Total qualified leads captured over the {window.label}.</p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3">
                <div className="text-[11px] text-muted-foreground uppercase tracking-widest">
                  Discovery Calls Booked
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="font-medium text-2xl tabular-nums leading-none">
                    {discoveryCallsBooked} <span className="font-normal text-muted-foreground text-sm">meetings</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {discoveryProgress}% of qualified leads booked a first call.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-0.5">
                  <Progress
                    value={discoveryProgress}
                    className="h-2.5 bg-chart-2/12 *:data-[slot='progress-indicator']:bg-chart-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-medium tabular-nums">{discoveryCallsBooked} booked</div>
                    <div className="text-muted-foreground tabular-nums">{totals.qualified} qualified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
