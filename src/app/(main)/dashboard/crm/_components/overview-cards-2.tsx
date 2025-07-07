"use client";

import { format, subMonths } from "date-fns";
import { Wallet, BadgeDollarSign } from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  XAxis,
  Label,
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  YAxis,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const barChartData = [
  { name: "MVP Development", actual: 82000, target: 90000 },
  { name: "Consultation", actual: 48000, target: 65000 },
  { name: "Framer Sites", actual: 34000, target: 45000 },
  { name: "DevOps Support", actual: 77000, target: 90000 },
  { name: "LLM Training", actual: 68000, target: 80000 },
  { name: "Product Launch", actual: 52000, target: 70000 },
].map((row) => ({
  ...row,
  remaining: Math.max(0, row.target - row.actual),
}));
const barChartConfig = {
  actual: {
    label: "Actual",
    color: "var(--chart-1)",
  },
  target: {
    label: "Target",
    color: "var(--chart-2)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--primary-foreground)",
  },
} satisfies ChartConfig;

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function OverviewCardsV2() {
  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <div className="grid grid-cols-5 gap-4 *:data-[slot=card]:min-h-52 *:data-[slot=card]:shadow-xs">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent className="max-h-48">
          <ChartContainer config={chartConfig} className="size-full">
            <PieChart
              className="m-0"
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                cornerRadius={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                            Leads
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                content={() => (
                  <ul className="ml-8 flex flex-col gap-3">
                    {chartData.map((item) => (
                      <li key={item.browser} className="flex w-36 items-center justify-between">
                        <span className="flex items-center gap-2 capitalize">
                          <span style={{ background: item.fill, width: 10, height: 10, borderRadius: 9999 }} />
                          {item.browser}
                        </span>
                        <span className="tabular-nums">{item.visitors}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" variant="outline" className="basis-1/2">
            View Full Report
          </Button>
          <Button size="sm" variant="outline" className="basis-1/2">
            Download CSV
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Project Revenue vs. Target</CardTitle>
        </CardHeader>
        <CardContent className="size-full max-h-52">
          <ChartContainer config={barChartConfig} className="size-full">
            <BarChart accessibilityLayer data={barChartData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="actual" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar stackId="a" dataKey="actual" layout="vertical" fill="var(--color-actual)">
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-name)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="actual"
                  position="insideRight"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <Bar stackId="a" dataKey="remaining" layout="vertical" fill="var(--chart-2)" radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="remaining"
                  position="insideRight"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">Average progress: 78% · 2 projects above target</p>
        </CardFooter>
      </Card>
    </div>
  );
}
