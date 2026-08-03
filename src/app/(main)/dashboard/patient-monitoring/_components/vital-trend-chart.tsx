import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type TrendKind = "heart-rate" | "map" | "spo2";

export interface TrendPoint {
  value: number;
}

interface VitalTrendChartProps {
  ariaLabel: string;
  data: TrendPoint[];
  domain: [number, number];
  kind: TrendKind;
  ticks: number[];
}

const trendChartConfig = {
  value: {
    label: "Value",
    color: "currentColor",
  },
} satisfies ChartConfig;

const trendClasses: Record<TrendKind, string> = {
  "heart-rate": "text-lime-500 dark:text-lime-400",
  map: "text-red-500 dark:text-red-400",
  spo2: "text-cyan-500 dark:text-cyan-400",
};

export function VitalTrendChart({ ariaLabel, data, domain, kind, ticks }: VitalTrendChartProps) {
  return (
    <ChartContainer
      aria-label={ariaLabel}
      className={cn("aspect-auto h-14 w-full", trendClasses[kind])}
      config={trendChartConfig}
      initialDimension={{ width: 600, height: 56 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 2, left: 0, right: 0, top: 2 }}>
        <CartesianGrid horizontal vertical stroke="var(--border)" strokeOpacity={0.55} />
        <YAxis
          allowDataOverflow
          axisLine={false}
          domain={domain}
          tickLine={false}
          tickMargin={4}
          ticks={ticks}
          width={28}
        />
        <Line
          dataKey="value"
          dot={false}
          isAnimationActive={false}
          stroke="var(--color-value)"
          strokeWidth={1.25}
          type="monotoneX"
        />
      </LineChart>
    </ChartContainer>
  );
}
