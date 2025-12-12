"use client";

import { Bar, BarChart, CartesianGrid, Label, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import {
  leadsBySourceChartConfig,
  leadsBySourceChartData,
  projectRevenueChartConfig,
  projectRevenueChartData,
} from "./crm.config";

export function InsightCards() {
  const totalLeads = leadsBySourceChartData.reduce((acc, curr) => acc + curr.leads, 0);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent className="max-h-48">
          <ChartContainer config={leadsBySourceChartConfig} className="size-full">
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
                data={leadsBySourceChartData}
                dataKey="leads"
                nameKey="source"
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
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground font-bold text-3xl tabular-nums"
                          >
                            {totalLeads.toLocaleString()}
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
                    {leadsBySourceChartData.map((item) => (
                      <li key={item.source} className="flex w-36 items-center justify-between">
                        <span className="flex items-center gap-2 capitalize">
                          <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                          {leadsBySourceChartConfig[item.source].label}
                        </span>
                        <span className="tabular-nums">{item.leads}</span>
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

      <Card className="col-span-1 xl:col-span-3">
        <CardHeader>
          <CardTitle>Project Revenue vs. Target</CardTitle>
        </CardHeader>
        <CardContent className="size-full max-h-52">
          <ChartContainer config={projectRevenueChartConfig} className="size-full">
            <BarChart accessibilityLayer data={projectRevenueChartData} layout="vertical">
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
                  className="fill-primary-foreground text-xs"
                />
                <LabelList
                  dataKey="actual"
                  position="insideRight"
                  offset={8}
                  className="fill-primary-foreground text-xs tabular-nums"
                />
              </Bar>
              <Bar
                stackId="a"
                dataKey="remaining"
                layout="vertical"
                fill="var(--color-remaining)"
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="remaining"
                  position="insideRight"
                  offset={8}
                  className="fill-primary-foreground text-xs tabular-nums"
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
