"use client";

import * as React from "react";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceArea, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { buildEcommerceSnapshot, getPresetDateRange } from "./ecommerce.config";

const chartConfig = {
  sales: {
    label: "Net sales",
    color: "var(--chart-2)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-4)",
  },
  promo: {
    label: "Promo window",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function EcommerceSalesActions() {
  const snapshot = buildEcommerceSnapshot({
    dateRange: getPresetDateRange("30d"),
    comparisonMode: "previous-period",
  });

  return <SalesTrendCard snapshot={snapshot} />;
}

function SalesTrendCard({ snapshot }: { snapshot: ReturnType<typeof buildEcommerceSnapshot> }) {
  const promoPatternId = React.useId().replace(/:/g, "");
  const ordersGradientId = React.useId().replace(/:/g, "");
  const chartData = snapshot.tradingSeries;
  const promoRanges = getPromoRanges(chartData);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Trading Pulse</CardTitle>
        <CardDescription>Net sales, order volume, and key trading events.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ComposedChart accessibilityLayer data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={ordersGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orders)" stopOpacity="0.08" />
                <stop offset="95%" stopColor="var(--color-orders)" stopOpacity="0" />
              </linearGradient>
              <PromoPatternDef id={promoPatternId} />
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.35} />
            <XAxis dataKey="dayLabel" tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
            <YAxis
              yAxisId="sales"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={72}
              tickFormatter={(value) => formatShortCurrency(value)}
            />
            <YAxis yAxisId="orders" orientation="right" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            {promoRanges.map((range) => (
              <ReferenceArea
                key={`${range.start}-${range.end}`}
                x1={range.start}
                x2={range.end}
                yAxisId="sales"
                fill={`url(#${promoPatternId})`}
                stroke="var(--color-promo)"
                strokeOpacity={0.1}
              />
            ))}
            <ReferenceLine
              yAxisId="sales"
              x={snapshot.anomaly.label}
              stroke="#B45309"
              strokeDasharray="4 4"
              label={{
                value: "Anomaly",
                position: "insideTopLeft",
                fill: "#B45309",
                fontSize: 11,
              }}
            />
            <Area
              yAxisId="orders"
              type="step"
              dataKey="orders"
              name="Orders"
              fill={`url(#${ordersGradientId})`}
              stroke="var(--color-orders)"
              strokeWidth={2}
              activeDot={false}
            />
            <Line
              yAxisId="sales"
              type="natural"
              dataKey="netSales"
              name="Net sales"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>

        <div className="grid gap-1 rounded-lg border p-4">
          <p className="font-medium text-sm">{snapshot.anomaly.title}</p>
          <p className="text-muted-foreground text-sm">{snapshot.anomaly.detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PromoPatternDef({ id }: { id: string }) {
  return (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-promo)" strokeWidth="1.5" strokeOpacity="0.5" />
    </pattern>
  );
}

function formatShortCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getPromoRanges(
  series: Array<{
    dayLabel: string;
    netSales: number;
    targetSales: number;
  }>,
) {
  const ranges: Array<{ start: string; end: string }> = [];

  series.forEach((point, index) => {
    const isPromoDay = point.targetSales / point.netSales > 1.055;

    if (!isPromoDay) {
      return;
    }

    const lastRange = ranges.at(-1);

    if (!lastRange) {
      ranges.push({ start: point.dayLabel, end: point.dayLabel });
      return;
    }

    const previousPoint = series[index - 1];

    if (previousPoint?.dayLabel === lastRange.end) {
      lastRange.end = point.dayLabel;
      return;
    }

    ranges.push({ start: point.dayLabel, end: point.dayLabel });
  });

  return ranges;
}
