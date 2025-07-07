"use client";

import { format, subMonths } from "date-fns";
import { Bar, BarChart, XAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { date: "1-5", orders: 120, returned: 40 },
  { date: "6-10", orders: 95, returned: 30 },
  { date: "11-15", orders: 60, returned: 22 },
  { date: "16-20", orders: 100, returned: 35 },
  { date: "21-25", orders: 150, returned: 70 },
  { date: "26-30", orders: 110, returned: 60 },
];

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
  returned: {
    label: "Returned",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const lastMonth = format(subMonths(new Date(), 1), "LLLL");

export function ChartBarStacked() {
  return (
    <ChartContainer className="size-full min-h-24" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData} barSize={8}>
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} />} />
        <Bar
          dataKey="background"
          background={{ fill: "var(--card-foreground)", radius: 4, opacity: 0.1 }}
          stackId="a"
        />
        <Bar dataKey="orders" stackId="a" fill="var(--color-orders)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="returned" stackId="a" fill="var(--color-returned)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
