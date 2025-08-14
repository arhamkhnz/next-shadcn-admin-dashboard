"use client";
import React from "react";

import { useTheme } from "next-themes";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface FranchiseBookingsChartProps {
  data: { date: string; count: number }[];
}

const FranchiseBookingsChart: React.FC<FranchiseBookingsChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const areaColors =
    theme === "dark"
      ? {
          fill: "#5eead4cc", // Bright teal with opacity for dark mode
          stroke: "#5eead4", // Bright teal for dark mode
        }
      : {
          fill: "hsl(var(--chart-1))",
          stroke: "hsl(var(--chart-1))",
        };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Bookings</CardTitle>
        <CardDescription>Recent booking trends for your franchise.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Bookings",
              color: areaColors.fill,
            },
          }}
          className="h-[250px] w-full"
        >
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillChart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColors.fill} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaColors.fill} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={areaColors.stroke}
              fill="url(#fillChart)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FranchiseBookingsChart;
