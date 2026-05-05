"use client";

import { Area, Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

import { channelMix, tradingPulseData } from "./data";

const chartConfig = {
  netSales: {
    label: "Net sales",
    color: "var(--chart-1)",
  },
  targetSales: {
    label: "Target",
    color: "var(--chart-3)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TradingPulseCard() {
  const totalSales = tradingPulseData.reduce((total, day) => total + day.netSales, 0);
  const totalOrders = tradingPulseData.reduce((total, day) => total + day.orders, 0);

  return (
    <Card className="@container/card shadow-xs">
      <CardHeader>
        <CardTitle className="leading-none">Trading Pulse</CardTitle>
        <CardDescription>Daily sales, order volume, and target pace.</CardDescription>
        <CardAction>
          <Badge variant="outline" className="font-medium tabular-nums">
            {formatCurrency(totalSales / totalOrders, { maximumFractionDigits: 2 })} AOV
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <ChartContainer className="aspect-auto h-80 w-full" config={chartConfig}>
            <ComposedChart
              accessibilityLayer
              data={tradingPulseData}
              margin={{ top: 0, right: 0, bottom: 0, left: -12 }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis
                yAxisId="sales"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Bar yAxisId="orders" dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
              <Area
                yAxisId="sales"
                dataKey="netSales"
                type="natural"
                fill="var(--color-netSales)"
                fillOpacity={0.16}
                stroke="var(--color-netSales)"
                strokeWidth={2}
              />
              <Line
                yAxisId="sales"
                dataKey="targetSales"
                type="natural"
                stroke="var(--color-targetSales)"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>

          <div className="grid content-start gap-3 rounded-lg border bg-muted/15 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-muted-foreground text-xs">Range sales</div>
                <div className="font-semibold text-xl tabular-nums">
                  {formatCurrency(totalSales, { noDecimals: true })}
                </div>
              </div>
              <Badge variant="secondary" className="font-medium tabular-nums">
                +12.4%
              </Badge>
            </div>

            <div className="space-y-3">
              {channelMix.map((channel) => (
                <div key={channel.channel} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{channel.channel}</span>
                    <span className="text-muted-foreground tabular-nums">{channel.share}%</span>
                  </div>
                  <Progress value={channel.share} />
                  <div className="flex items-center justify-between gap-3 text-muted-foreground text-xs">
                    <span>{formatCurrency(channel.revenue, { noDecimals: true })}</span>
                    <span className="tabular-nums">{channel.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
