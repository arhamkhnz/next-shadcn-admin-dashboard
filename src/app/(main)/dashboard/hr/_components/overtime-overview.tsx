"use client";

import { useState } from "react";

import { cn } from "cn";
import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { overtimePeriods } from "./data";

const chartConfig = {
  approved: {
    label: "Approved",
    theme: { light: "var(--color-blue-500)", dark: "var(--color-blue-600)" },
  },
  pending: {
    label: "Pending approval",
    theme: { light: "var(--color-amber-400)", dark: "var(--color-amber-600)" },
  },
  rejected: {
    label: "Rejected",
    theme: { light: "var(--color-red-400)", dark: "var(--color-red-600)" },
  },
} satisfies ChartConfig;

const overtimeStatuses = ["approved", "pending", "rejected"] as const;
const indicatorClasses = {
  approved: "bg-blue-500 dark:bg-blue-600",
  pending: "bg-amber-400 dark:bg-amber-600",
  rejected: "bg-red-400 dark:bg-red-600",
};

export function OvertimeOverview() {
  const [period, setPeriod] = useState("this-month");
  const selectedPeriod = overtimePeriods.find((item) => item.value === period) ?? overtimePeriods[0];
  const chartData = [selectedPeriod.data];
  const totalHours = selectedPeriod.data.approved + selectedPeriod.data.pending + selectedPeriod.data.rejected;

  return (
    <Card className="min-w-0 gap-2">
      <CardHeader>
        <CardTitle>Overtime overview</CardTitle>
        <CardAction>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger size="sm" aria-label="Overtime period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                {overtimePeriods.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-h-72 flex-1 flex-col gap-4">
        <div className="relative min-h-44 flex-1">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 mx-auto aspect-auto h-full w-full max-w-80"
            aria-label="Submitted overtime hours by approval status"
          >
            <RadialBarChart
              accessibilityLayer
              data={chartData}
              startAngle={180}
              endAngle={0}
              cy="80%"
              innerRadius={82}
              outerRadius={110}
            >
              <PolarAngleAxis type="number" domain={[0, totalHours]} tick={false} axisLine={false} />
              {overtimeStatuses.map((status) => (
                <RadialBar
                  key={status}
                  dataKey={status}
                  stackId="overtime"
                  fill={`var(--color-${status})`}
                  cornerRadius={5}
                  stroke="var(--card)"
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              ))}
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload?.map((item) => ({ ...item, value: `${item.value} h` }))}
                    hideLabel
                    indicator="dot"
                    className="min-w-42 [&_.justify-between]:gap-4"
                  />
                )}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

                    const centerY = viewBox.cy ?? 0;

                    return (
                      <text x={viewBox.cx} y={centerY} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={centerY - 30}
                          className="fill-foreground text-3xl font-medium tabular-nums"
                        >
                          {totalHours} h
                        </tspan>
                        <tspan x={viewBox.cx} y={centerY - 8} className="fill-muted-foreground text-xs">
                          Submitted overtime
                        </tspan>
                      </text>
                    );
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
        <dl className="mx-auto flex w-full max-w-80 shrink-0 flex-col gap-3">
          {overtimeStatuses.map((status) => (
            <div key={status} className="flex items-center justify-between gap-3 text-sm">
              <dt className="text-muted-foreground flex items-center gap-2">
                <span className={cn("size-2 shrink-0 rounded-sm", indicatorClasses[status])} aria-hidden="true" />
                {chartConfig[status].label}
              </dt>
              <dd className="font-medium tabular-nums">{selectedPeriod.data[status]} h</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
