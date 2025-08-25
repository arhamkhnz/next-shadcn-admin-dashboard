"use client";

import { useMemo } from "react";

import { useTheme } from "next-themes";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface FranchiseAnalyticsChartProps<T> {
  data: T[];
  dataKey: string;
  title: string;
  color: string;
  type?: "area" | "bar";
}

export function FranchiseAnalyticsChart<T extends Record<string, any>>({
  data,
  dataKey,
  title,
  color,
  type = "area",
}: FranchiseAnalyticsChartProps<T>) {
  const { theme } = useTheme();

  // Get the first key that's not the dataKey to use as the x-axis
  const xAxisKey = useMemo(() => {
    const keys = Object.keys(data[0] || {});
    return keys.find((key) => key !== dataKey) ?? "name";
  }, [data, dataKey]);

  // Format the data for the chart
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      [dataKey]: Number(item[dataKey]),
    }));
  }, [data, dataKey]);

  if (data.length === 0) {
    return <div className="text-muted-foreground flex h-[250px] items-center justify-center">No data available</div>;
  }

  const chartColors =
    theme === "dark"
      ? {
          fill: `${color}cc`, // Add opacity for dark mode
          stroke: color,
        }
      : {
          fill: color,
          stroke: color,
        };

  return (
    <ChartContainer
      config={{
        [dataKey]: {
          label: title,
          color: chartColors.fill,
        },
      }}
      className="h-[250px] w-full"
    >
      {type === "area" ? (
        <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`fill${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.fill} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.fill} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              // Format dates
              if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }
              // Truncate long names
              if (typeof value === "string" && value.length > 15) {
                return value.substring(0, 15) + "...";
              }
              return value;
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            tickFormatter={(value) => {
              // Format large numbers
              if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
              }
              return value;
            }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={chartColors.stroke}
            fill={`url(#fill${title})`}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      ) : (
        <BarChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              // Format dates
              if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }
              // Truncate long names
              if (typeof value === "string" && value.length > 15) {
                return value.substring(0, 15) + "...";
              }
              return value;
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            tickFormatter={(value) => {
              // Format large numbers
              if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
              }
              return value;
            }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey={dataKey} fill={chartColors.fill} radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ChartContainer>
  );
}
