"use client";

import React from "react";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Cell } from "recharts";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { StatType } from "./types";

type MiniChartProps = {
  data: number[];
  labels?: string[];
  height?: string;
  barColor?: string;
};

const BarChartMini: React.FC<MiniChartProps> = ({ data, labels, height = "6rem", barColor = "bg-indigo-500" }) => {
  const chartData = data.map((val, index) => ({
    name: labels?.[index] ?? `#${index + 1}`,
    value: val,
  }));

  const maxValue = Math.max(...data);

  const baseColorMap: Record<string, string> = {
    "bg-indigo-500": "#6366f1",
    "bg-green-500": "#10b981",
  };

  const lightColorMap: Record<string, string> = {
    "bg-green-500": "#a7f3d0", // lighter green
  };

  const fillColor = baseColorMap[barColor] ?? "#6366f1";
  const lightColor = lightColorMap[barColor] ?? fillColor;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap={10} barGap={2}>
          <XAxis dataKey="name" tick={labels ? { fontSize: 10 } : false} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={8} fill={fillColor}>
            {barColor === "bg-green-500" &&
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value === maxValue ? fillColor : lightColor} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineChartMini: React.FC<{ data: number[]; labels?: string[] }> = ({ data, labels }) => {
  const chartData = data.map((val, index) => ({
    name: labels?.[index] ?? `#${index + 1}`,
    value: val,
  }));

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <XAxis dataKey="name" tick={labels ? { fontSize: 10 } : false} axisLine={!!labels} tickLine={!!labels} />

          <YAxis hide />
          {/* <Tooltip /> */}
          <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#lineGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatCard: React.FC<StatType> = ({
  icon,
  title,
  subtitle,
  value,
  change,
  changeType,
  chart,
  chartGraph = "bar",
}) => {
  const renderChart = () => {
    if (!chart || !chart.data || chart.data.length === 0) return null;

    const graphType = chartGraph?.toLowerCase?.() ?? "bar";
    const chartHeight = title === "Revenue Growth" ? "10rem" : "8rem";
    const barColor = title === "Revenue Growth" ? "bg-green-500" : "bg-indigo-500";

    return graphType === "line" ? (
      <LineChartMini data={chart.data} labels={chart.labels} />
    ) : (
      <BarChartMini data={chart.data} labels={chart.labels} height={chartHeight} barColor={barColor} />
    );
  };

  if (!icon && title !== "Revenue Growth") {
    return (
      <Card className="flex h-full w-full flex-col justify-center">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
          {renderChart()}
          <div className="flex items-center justify-between">
            <p className="text-card-foreground text-lg font-semibold">{value}</p>
            <span
              className={`inline-block w-fit rounded py-0.5 text-sm font-medium ${
                changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (title === "Revenue Growth") {
    return (
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-end justify-between gap-2 sm:flex-row">
          {/* Left: Textual Content */}
          <div className="flex w-full flex-col justify-end sm:w-auto">
            <div className="flex flex-col gap-1">
              <p className="text-card-foreground text-xl font-semibold">{value}</p>
              <span
                className={`w-fit rounded py-0.5 text-sm font-medium ${
                  changeType === "positive" ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          </div>

          {/* Right: Chart */}
          <div className="flex w-full items-end justify-end sm:w-[50%]">
            <div className="h-32 w-full max-w-[160px] sm:h-40">{renderChart()}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full w-full flex-col">
      <CardContent className="flex flex-col items-start justify-center gap-2">
        <div
          className={`mb-2 inline-flex items-center justify-center rounded-md p-2 ${
            changeType === "positive" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {icon}
        </div>
        <p className="text-card-foreground text-lg font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
        <div className="flex flex-col items-start gap-2">
          <p className="text-md text-card-foreground">{value}</p>
          <span
            className={`inline-block w-fit rounded py-0.5 text-sm font-medium ${
              changeType === "positive" ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600"
            }`}
          >
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
