"use client";

import { useState } from "react";

import { EllipsisVertical } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { RadarChartLabel } from "./radar-chart-label";
import { dataMap } from "./types";

// import BarChartMini from "./BarChartMini";

type Props = {
  data: number[];
  labels: string[];
  barColor?: string;
  height?: string;
};

export default function TabTriggers() {
  const keys = Object.keys(dataMap);
  const defaultTab = keys.length > 0 ? keys[0] : "";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { data, labels } = dataMap[activeTab];

  const chartData = labels.map((label, index) => ({
    name: label, // X-axis label
    value: data[index] ?? 0,
  }));

  const max = Math.max(...chartData.map((d) => d.value));

  const ticks = Array.from({ length: Math.ceil(max / 10) + 1 }, (_, i) => i * 10);

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {/* Bar Chart Section */}
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-4">
        <Card className="flex h-full flex-col">
          {/* Header with title + dropdown */}
          <CardHeader className="pb-2">
            <div className="flex w-full items-start justify-between">
              <div>
                <CardTitle className="text-lg text-gray-900">Earning Reports</CardTitle>
                <p className="text-sm text-gray-400">Yearly Earnings Overview</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                    <EllipsisVertical className="text-muted-foreground h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Last Week</DropdownMenuItem>
                  <DropdownMenuItem>Last Month</DropdownMenuItem>
                  <DropdownMenuItem>Last Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {/* Tabs and chart should be here, outside of CardHeader */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardContent className="pt-0">
              <TabsList className="scrollbar-hide flex h-auto w-full gap-2 overflow-x-auto bg-white p-2">
                {Object.entries(dataMap).map(([key, { label, icon }]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className={`group data-[state=active]:bg-muted flex h-20 w-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dotted border-gray-300 bg-white transition-all data-[state=active]:border-solid data-[state=active]:border-indigo-500 sm:h-20 sm:w-20`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 transition group-data-[state=active]:border-indigo-500 group-data-[state=active]:bg-indigo-100`}
                    >
                      <div className="text-muted-foreground group-data-[state=active]:text-indigo-500">{icon}</div>
                    </div>
                    <span className="text-center text-xs font-medium">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardContent>

            <CardContent className="flex min-h-[260px] items-center justify-center px-4 pt-4 lg:min-h-[300px]">
              {dataMap[activeTab].data.length > 0 && dataMap[activeTab].data.some((v) => v > 0) ? (
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 40, left: 0, bottom: 20 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis
                        domain={[0, max]}
                        ticks={ticks}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`bar-${index}`}
                            fill={entry.value === max ? "#4f46e5" : "#a5b4fc"} // darker for max, lighter for others
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-muted-foreground flex h-[235px] w-full items-center justify-center px-4 py-8 text-center text-sm">
                  No data available
                </div>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
      <div className="col-span-1 flex flex-col sm:col-span-2 lg:col-span-2">
        <RadarChartLabel />
      </div>
    </div>
  );
}
