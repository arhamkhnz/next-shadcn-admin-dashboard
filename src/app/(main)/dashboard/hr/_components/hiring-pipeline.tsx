"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { hiringPipeline } from "./data";

const chartConfig = {
  candidates: {
    label: "Candidates",
    theme: { light: "var(--color-blue-500)", dark: "var(--color-blue-600)" },
  },
} satisfies ChartConfig;

const totalCandidates = hiringPipeline.reduce((total, item) => total + item.candidates, 0);

export function HiringPipeline() {
  return (
    <Card className="min-w-0 gap-2">
      <CardHeader>
        <CardTitle>Hiring pipeline</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-72 flex-1 flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-medium tracking-tight tabular-nums">{totalCandidates}</p>
          <p className="text-muted-foreground text-xs">active candidates</p>
        </div>
        <div className="relative min-h-52 flex-1">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 aspect-auto h-full w-full"
            aria-label="Current candidate counts by hiring stage"
          >
            <BarChart
              accessibilityLayer
              data={hiringPipeline}
              layout="vertical"
              margin={{ top: 16, right: 36, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis dataKey="stage" type="category" hide />
              <CartesianGrid horizontal={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar
                dataKey="candidates"
                fill="var(--color-candidates)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="stage"
                  position={{ x: 0, y: -8 }}
                  textAnchor="start"
                  className="fill-muted-foreground"
                  fontSize={12}
                />
                <LabelList
                  dataKey="candidates"
                  position="right"
                  offset={8}
                  className="fill-muted-foreground font-mono tabular-nums"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
