"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { chartColors, monthlyPnl } from "./data";

const chartConfig = { value: { label: "Realized P&L" } } satisfies ChartConfig;
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});
const chartData = monthlyPnl.map((month) => ({
  ...month,
  fill: month.value >= 0 ? chartColors.up : chartColors.down,
}));

export function MonthlyPnl() {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Monthly P&amp;L</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className="relative min-h-64 flex-1">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 aspect-auto h-full w-full"
            aria-label="Monthly realized profit and loss"
          >
            <BarChart accessibilityLayer data={chartData} margin={{ top: 12, right: 4, left: -12, bottom: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={8}
                interval="preserveStartEnd"
                tickFormatter={(month: string) => month.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                domain={[-1000, 4000]}
                ticks={[-1000, 0, 1000, 2000, 3000, 4000]}
                tickFormatter={(value: number) => `${value < 0 ? "−" : ""}$${Math.abs(value) / 1000}k`}
              />
              <ReferenceLine y={0} stroke="var(--border)" />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    label={label}
                    indicator="dot"
                    className="min-w-44"
                    payload={payload?.map((item) => ({
                      ...item,
                      value: currencyFormatter.format(Number(item.value)),
                    }))}
                  />
                )}
              />
              <Bar dataKey="value" radius={3} maxBarSize={28} isAnimationActive={false} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
