"use client";

import * as React from "react";

import { Area, Bar, ComposedChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TimeRange = "30d" | "7d" | "24h";

const performanceData = Array.from({ length: 240 }, (_, index) => {
  const date = new Date("2026-07-01T00:00:00");
  date.setHours(date.getHours() + index * 3);

  const weeklyWave = Math.sin(index / 6) * 5200;
  const dailyWave = Math.sin(index / 2.4) * 2100;
  const momentum = index * 72;

  return {
    date: date.toISOString(),
    revenue: Math.round(48_000 + weeklyWave + dailyWave + momentum),
    customers: Math.max(6, Math.round(16 + Math.sin(index / 3.4) * 7 + index / 18)),
  };
});

const metricCards = [
  { label: "New customers", value: "182", change: "+8.4%" },
  { label: "Active accounts", value: "1,248", change: "+4.5%" },
  { label: "Growth rate", value: "8.32%", change: "+1.2%" },
  { label: "Revenue", value: "$60.77", change: "+3.1%" },
] as const;

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  customers: {
    label: "New customers",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

const _wholeNumberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function PerformanceOverview() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d");

  const filteredData = React.useMemo(() => {
    switch (timeRange) {
      case "24h":
        return performanceData.slice(-8);
      case "7d":
        return performanceData.slice(-56);
      default:
        return performanceData;
    }
  }, [timeRange]);

  const latestPoint = filteredData.at(-1);
  const revenueMin = Math.min(...filteredData.map((item) => item.revenue));
  const revenueMax = Math.max(...filteredData.map((item) => item.revenue));

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Performance</CardTitle>
          <CardDescription>Booked revenue and new customer activity across the last month.</CardDescription>

          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {
                if (value) {
                  setTimeRange(value as TimeRange);
                }
              }}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-3! md:flex"
            >
              <ToggleGroupItem value="30d">30 Days</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 Days</ToggleGroupItem>
              <ToggleGroupItem value="24h">24 Hours</ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6 border-border/50 border-b pb-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3 xl:min-w-55">
              <div className="font-semibold text-4xl tabular-nums tracking-tight">
                {currencyFormatter.format(latestPoint?.revenue ?? 0)}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge className="rounded-full px-2.5 py-0.5">{metricCards[2].change}</Badge>
                <span className="text-muted-foreground">Compared to last month</span>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap justify-end gap-3">
              {metricCards.map((item) => (
                <div
                  key={item.label}
                  className="w-30 space-y-1.5 rounded-lg border border-border p-2 text-left shadow-xs"
                >
                  <div className="text-muted-foreground text-xs">{item.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium tabular-nums">{item.value}</div>
                    <div className="text-[0.625rem] text-muted-foreground">{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ComposedChart accessibilityLayer data={filteredData} margin={{ left: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                minTickGap={24}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    ...(timeRange === "24h"
                      ? {
                          hour: "numeric" as const,
                        }
                      : {
                          month: "short" as const,
                          day: "numeric" as const,
                        }),
                  })
                }
              />

              <YAxis
                yAxisId="revenue"
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                width={42}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                domain={[Math.floor(revenueMin / 1000) * 1000 - 2000, Math.ceil(revenueMax / 1000) * 1000 + 2000]}
              />

              {/* <ChartTooltip
                cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
                defaultIndex={Math.max(0, filteredData.length - 6)}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        ...(timeRange === "24h"
                          ? {
                              month: "short" as const,
                              day: "numeric" as const,
                              hour: "numeric" as const,
                            }
                          : {
                              month: "long" as const,
                              day: "numeric" as const,
                              year: "numeric" as const,
                            }),
                      })
                    }
                    formatter={(value, name) => {
                      if (name === "Revenue") {
                        return (
                          <span className="font-medium text-foreground tabular-nums">
                            {currencyFormatter.format(Number(value))}
                          </span>
                        );
                      }

                      return (
                        <span className="font-medium text-foreground tabular-nums">
                          {wholeNumberFormatter.format(Number(value))}
                        </span>
                      );
                    }}
                  />
                }
              /> */}

              <Bar
                yAxisId="customers"
                dataKey="customers"
                fill="var(--color-customers)"
                opacity={0.18}
                radius={[999, 999, 0, 0]}
                maxBarSize={10}
              />

              <Area
                yAxisId="revenue"
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "var(--color-revenue)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
