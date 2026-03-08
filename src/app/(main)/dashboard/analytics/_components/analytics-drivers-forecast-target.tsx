"use client";

import { Bar, CartesianGrid, ComposedChart, Dot, LabelList, Line, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const forecastChartConfig = {
  closedWon: {
    label: "Closed Won",
    color: "var(--chart-1)",
  },
  weightedPipeline: {
    label: "Weighted Pipeline",
    color: "var(--chart-2)",
  },
  target: {
    label: "Target",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

type TrendPoint = {
  period: string;
  closedWon: number;
  weightedPipeline: number;
  target: number;
  deltaLabel?: string;
};

const CHART_DATA: TrendPoint[] = [
  { period: "W1", closedWon: 68.6, weightedPipeline: 152.4, target: 100 },
  { period: "W2", closedWon: 87.1, weightedPipeline: 158.1, target: 100 },
  { period: "W3", closedWon: 77.1, weightedPipeline: 154.8, target: 100 },
  { period: "W4", closedWon: 94.3, weightedPipeline: 162.2, target: 100 },
  { period: "W5", closedWon: 80.6, weightedPipeline: 160.4, target: 100 },
  { period: "W6", closedWon: 100, weightedPipeline: 168.5, target: 100 },
  { period: "W7", closedWon: 87.5, weightedPipeline: 172.1, target: 100 },
  { period: "W8", closedWon: 95.8, weightedPipeline: 178.3, target: 100 },
  { period: "W9", closedWon: 100, weightedPipeline: 181.0, target: 100 },
  { period: "W10", closedWon: 95.9, weightedPipeline: 185.4, target: 100 },
  { period: "W11", closedWon: 104.1, weightedPipeline: 188.7, target: 100 },
  { period: "W12", closedWon: 109.5, weightedPipeline: 192.1, target: 100, deltaLabel: "+9.5pp" },
];

export function DriversForecastTarget() {
  const chartData = CHART_DATA;
  const pipelineMin = Math.min(...CHART_DATA.map((point) => point.weightedPipeline));
  const pipelineMax = Math.max(...CHART_DATA.map((point) => point.weightedPipeline));

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
              domain={[0, "auto"]}
              ticks={[0, 50, 100, 150, 200]}
            />
            <YAxis yAxisId="pipeline" hide domain={[pipelineMin, pipelineMax]} />
            <ChartTooltip
              cursor={false}
              content={(props) => (
                <ChartTooltipContent
                  active={props.active}
                  label={props.label}
                  className="w-48"
                  payload={(props.payload ?? []).map((item) => ({
                    ...item,
                    value: typeof item.value === "number" ? `${item.value.toFixed(1)}%` : item.value,
                  }))}
                />
              )}
            />
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
              <LabelList dataKey="deltaLabel" position="top" offset={8} fill="var(--color-closedWon)" />
            </Bar>
            <Line
              type="monotone"
              yAxisId="pipeline"
              dataKey="weightedPipeline"
              name="Pipeline vs target"
              strokeOpacity={0}
              strokeWidth={0}
              stroke="var(--color-weightedPipeline)"
              isAnimationActive={false}
              dot={({ payload, ...props }) => (
                <Dot
                  key={`${payload.period}-weighted-pipeline`}
                  cx={props.cx}
                  cy={props.cy}
                  r={3.5}
                  fill="var(--color-weightedPipeline)"
                  stroke="var(--color-weightedPipeline)"
                  strokeWidth={7}
                  strokeOpacity={0.08}
                />
              )}
              activeDot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
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
