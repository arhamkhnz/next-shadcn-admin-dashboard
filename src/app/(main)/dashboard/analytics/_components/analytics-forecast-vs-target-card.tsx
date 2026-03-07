"use client";

import { BarChart3, Circle } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, LabelList, Line, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { getForecastTrendChartData } from "./analytics.data";

const forecastChartConfig = {
  closedWon: {
    label: "Closed Won",
    icon: BarChart3,
    color: "var(--chart-1)",
  },
  weightedPipeline: {
    label: "Weighted Pipeline",
    icon: Circle,
    color: "var(--chart-2)",
  },
  target: {
    label: "Target",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function ForecastVsTargetCard() {
  const chartData = getForecastTrendChartData().map((point) => ({
    period: point.period,
    closedWon: Number(((point.closedWon / point.target) * 100).toFixed(1)),
    weightedPipeline: Number(((point.weightedPipeline / point.target) * 100).toFixed(1)),
    target: 100,
  }));
  const pipelineMin = Math.min(...chartData.map((point) => point.weightedPipeline));
  const pipelineMax = Math.max(...chartData.map((point) => point.weightedPipeline));
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Forecast vs Target</CardTitle>
        <CardDescription>12-week trend with attainment context</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricChip label="Attainment" value="72.4%" note="closed won / monthly target" />
          <MetricChip label="Weighted Pipeline" value="$1,284,000" note="vs $668,000 remaining" />
          <MetricChip label="Forecast Confidence" value="81.0%" note="volatility-adjusted confidence" />
        </div>
        <ChartContainer config={forecastChartConfig} className="h-68 w-full">
          <ComposedChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.25} />
            <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis
              tickFormatter={(value) => `${Math.round(value)}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              domain={[0, 140]}
              ticks={[0, 50, 100, 150]}
            />
            <YAxis yAxisId="pipeline" hide domain={[pipelineMin, pipelineMax]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ReferenceLine y={100} stroke="var(--color-target)" strokeWidth={2} strokeDasharray="6 5" />
            <Bar
              dataKey="closedWon"
              name="Closed won"
              fill="var(--color-closedWon)"
              fillOpacity={0.22}
              stroke="var(--color-closedWon)"
              strokeOpacity={0.35}
              radius={[5, 5, 0, 0]}
              barSize={14}
            >
              <LabelList content={renderW12DeltaLabel} />
            </Bar>
            <Line
              type="monotone"
              yAxisId="pipeline"
              dataKey="weightedPipeline"
              name="Pipeline vs target"
              stroke="var(--color-weightedPipeline)"
              strokeOpacity={0}
              strokeWidth={0}
              dot={<PipelineMarker />}
              activeDot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function PipelineMarker(props: { cx?: number; cy?: number }) {
  if (typeof props.cx !== "number" || typeof props.cy !== "number") {
    return null;
  }

  return (
    <g>
      <circle cx={props.cx} cy={props.cy} r={3.5} fill="var(--color-weightedPipeline)" fillOpacity={0.95} />
      <circle cx={props.cx} cy={props.cy} r={7} fill="var(--color-weightedPipeline)" fillOpacity={0.08} />
    </g>
  );
}

function renderW12DeltaLabel(props: { x?: number; y?: number; width?: number; index?: number; value?: number }) {
  if (
    typeof props.index !== "number" ||
    props.index !== 11 ||
    typeof props.x !== "number" ||
    typeof props.y !== "number" ||
    typeof props.width !== "number" ||
    typeof props.value !== "number"
  ) {
    return null;
  }

  const delta = props.value - 100;

  return (
    <text
      x={props.x + props.width / 2}
      y={props.y - 10}
      textAnchor="middle"
      fill="var(--color-closedWon)"
      fontSize={11}
      fontWeight={600}
    >
      +{delta.toFixed(1)}pp
    </text>
  );
}

function MetricChip({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md border bg-muted/35 px-3 py-2.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-lg tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{note}</p>
    </div>
  );
}
