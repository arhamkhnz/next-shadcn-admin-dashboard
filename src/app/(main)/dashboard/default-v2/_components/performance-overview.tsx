"use client";

import { addHours, format } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const referenceDate = new Date("2024-06-30T18:00:00");
const startDate = addHours(referenceDate, -(179 * 12));

const chartData = Array.from({ length: 180 }, (_, index) => {
  const date = addHours(startDate, index * 12);

  const newCustomersBase = 9200 + Math.sin(index / 2.8) * 1350 + Math.cos(index / 5.1) * 920;
  const newCustomersJitter = Math.sin(index * 1.9) * 840 + Math.cos(index * 1.3) * 520;
  const newCustomersSpike = index % 31 === 0 ? 13200 : index % 23 === 0 ? 8800 : index % 11 === 0 ? 5200 : 0;

  const activeAccountsBase = 6200 + Math.sin(index / 18) * 120 + Math.cos(index / 26) * 80;
  const activeAccountsJitter = Math.sin(index * 1.95) * 160 + Math.cos(index * 1.2) * 90;
  const activeAccountsSpike = index % 41 === 0 ? 260 : index % 23 === 0 ? 140 : 0;

  const returningUsersBase = 4550 + Math.sin(index / 20) * 90 + Math.cos(index / 28) * 60;
  const returningUsersJitter = Math.cos(index * 1.72) * 90 + Math.sin(index * 1.08) * 48;
  const returningUsersSpike = index % 47 === 0 ? 180 : index % 29 === 0 ? 90 : 0;

  return {
    date: format(date, "yyyy-MM-dd"),
    newCustomers: Math.round(newCustomersBase + newCustomersJitter + newCustomersSpike),
    activeAccounts: Math.round(activeAccountsBase + activeAccountsJitter + activeAccountsSpike),
    returningUsers: Math.round(returningUsersBase + returningUsersJitter + returningUsersSpike),
  };
});

const chartConfig = {
  newCustomers: {
    label: "New Customers",
    color: "var(--chart-1)",
  },
  activeAccounts: {
    label: "Active Accounts",
    color: "var(--chart-2)",
  },
  returningUsers: {
    label: "Returning Users",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PerformanceOverview() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Customer Activity</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Customer activity for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="quarter">
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period</SelectLabel>
                <SelectItem value="quarter">3 months</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="All segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Segments</SelectLabel>
                <SelectItem value="all">All segments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            View report
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart data={chartData} margin={{ top: 0 }}>
            <defs>
              <linearGradient id="fillNewCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.36} />
                <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-50"
                  indicator="line"
                  labelFormatter={(value) => format(new Date(value), "d MMMM yyyy")}
                />
              }
            />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

            <Area
              dataKey="newCustomers"
              type="natural"
              fill="url(#fillNewCustomers)"
              stroke="var(--color-newCustomers)"
              strokeWidth={1.7}
              dot={false}
              fillOpacity={1}
            />
            <Line
              dataKey="activeAccounts"
              type="natural"
              stroke="var(--color-activeAccounts)"
              strokeWidth={1.4}
              dot={false}
            />
            <Line
              dataKey="returningUsers"
              type="natural"
              stroke="var(--color-returningUsers)"
              strokeWidth={1.2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
