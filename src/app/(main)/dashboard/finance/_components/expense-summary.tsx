"use client";

import { Ellipsis, ShoppingBasket, TramFront } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const chartData = [{ period: "last-week", groceries: 380, transport: 120, other: 80 }];

const chartConfig = {
  groceries: {
    label: "Groceries",
    color: "var(--chart-1)",
  },
  transport: {
    label: "Transport",
    color: "var(--chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ExpenseSummary() {
  const totalExpenses = chartData.length ? chartData[0].groceries + chartData[0].transport + chartData[0].other : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />

        <div className="h-32">
          <ChartContainer config={chartConfig}>
            <RadialBarChart
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 16}
                            className="fill-foreground font-bold text-2xl tabular-nums"
                          >
                            {formatCurrency(totalExpenses, { noDecimals: true })}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 4} className="fill-muted-foreground">
                            Spent
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="other"
                stackId="a"
                cornerRadius={4}
                fill="var(--color-other)"
                className="stroke-4 stroke-card"
              />
              <RadialBar
                dataKey="transport"
                stackId="a"
                cornerRadius={4}
                fill="var(--color-transport)"
                className="stroke-4 stroke-card"
              />
              <RadialBar
                dataKey="groceries"
                stackId="a"
                cornerRadius={4}
                fill="var(--color-groceries)"
                className="stroke-4 stroke-card"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
        <Separator />
        <div className="flex justify-between gap-4">
          <div className="flex flex-1 flex-col items-center space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <ShoppingBasket className="size-5 stroke-chart-1" />
            </div>
            <div className="space-y-0.5 text-center">
              <p className="text-muted-foreground text-xs uppercase">Groceries</p>
              <p className="font-medium tabular-nums">{formatCurrency(chartData[0].groceries, { noDecimals: true })}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto!" />
          <div className="flex flex-1 flex-col items-center space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <TramFront className="size-5 stroke-chart-2" />
            </div>
            <div className="space-y-0.5 text-center">
              <p className="text-muted-foreground text-xs uppercase">Transport</p>
              <p className="font-medium tabular-nums">{formatCurrency(chartData[0].transport, { noDecimals: true })}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto!" />
          <div className="flex flex-1 flex-col items-center space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Ellipsis className="size-5 stroke-chart-3" />
            </div>
            <div className="space-y-0.5 text-center">
              <p className="text-muted-foreground text-xs uppercase">Other</p>
              <p className="font-medium tabular-nums">{formatCurrency(chartData[0].other, { noDecimals: true })}</p>
            </div>
          </div>
        </div>
        <span className="text-muted-foreground text-xs tabular-nums">
          Weekly spending is capped at {formatCurrency(2000, { noDecimals: true })}
        </span>
      </CardContent>
    </Card>
  );
}
