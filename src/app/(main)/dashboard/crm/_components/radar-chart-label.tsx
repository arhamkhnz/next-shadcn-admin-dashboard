"use client";

import { useState } from "react";

import { EllipsisVertical, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// export const description = "A radar chart with a custom label"

const chartData = [
  { month: "Jan", sales: 320, visits: 150 },
  { month: "Feb", sales: 205, visits: 320 },
  { month: "Mar", sales: 237, visits: 220 },
  { month: "Apr", sales: 273, visits: 390 },
  { month: "May", sales: 309, visits: 130 },
  { month: "Jun", sales: 214, visits: 140 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#4f46e5",
  },
  visits: {
    label: "Visits",
    color: "#00bcd4",
  },
} satisfies ChartConfig;

export function RadarChartLabel() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle>Sales</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                <EllipsisVertical className="text-muted-foreground h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last Month</DropdownMenuItem>
              <DropdownMenuItem>Last 6months</DropdownMenuItem>
              <DropdownMenuItem>Last Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            /> */}
            <PolarAngleAxis
              dataKey="month"
              tick={({ x, y, textAnchor, value, index, ...props }) => {
                const data = chartData[index];

                return (
                  <text
                    x={x}
                    y={index === 0 ? y - 10 : y}
                    textAnchor={textAnchor}
                    fontSize={13}
                    fontWeight={500}
                    {...props}
                  >
                    <tspan x={x} dy={"1rem"} fontSize={12} className="fill-muted-foreground">
                      {data.month}
                    </tspan>
                  </text>
                );
              }}
            />

            <PolarGrid />
            <Radar
              dataKey="sales"
              fill="#4f46e5"
              // stroke="bg-indigo-600"
              strokeWidth={2}
              fillOpacity={activeKey === null || activeKey === "sales" ? 0.6 : 0.1}
              isAnimationActive={false}
            />
            <Radar
              dataKey="visits"
              fill="#00bcd4"
              // stroke="#00bcd4"
              strokeWidth={2}
              fillOpacity={activeKey === null || activeKey === "visits" ? 0.6 : 0.1}
              isAnimationActive={false}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 text-sm">
        <div
          onMouseEnter={() => setActiveKey("sales")}
          onMouseLeave={() => setActiveKey(null)}
          className="flex cursor-pointer items-center gap-2"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
          <span className="text-muted-foreground font-medium">Sales</span>
        </div>

        <div
          onMouseEnter={() => setActiveKey("visits")}
          onMouseLeave={() => setActiveKey(null)}
          className="flex cursor-pointer items-center gap-2"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
          <span className="text-muted-foreground font-medium">Visits</span>
        </div>
      </CardFooter>
    </Card>
  );
}
