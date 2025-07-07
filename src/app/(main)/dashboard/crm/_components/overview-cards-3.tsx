"use client";

import { Clock } from "lucide-react";
import { FunnelChart, Funnel, LabelList } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";

// Add this array above your component:
const actionItems = [
  {
    title: "Send kickoff docs",
    desc: "Send onboarding documents and timeline",
    due: "Due today",
    priority: "High",
    priorityColor: "bg-red-100 text-red-700",
    checked: false,
  },
  {
    title: "Demo call for SaaS MVP",
    desc: "Book Zoom call with client",
    due: "Due tomorrow",
    priority: "Medium",
    priorityColor: "bg-yellow-100 text-yellow-700",
    checked: false,
  },
  {
    title: "Update case study",
    desc: "Add latest LLM project",
    due: "Due this week",
    priority: "Low",
    priorityColor: "bg-green-100 text-green-700",
    checked: false,
  },
];
const regionData = [
  {
    region: "North America",
    sales: 37800,
    percentage: 31,
    growth: "-3.2%",
    isPositive: false,
  },
  {
    region: "Europe",
    sales: 40100,
    percentage: 34,
    growth: "+9.4%",
    isPositive: true,
  },
  {
    region: "Asia Pacific",
    sales: 30950,
    percentage: 26,
    growth: "+12.8%",
    isPositive: true,
  },
  {
    region: "Latin America",
    sales: 12200,
    percentage: 7,
    growth: "-1.7%",
    isPositive: false,
  },
  {
    region: "Middle East & Africa",
    sales: 2450,
    percentage: 2,
    growth: "+6.0%",
    isPositive: true,
  },
];

const funnelData = [
  { stage: "Leads", value: 1126, fill: "var(--chart-1)" },
  { stage: "Contacted", value: 760, fill: "var(--chart-2)" },
  { stage: "Qualified", value: 480, fill: "var(--chart-3)" },
  { stage: "Proposal Sent", value: 210, fill: "var(--chart-4)" },
  { stage: "Negotiation", value: 120, fill: "var(--chart-5)" },
  { stage: "Won", value: 45, fill: "var(--chart-6)" },
];

const funnelChartConfig = {
  value: {
    label: "Leads",
    color: "var(--chart-1)",
  },
  stage: {
    label: "Stage",
  },
};

export function OverviewCardsV3() {
  const totalSales = regionData.reduce((sum, region) => sum + region.sales, 0);
  return (
    <div className="grid grid-cols-3 gap-4 *:data-[slot=card]:min-h-52 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="size-full">
          <ChartContainer config={funnelChartConfig} className="size-full">
            <FunnelChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <Funnel className="stroke-card stroke-2" dataKey="value" data={funnelData}>
                <LabelList className="stroke-0" dataKey="stage" position="right" offset={10} />
                <LabelList className="stroke-0" dataKey="value" position="left" offset={10} />
              </Funnel>
            </FunnelChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">Leads increased by 18.2% since last month.</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Region</CardTitle>
          <CardDescription className="font-medium tabular-nums">{formatCurrency(totalSales)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {regionData.map((region) => (
              <div key={region.region} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold tabular-nums">{formatCurrency(region.sales)}</span>
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        region.isPositive ? "text-green-500" : "text-destructive",
                      )}
                    >
                      {region.growth}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={region.percentage} />
                  <span className="text-muted-foreground text-xs font-medium tabular-nums">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground flex justify-between gap-1 text-xs">
            <span>{regionData.length} regions tracked</span>
            <span>•</span>
            <span>{regionData.filter((r) => r.isPositive).length} regions growing</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {actionItems.map((item, i) => (
              <li key={i} className="space-y-2 rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked={item.checked} />
                  <span className="text-sm font-medium">{item.title}</span>
                  <span
                    className={cn(
                      "w-fit rounded-md px-2 py-1 text-xs font-medium",
                      item.priority === "High" && "text-destructive bg-destructive/20",
                      item.priority === "Medium" && "bg-yellow-500/20 text-yellow-500",
                      item.priority === "Low" && "bg-green-500/20 text-green-500",
                    )}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs font-medium">{item.desc}</div>
                <div className="flex items-center gap-1">
                  <Clock className="text-muted-foreground size-3" />
                  <span className="text-muted-foreground text-xs font-medium">{item.due}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
