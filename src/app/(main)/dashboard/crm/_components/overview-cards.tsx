"use client";

import { format, subMonths } from "date-fns";
import { Wallet, BadgeDollarSign } from "lucide-react";
import { Area, AreaChart, Line, LineChart, Bar, BarChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import {
  leadsChartData,
  leadsChartConfig,
  proposalsChartData,
  proposalsChartConfig,
  revenueChartData,
  revenueChartConfig,
} from "./crm.config";

const lastMonth = format(subMonths(new Date(), 1), "LLLL");

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader>
          <CardTitle>New Leads</CardTitle>
          <CardDescription>Last Month</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <ChartContainer className="size-full min-h-24" config={leadsChartConfig}>
            <BarChart accessibilityLayer data={leadsChartData} barSize={8}>
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} />} />
              <Bar
                background={{ fill: "var(--color-background)", radius: 4, opacity: 0.07 }}
                dataKey="newLeads"
                stackId="a"
                fill="var(--color-newLeads)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="disqualified" stackId="a" fill="var(--color-disqualified)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-xl font-semibold tabular-nums">635</span>
          <span className="text-sm font-medium text-green-500">+54.6%</span>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden pb-0">
        <CardHeader>
          <CardTitle>Proposals Sent</CardTitle>
          <CardDescription>Last Month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChartContainer className="size-full min-h-24" config={proposalsChartConfig}>
            <AreaChart
              data={proposalsChartData}
              margin={{
                left: 0,
                right: 0,
                top: 5,
              }}
            >
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip
                content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} hideIndicator />}
              />
              <Area
                dataKey="proposalsSent"
                fill="var(--color-proposalsSent)"
                fillOpacity={0.05}
                stroke="var(--color-proposalsSent)"
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
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>
          <p className="text-2xl font-medium tabular-nums">$56,050</p>
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
            <CardTitle>Projects Won</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>
          <p className="text-2xl font-medium tabular-nums">136</p>
          <div className="text-destructive bg-destructive/10 w-fit rounded-md px-2 py-1 text-xs font-medium">-2.5%</div>
        </CardContent>
      </Card>

      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Year to Date (YTD)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-24 w-full">
            <LineChart
              data={revenueChartData}
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
