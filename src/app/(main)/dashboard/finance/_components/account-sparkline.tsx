"use client";

import { Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  value: { color: "var(--chart-1)", label: "Balance" },
} satisfies ChartConfig;

type AccountSparklineProps = {
  data: number[];
  positive?: boolean;
  className?: string;
  label?: string;
};

export function AccountSparkline({ data, positive = true, className, label }: AccountSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));
  const stroke = positive ? "var(--chart-2)" : "var(--chart-4)";
  const min = data.length ? Math.min(...data) : 0;
  const max = data.length ? Math.max(...data) : 0;
  const direction = data.length > 1 && data[data.length - 1] >= data[0] ? "up" : "down";
  const summary = `${label ?? "Balance trend"}: ${formatCurrency(min, { noDecimals: true })} to ${formatCurrency(max, {
    noDecimals: true,
  })}, trending ${direction}`;

  return (
    <div role="img" aria-label={summary} className={className ?? "h-8 w-24"}>
      <span className="sr-only">{summary}</span>
      <ChartContainer config={chartConfig} className="h-full w-full" initialDimension={{ width: 96, height: 32 }}>
        <LineChart data={chartData} margin={{ top: 4, right: 0, bottom: 4, left: 0 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={1.75}
            strokeLinecap="round"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
