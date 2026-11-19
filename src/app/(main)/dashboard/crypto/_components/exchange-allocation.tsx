"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { exchangeAllocations, portfolioBalanceUsd } from "./data";

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const chartConfig = Object.fromEntries(
  exchangeAllocations.map((exchange) => [exchange.key, { label: exchange.name, color: exchange.fill }]),
) satisfies ChartConfig;

export function ExchangeAllocation() {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Exchange allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-48 w-full max-w-56"
          aria-label="Portfolio share by exchange"
        >
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  className="min-w-40"
                  nameKey="key"
                  hideLabel
                  indicator="dot"
                  payload={payload?.map((item) => ({
                    ...item,
                    value: currencyFormatter.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Pie
              data={exchangeAllocations}
              dataKey="valueUsd"
              nameKey="key"
              innerRadius="52%"
              outerRadius="94%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={3}
              cornerRadius={5}
              stroke="none"
              labelLine={false}
              isAnimationActive={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                const exchange = exchangeAllocations[index];
                const radius = (Number(innerRadius) + Number(outerRadius)) / 2;
                const angle = (-Number(midAngle) * Math.PI) / 180;
                return (
                  <text
                    x={Number(cx) + radius * Math.cos(angle)}
                    y={Number(cy) + radius * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={exchange.textColor}
                    className="pointer-events-none text-xs font-medium tabular-nums"
                  >
                    {Math.round((exchange.valueUsd / portfolioBalanceUsd) * 100)}%
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3" aria-label="Exchange balances">
          {exchangeAllocations.map((exchange) => (
            <li key={exchange.key} className="flex min-w-0 items-start gap-2">
              <span
                className="mt-1 size-2 shrink-0 rounded-sm"
                style={{ backgroundColor: exchange.fill }}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-muted-foreground text-xs">{exchange.name}</span>
                <span className="text-sm tabular-nums">{currencyFormatter.format(exchange.valueUsd)}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
