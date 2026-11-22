"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { genderByAgeGroup } from "./data";

const chartConfig = {
  male: { label: "Male", theme: { light: "var(--color-blue-500)", dark: "var(--color-blue-600)" } },
  female: { label: "Female", theme: { light: "var(--color-slate-500)", dark: "var(--color-slate-400)" } },
} satisfies ChartConfig;

export function GenderDistribution() {
  return (
    <Card className="min-w-0 gap-2">
      <CardHeader>
        <CardTitle>Gender by age group</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="relative min-h-72 flex-1">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 aspect-auto h-full w-full"
            aria-label="Employee gender distribution by age group"
          >
            <AreaChart accessibilityLayer data={genderByAgeGroup} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" axisLine={false} tickLine={false} tickMargin={10} interval={0} />
              <YAxis axisLine={false} tickLine={false} width={28} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Age ${value}`}
                    indicator="dot"
                    className="min-w-44"
                  />
                }
              />
              <ChartLegend
                verticalAlign="top"
                itemSorter={null}
                content={<ChartLegendContent verticalAlign="top" className="flex-wrap justify-start pb-4" />}
              />
              <Area
                dataKey="male"
                type="linear"
                stroke="var(--color-male)"
                fill="var(--color-male)"
                fillOpacity={0.08}
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                dataKey="female"
                type="linear"
                stroke="var(--color-female)"
                fill="var(--color-female)"
                fillOpacity={0.08}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
