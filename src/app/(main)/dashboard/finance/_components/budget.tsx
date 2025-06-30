"use client";

import React, { useEffect, useState } from "react";

import { CalendarCheck, FileChartColumn, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const data = [
  {
    label: "Income",
    amount: "$9600K",
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    from: "from-green-100",
    to: "to-green-300",
    labelColor: "text-green-400",
    amountColor: "text-gray-600",
  },
  {
    label: "Expenses",
    amount: "$24000K",
    icon: <TrendingDown className="h-5 w-5 text-orange-500" />,
    from: "from-orange-100",
    to: "to-orange-300",
    labelColor: "text-orange-400",
    amountColor: "text-gray-600",
  },
  {
    label: "Scheduled",
    amount: "$14000K",
    icon: <CalendarCheck className="h-5 w-5 text-gray-500" />,
    from: "from-gray-100",
    to: "to-gray-300",
    labelColor: "text-gray-400",
    amountColor: "text-gray-700",
  },
];
const chartData = [
  { month: "Jan", income: 186, expenses: 80, scheduled: 40 },
  { month: "Feb", income: 305, expenses: 200, scheduled: 100 },
  { month: "Mar", income: 237, expenses: 120, scheduled: 80 },
  { month: "Apr", income: 200, expenses: 190, scheduled: 10 },
  { month: "May", income: 209, expenses: 130, scheduled: 46 },
  { month: "Jun", income: 214, expenses: 140, scheduled: 90 },
];

const chartConfig = {
  income: {
    label: "income",
    color: "#86efac",
  },
  expenses: {
    label: "expenses",
    color: "#fdba74",
  },
  scheduled: {
    label: "scheduled",
    color: "#d1d5db",
  },
};

const Budget: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-10 items-center justify-center rounded-md bg-orange-100">
              <FileChartColumn className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-base font-semibold text-gray-700">Budget Overview</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-gray-500">Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-orange-300" />
                <span className="text-xs text-gray-500">Expenses</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500">Scheduled</span>
              </div>
            </div>

            {/* Dropdown */}
            <Select defaultValue="last-year">
              <SelectTrigger className="h-8 w-[150px] border border-orange-500 bg-none text-sm shadow-none focus:border-orange-500 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="last-6months">Last 6 Months</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <Separator orientation="horizontal" className="w-full" />
      <CardContent className="flex gap-4">
        <div className="flex w-full basis-1/4 flex-col gap-3">
          {data.map((item, i) => (
            <div key={i} className="flex w-full items-center gap-3 rounded-xl bg-white p-4 shadow-md">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-b ${item.from} ${item.to}`}
              >
                {item.icon}
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <span className={`text-xs font-medium ${item.labelColor}`}>{item.label}</span>
                <span className={`text-sm font-semibold ${item.amountColor}`}>{item.amount}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full basis-3/4">
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer height="100%">
              <BarChart data={chartData} barCategoryGap={30} margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  minTickGap={10}
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  interval={0}
                  angle={isMobile ? -35 : 0}
                  tick={{ fontSize: 10 }}
                />

                <Bar dataKey="income" stackId="a" fill={chartConfig.income.color} radius={[0, 0, 0, 0]} barSize={30} />
                <Bar
                  dataKey="expenses"
                  stackId="a"
                  fill={chartConfig.expenses.color}
                  radius={[0, 0, 0, 0]}
                  barSize={30}
                />

                <Bar
                  dataKey="scheduled"
                  stackId="a"
                  fill={chartConfig.scheduled.color}
                  radius={[0, 0, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Budget;
