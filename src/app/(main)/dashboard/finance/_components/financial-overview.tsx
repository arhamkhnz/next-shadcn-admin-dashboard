"use client";

import { ArrowDownLeft, ArrowUpRight, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const chartData = [
  { month: "Jan", scheduled: 2000, expenses: 4000, income: 9500 },
  { month: "Feb", scheduled: 2200, expenses: 4200, income: 9500 },
  { month: "Mar", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "Apr", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "May", scheduled: 2200, expenses: 4200, income: 9500 },
  { month: "Jun", scheduled: 2000, expenses: 4000, income: 9500 },
  { month: "Jul", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "Aug", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "Sep", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "Oct", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "Nov", scheduled: 2100, expenses: 4100, income: 9500 },
  { month: "Dec", scheduled: 2100, expenses: 4100, income: 9500 },
];

const chartConfig = {
  scheduled: {
    label: "Scheduled",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
  income: {
    label: "Income",
    color: "var(--chart-3)",
  },
} as ChartConfig;

export function FinancialOverview() {
  const totalIncome = chartData.reduce((acc, item) => acc + item.income, 0);
  const totalExpenses = chartData.reduce((acc, item) => acc + item.expenses, 0);
  const totalScheduled = chartData.reduce((acc, item) => acc + item.scheduled, 0);
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Track your income, expenses, and scheduled amounts at a glance.</CardDescription>
        <CardAction>
          <Select defaultValue="last-year">
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex flex-col items-start justify-between gap-2 py-5 md:flex-row md:items-stretch md:gap-0">
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border">
              <ArrowDownLeft className="stroke-chart-1 size-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">Income</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalIncome, { noDecimals: true })}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="!h-auto" />
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border">
              <ArrowUpRight className="stroke-chart-2 size-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">Expenses</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalExpenses, { noDecimals: true })}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="!h-auto" />
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border">
              <CalendarCheck className="stroke-chart-3 size-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">Scheduled</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalScheduled, { noDecimals: true })}</p>
            </div>
          </div>
        </div>
        <Separator />
        <ChartContainer className="max-h-72 w-full" config={chartConfig}>
          <BarChart margin={{ left: -25, right: 0, top: 25, bottom: 0 }} accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value >= 1000 ? value / 1000 + "k" : value}`}
              domain={[0, 20000]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="scheduled" stackId="a" fill={chartConfig.scheduled.color} />
            <Bar dataKey="expenses" stackId="a" fill={chartConfig.expenses.color} />
            <Bar dataKey="income" stackId="a" fill={chartConfig.income.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
