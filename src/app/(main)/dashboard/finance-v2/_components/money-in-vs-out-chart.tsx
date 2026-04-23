"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const monthlyPlanData = [
  { month: "Jan", expenses: 44, plannedSpend: 15, budgetVariance: 41 },
  { month: "Feb", expenses: 53, plannedSpend: 19, budgetVariance: 17 },
  { month: "Mar", expenses: 45, plannedSpend: 44, budgetVariance: 21 },
  { month: "Apr", expenses: 52, plannedSpend: 9, budgetVariance: 23 },
  { month: "May", expenses: 31, plannedSpend: 51, budgetVariance: 23 },
  { month: "Jun", expenses: 41, plannedSpend: 19, budgetVariance: 24 },
  { month: "Jul", expenses: 67, plannedSpend: 27, budgetVariance: 11 },
  { month: "Aug", expenses: 36, plannedSpend: 32, budgetVariance: 9 },
  { month: "Sep", expenses: 25, plannedSpend: 30, budgetVariance: 15 },
  { month: "Oct", expenses: 52, plannedSpend: 29, budgetVariance: 15 },
  { month: "Nov", expenses: 38, plannedSpend: 21, budgetVariance: 32 },
  { month: "Dec", expenses: 54, plannedSpend: 28, budgetVariance: 38 },
];

const chartConfig = {
  income: {
    label: "Total income",
    color: "var(--chart-3)",
  },
  expenses: {
    label: "Total expenses",
    color: "var(--chart-2)",
  },
  plannedSpend: {
    label: "Planned spend",
    color: "var(--chart-1)",
  },
  budgetVariance: {
    label: "Budget variance",
    color: "var(--muted)",
  },
} satisfies ChartConfig;

export function MoneyInVsOutChart() {
  return (
    <Card className="xl:col-span-8">
      <CardHeader>
        <CardTitle className="leading-none">Money In vs. Money Out</CardTitle>
        <CardDescription>Monthly income, spending plan, and variance.</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart
            accessibilityLayer
            barGap={10}
            barCategoryGap="20"
            barSize={42}
            data={monthlyPlanData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <pattern
                id="finance-budget-variance-pattern"
                width="6"
                height="6"
                patternTransform="rotate(45)"
                patternUnits="userSpaceOnUse"
              >
                <rect fill="var(--color-budgetVariance)" height="6" opacity="0.45" width="6" />
                <line stroke="var(--border)" strokeOpacity="0.7" strokeWidth="1.25" x1="0" x2="0" y1="0" y2="6" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              ticks={[0, 40, 80, 120]}
              tickFormatter={(value) => `${Number(value).toFixed(2)}`}
              hide
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" stackId="overview" />
            <Bar dataKey="plannedSpend" fill="var(--color-plannedSpend)" stackId="overview" />
            <Bar
              dataKey="budgetVariance"
              fill="url(#finance-budget-variance-pattern)"
              radius={[6, 6, 0, 0]}
              stackId="overview"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
