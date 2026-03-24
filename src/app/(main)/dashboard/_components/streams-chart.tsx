"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "An interactive area chart";

const data = [
  { month: "Oct", streams: 12400, royalties: 48 },
  { month: "Nov", streams: 18200, royalties: 71 },
  { month: "Dec", streams: 24800, royalties: 96 },
  { month: "Jan", streams: 19600, royalties: 76 },
  { month: "Feb", streams: 31200, royalties: 122 },
  { month: "Mar", streams: 42800, royalties: 167 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  streams: {
    label: "Streams",
    color: "var(--chart-1)",
  },
  royalties: {
    label: "Royalties",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function StreamsChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = data;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Streams & Royalties</CardTitle>
        <CardDescription>Oct 2024 – Mar 2025</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden *:data-[slot=toggle-group-item]:px-4!"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectGroup>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillStreams" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-streams)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-streams)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRoyalties" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-royalties)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-royalties)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value;
              }}
            />
            <YAxis yAxisId="streams" hide />
            <YAxis yAxisId="royalties" orientation="right" hide />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return String(value);
                  }}
                  indicator="dot"
                />
              }
            />
            <Area yAxisId="royalties" dataKey="royalties" type="natural" fill="url(#fillRoyalties)" stroke="var(--color-royalties)" stackId="a" />
            <Area yAxisId="streams" dataKey="streams" type="natural" fill="url(#fillStreams)" stroke="var(--color-streams)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
