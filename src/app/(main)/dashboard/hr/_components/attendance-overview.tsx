"use client";

import { useState } from "react";

import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { attendanceData } from "./data";

const chartConfig = {
  present: {
    label: "Present",
    theme: { light: "var(--color-blue-500)", dark: "var(--color-blue-600)" },
  },
  onLeave: {
    label: "On leave",
    theme: { light: "var(--color-amber-400)", dark: "var(--color-amber-600)" },
  },
  absent: {
    label: "Absent",
    theme: { light: "var(--color-red-400)", dark: "var(--color-red-600)" },
  },
} satisfies ChartConfig;

export function AttendanceOverview() {
  const [period, setPeriod] = useState("month");
  const chartData = period === "week" ? attendanceData.slice(-5) : attendanceData;

  return (
    <Card className="min-w-0 gap-2 xl:col-span-2">
      <CardHeader>
        <CardTitle>Attendance overview</CardTitle>
        <CardAction>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger size="sm" aria-label="Attendance period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full" aria-label="Daily employee attendance">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
              tickFormatter={(value: string) => format(parseISO(value), "MMM d")}
            />
            <YAxis tickLine={false} axisLine={false} width={36} domain={[0, 300]} ticks={[0, 75, 150, 225, 300]} />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  labelFormatter={(value) => format(parseISO(String(value)), "EEEE, d MMM yyyy")}
                  indicator="dot"
                  className="min-w-48"
                />
              )}
            />
            <ChartLegend
              verticalAlign="top"
              itemSorter={null}
              content={<ChartLegendContent verticalAlign="top" className="flex-wrap justify-start pb-6" />}
            />
            <Bar
              dataKey="present"
              stackId="attendance"
              fill="var(--color-present)"
              maxBarSize={32}
              isAnimationActive={false}
            />
            <Bar
              dataKey="onLeave"
              stackId="attendance"
              fill="var(--color-onLeave)"
              maxBarSize={32}
              isAnimationActive={false}
            />
            <Bar
              dataKey="absent"
              stackId="attendance"
              fill="var(--color-absent)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
