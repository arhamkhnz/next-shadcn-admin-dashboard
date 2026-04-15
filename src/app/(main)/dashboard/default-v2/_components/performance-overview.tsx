"use client";

import { addMonths, format, startOfMonth } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const signedRevenueData = [
  { monthOffset: 0, signed: 198_000, target: 112_000 },
  { monthOffset: 1, signed: 146_000, target: 176_000 },
  { monthOffset: 2, signed: 146_000, target: 108_000 },
  { monthOffset: 3, signed: 218_000, target: 108_000 },
  { monthOffset: 4, signed: 220_000, target: 162_000 },
  { monthOffset: 5, signed: 278_000, target: 168_000 },
  { monthOffset: 6, signed: 276_000, target: 332_000 },
  { monthOffset: 7, signed: 160_000, target: 332_000 },
  { monthOffset: 8, signed: 178_000, target: 256_000 },
  { monthOffset: 9, signed: 180_000, target: 154_000 },
  { monthOffset: 10, signed: 182_000, target: 148_000 },
  { monthOffset: 11, signed: 226_000, target: 198_000 },
].map((item) => {
  const date = addMonths(startOfMonth(new Date("2026-01-01T00:00:00")), item.monthOffset);

  return {
    date: date.toISOString(),
    signed: item.signed,
    target: item.target,
  };
});

const chartConfig = {
  signed: {
    label: "Signed",
    color: "var(--chart-2)",
  },
  target: {
    label: "Target",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const numberFormatter = new Intl.NumberFormat("en-US");

export function PerformanceOverview() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Card className="@container/card lg:col-span-12">
        <CardHeader>
          <CardTitle>Signed Over Time</CardTitle>
          <CardDescription>Momentum against the projected signing pace from January to December.</CardDescription>

          <CardAction>
            <Button variant="outline" size="sm">
              <CalendarDays data-icon="inline-start" />
              Jan - Dec
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
            <AreaChart accessibilityLayer data={signedRevenueData}>
              <defs>
                <linearGradient id="fillSigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="var(--color-signed)" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="var(--color-signed)" stopOpacity={0.1} />
                </linearGradient>
                {/* <linearGradient id="fillTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-target)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-target)" stopOpacity={0.08} />
                </linearGradient> */}
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 6" />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => format(new Date(value), "MMM")}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                width={44}
                tickFormatter={(value) => Math.round(Number(value) / 1000).toString()}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(_value, payload) => {
                      const item = payload?.[0]?.payload;
                      if (!item) return "";
                      return format(new Date(item.date), "MMM yyyy");
                    }}
                    formatter={(value, name) => {
                      const label = name === "signed" ? "Signed value" : "Target pace";

                      return (
                        <div className="flex min-w-40 items-center justify-between gap-4">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-foreground tabular-nums">
                            {numberFormatter.format(Number(value))}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />

              <Area
                dataKey="target"
                type="monotone"
                stroke="var(--color-target)"
                strokeDasharray="4 6"
                dot={false}
                fill="url(#fillTarget)"
                fillOpacity={1}
              />

              <Area
                dataKey="signed"
                type="monotone"
                stroke="var(--color-signed)"
                dot={false}
                fill="url(#fillSigned)"
                fillOpacity={1}
                activeDot={{
                  r: 5,
                  fill: "var(--background)",
                  stroke: "var(--color-signed)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
