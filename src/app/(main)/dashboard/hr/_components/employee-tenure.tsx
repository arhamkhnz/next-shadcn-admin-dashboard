"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { employeeTenure } from "./data";

const chartConfig = {
  employees: {
    label: "Employees",
    theme: { light: "var(--color-blue-500)", dark: "var(--color-blue-600)" },
  },
} satisfies ChartConfig;

export function EmployeeTenure() {
  return (
    <Card className="min-w-0 gap-2">
      <CardHeader>
        <CardTitle>Employee tenure</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="relative min-h-72 flex-1">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 aspect-auto h-full w-full"
            aria-label="Employee counts by years of service"
          >
            <BarChart accessibilityLayer data={employeeTenure} margin={{ top: 20, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="years" tickLine={false} axisLine={false} tickMargin={10} interval={0} />
              <YAxis tickLine={false} axisLine={false} width={28} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="employees"
                fill="var(--color-employees)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                isAnimationActive={false}
              >
                <LabelList dataKey="employees" position="top" offset={8} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
