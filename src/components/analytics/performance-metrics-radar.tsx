"use client";

import * as React from "react";

import { ArrowUpRight, BarChart4, Download, InfoIcon } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data for the radar chart
const performanceMetrics = {
  current: [
    { metric: "Page Load Time", value: 85, fullMark: 100, unit: "ms", change: 12 },
    { metric: "Time to Interactive", value: 78, fullMark: 100, unit: "ms", change: 8 },
    { metric: "First Contentful Paint", value: 92, fullMark: 100, unit: "ms", change: 15 },
    { metric: "Largest Contentful Paint", value: 75, fullMark: 100, unit: "ms", change: 5 },
    { metric: "Cumulative Layout Shift", value: 88, fullMark: 100, unit: "score", change: -3 },
    { metric: "First Input Delay", value: 95, fullMark: 100, unit: "ms", change: 20 },
  ],
  previous: [
    { metric: "Page Load Time", value: 73, fullMark: 100, unit: "ms", change: 0 },
    { metric: "Time to Interactive", value: 70, fullMark: 100, unit: "ms", change: 0 },
    { metric: "First Contentful Paint", value: 77, fullMark: 100, unit: "ms", change: 0 },
    { metric: "Largest Contentful Paint", value: 70, fullMark: 100, unit: "ms", change: 0 },
    { metric: "Cumulative Layout Shift", value: 91, fullMark: 100, unit: "score", change: 0 },
    { metric: "First Input Delay", value: 75, fullMark: 100, unit: "ms", change: 0 },
  ],
};

// Calculate overall score
const calculateOverallScore = (metrics: typeof performanceMetrics.current) => {
  return Math.round(metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length);
};

const currentScore = calculateOverallScore(performanceMetrics.current);
const previousScore = calculateOverallScore(performanceMetrics.previous);
const scoreChange = currentScore - previousScore;

// Chart configuration
const chartConfig = {
  current: {
    label: "Current",
    color: "var(--chart-1)",
  },
  previous: {
    label: "Previous",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// Define metric descriptions for tooltips
const metricDescriptions = {
  "Page Load Time": "The total time it takes for a page to load completely.",
  "Time to Interactive": "The time it takes for a page to become fully interactive.",
  "First Contentful Paint": "The time when the first content is painted on the screen.",
  "Largest Contentful Paint": "The time when the largest content element is visible.",
  "Cumulative Layout Shift": "Measures visual stability by quantifying unexpected layout shifts.",
  "First Input Delay": "The time from when a user first interacts to when the browser responds.",
};

export function PerformanceMetricsRadar() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [compareWith, setCompareWith] = React.useState("previous");
  const [viewType, setViewType] = React.useState("radar");

  // Format the data for the radar chart
  const radarData = performanceMetrics.current.map((item, index) => ({
    subject: item.metric,
    current: item.value,
    previous: performanceMetrics.previous[index].value,
    fullMark: item.fullMark,
  }));

  return (
    <Card className="@container/radar">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <BarChart4 className="size-4" />
          Performance Metrics
        </CardTitle>
        <CardDescription className="text-xs">Core Web Vitals and performance scores</CardDescription>
        <CardAction className="flex gap-1.5">
          <Select value={compareWith} onValueChange={setCompareWith}>
            <SelectTrigger className="h-7 w-[120px] text-xs" size="sm">
              <SelectValue placeholder="Compare with" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Previous Period</SelectItem>
              <SelectItem value="baseline">Baseline</SelectItem>
              <SelectItem value="industry">Industry Average</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-7 w-[100px] text-xs" size="sm">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="radar" className="w-full" onValueChange={setViewType}>
          <div className="mb-2 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="radar" className="px-3 py-1 text-xs">
                Radar View
              </TabsTrigger>
              <TabsTrigger value="table" className="px-3 py-1 text-xs">
                Table View
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Download className="mr-1.5 size-3.5" />
              Export
            </Button>
          </div>

          <TabsContent value="radar" className="mt-0">
            <div className="grid grid-cols-1 gap-3 @lg/radar:grid-cols-[1fr_250px]">
              <div className="order-2 @lg/radar:order-1">
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fontSize: 10,
                          fill: "var(--muted-foreground)",
                          fontWeight: 500,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                        stroke="var(--border)"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Radar
                        name="previous"
                        dataKey="previous"
                        stroke={chartConfig.previous.color}
                        fill={chartConfig.previous.color}
                        fillOpacity={0.1}
                      />
                      <Radar
                        name="current"
                        dataKey="current"
                        stroke={chartConfig.current.color}
                        fill={chartConfig.current.color}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="order-1 flex flex-col gap-2 @lg/radar:order-2">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Overall Score</div>
                    <Badge variant={scoreChange >= 0 ? "default" : "destructive"} className="px-1.5 py-0 text-[10px]">
                      {scoreChange >= 0 ? "+" : ""}
                      {scoreChange}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xl font-bold">{currentScore}</div>
                  <div className="text-muted-foreground mt-0.5 text-[10px]">out of 100</div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: chartConfig.current.color }} />
                      <span>Current</span>
                    </div>
                    <span className="font-medium">{currentScore}</span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: chartConfig.previous.color }} />
                      <span>Previous</span>
                    </div>
                    <span className="font-medium">{previousScore}</span>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium">Performance Insights</div>
                  <ul className="mt-1.5 space-y-1.5 text-xs">
                    <li className="flex items-center gap-1.5">
                      <ArrowUpRight className="text-primary size-3.5" />
                      First Input Delay improved by 20%
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ArrowUpRight className="text-primary size-3.5" />
                      First Contentful Paint improved by 15%
                    </li>
                    <li className="text-destructive flex items-center gap-1.5">
                      <InfoIcon className="size-3.5" />
                      Cumulative Layout Shift decreased by 3%
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-3 py-2 text-left text-xs font-medium">Metric</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Current</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Previous</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceMetrics.current.map((metric, index) => {
                    const previous = performanceMetrics.previous[index];
                    const change = metric.value - previous.value;

                    return (
                      <tr key={metric.metric} className="border-b">
                        <td className="px-3 py-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1 text-xs font-medium">
                                {metric.metric}
                                <InfoIcon className="text-muted-foreground size-3" />
                              </TooltipTrigger>
                              <TooltipContent className="px-2 py-1 text-[10px]">
                                <p className="max-w-xs">
                                  {metricDescriptions[metric.metric as keyof typeof metricDescriptions]}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-3 py-2 text-xs font-medium tabular-nums">{metric.value}</td>
                        <td className="text-muted-foreground px-3 py-2 text-xs tabular-nums">{previous.value}</td>
                        <td className="px-3 py-2">
                          <Badge
                            variant={change >= 0 ? "default" : "destructive"}
                            className="px-1.5 py-0 font-mono text-[10px]"
                          >
                            {change >= 0 ? "+" : ""}
                            {change}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 border-t">
                    <td className="px-3 py-2 text-xs font-medium">Overall Score</td>
                    <td className="px-3 py-2 text-xs font-medium tabular-nums">{currentScore}</td>
                    <td className="text-muted-foreground px-3 py-2 text-xs tabular-nums">{previousScore}</td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={scoreChange >= 0 ? "default" : "destructive"}
                        className="px-1.5 py-0 font-mono text-[10px]"
                      >
                        {scoreChange >= 0 ? "+" : ""}
                        {scoreChange}
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
