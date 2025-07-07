"use client";

import { format, subMonths } from "date-fns";
import { Wallet, BadgeDollarSign } from "lucide-react";
import { Area, AreaChart, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { ChartBarStacked } from "./dummy-graph";

const now = new Date();
const staticRevenues = [5400, 5800, 7200, 6800, 10400, 11200, 8500, 9200, 7500, 8000, 8900, 7800];

const revenueGrowthData = Array.from({ length: 12 }).map((_, i) => {
  const monthDate = subMonths(now, 11 - i);
  return {
    month: format(monthDate, "LLL yyyy"),
    revenue: staticRevenues[i],
  };
});

const data = [
  {
    revenue: 10400,
    subscription: 40,
  },
  {
    revenue: 14405,
    subscription: 90,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 89,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 78,
  },
  {
    revenue: 26475,
    subscription: 89,
  },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  subscription: {
    label: "Subscriptions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function OverviewCards() {
  return (
    <div className="grid grid-cols-6 gap-4 *:data-[slot=card]:min-h-52 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Last Month</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <ChartBarStacked />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-xl font-semibold tabular-nums">635</span>
          <span className="text-sm font-medium text-green-500">+54.6%</span>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden pb-0">
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>Last Month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChartContainer className="size-full min-h-24" config={chartConfig}>
            <AreaChart
              data={data}
              margin={{
                left: 0,
                right: 0,
                top: 10,
              }}
            >
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="subscription"
                fill="var(--color-subscription)"
                fillOpacity={0.05}
                stroke="var(--color-subscription)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-fit rounded-lg bg-green-500/10 p-2">
            <Wallet className="size-5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>Total Profit</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>
          <p className="text-2xl font-medium tabular-nums">$5400.54</p>
          <div className="w-fit rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">+22.2%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="bg-destructive/10 w-fit rounded-lg p-2">
            <BadgeDollarSign className="text-destructive size-5" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>
          <p className="text-2xl font-medium tabular-nums">
            23K <span className="text-muted-foreground text-sm">units</span>
          </p>
          <div className="text-destructive bg-destructive/10 w-fit rounded-md px-2 py-1 text-xs font-medium">-2.5%</div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Year to Date (YTD)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-24 w-full">
            <LineChart
              data={revenueGrowthData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">+35% growth since last year</p>
        </CardFooter>
      </Card>
    </div>
  );
}
