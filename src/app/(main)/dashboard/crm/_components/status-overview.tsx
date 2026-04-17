"use client";

import * as React from "react";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";

const statusMetrics = [
  {
    id: "active-leads",
    title: "Active Leads",
    value: "84",
    change: "+12",
    changeType: "positive" as const,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
    progress: 72,
    description: "Leads in active stages",
  },
  {
    id: "at-risk",
    title: "At Risk Deals",
    value: "11",
    change: "-3",
    changeType: "negative" as const,
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    progress: 15,
    description: "Stalled > 14 days",
  },
  {
    id: "closing-this-week",
    title: "Closing This Week",
    value: "7",
    change: "+2",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    progress: 85,
    description: "Expected to close",
    valuePrefix: "$",
    valueSuffix: "K",
    numericValue: 245,
  },
  {
    id: "missed-opportunities",
    title: "Missed Opportunities",
    value: "3",
    change: "-1",
    changeType: "positive" as const,
    icon: XCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    progress: 5,
    description: "Lost this period",
  },
];

const pipelineStages = [
  {
    stage: "New Leads",
    count: 32,
    value: 480000,
    status: "healthy" as const,
    trend: "up" as const,
    trendValue: "+8%",
  },
  {
    stage: "Qualified",
    count: 24,
    value: 360000,
    status: "healthy" as const,
    trend: "up" as const,
    trendValue: "+5%",
  },
  {
    stage: "Proposal Sent",
    count: 15,
    value: 225000,
    status: "warning" as const,
    trend: "down" as const,
    trendValue: "-3%",
  },
  {
    stage: "Negotiation",
    count: 8,
    value: 120000,
    status: "at-risk" as const,
    trend: "down" as const,
    trendValue: "-12%",
  },
  {
    stage: "Closed Won",
    count: 5,
    value: 75000,
    status: "healthy" as const,
    trend: "up" as const,
    trendValue: "+15%",
  },
];

export function StatusOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statusMetrics.map((metric) => (
            <StatusCard key={metric.id} metric={metric} />
          ))}
        </div>
        <PipelineHealthCard />
      </div>
      <div className="space-y-4">
        <QuickStatsCard />
        <ActivitySummaryCard />
      </div>
    </div>
  );
}

function StatusCard({ metric }: { metric: (typeof statusMetrics)[0] }) {
  return (
    <Card className="shadow-xs overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className={cn("rounded-lg p-2", metric.bgColor)}>
          <metric.icon className={cn("size-5", metric.color)} />
        </div>
        <div className="flex-1">
          <CardDescription className="text-xs">{metric.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-semibold text-3xl tabular-nums">
              {metric.numericValue !== undefined
                ? `${metric.valuePrefix}${metric.numericValue}${metric.valueSuffix}`
                : metric.value}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              metric.changeType === "positive" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
            )}
          >
            {metric.changeType === "positive" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {metric.change}
          </div>
        </div>
        <div className="mt-3">
          <Progress value={metric.progress} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineHealthCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pipeline Health</CardTitle>
            <CardDescription>Stage distribution and momentum</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipelineStages.map((stage, index) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stage.stage}</span>
                  <Badge variant="outline" className="text-[10px] h-4">
                    {stage.count}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(stage.value, { noDecimals: true })}
                  </span>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      stage.trend === "up" ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {stage.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {stage.trendValue}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={((index + 1) / pipelineStages.length) * 100}
                  className={cn(
                    "h-2",
                    stage.status === "at-risk"
                      ? "bg-destructive/20 [&>div]:bg-destructive"
                      : stage.status === "warning"
                        ? "bg-yellow-500/20 [&>div]:bg-yellow-500"
                        : "bg-primary/20 [&>div]:bg-primary",
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStatsCard() {
  const quickStats = [
    {
      label: "Conversion Rate",
      value: "12.4%",
      trend: "up",
      trendValue: "+2.1%",
    },
    {
      label: "Avg Deal Size",
      value: "$15.2K",
      trend: "up",
      trendValue: "+$1.8K",
    },
    {
      label: "Sales Cycle",
      value: "28 days",
      trend: "down",
      trendValue: "-3 days",
    },
    {
      label: "Lead Response",
      value: "4.2 hours",
      trend: "up",
      trendValue: "-1.1h",
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Stats</CardTitle>
        <CardDescription>Key performance indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{stat.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tabular-nums">{stat.value}</span>
              <Badge
                variant="outline"
                className={cn(
                  "h-4 text-[10px]",
                  stat.trend === "up"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20",
                )}
              >
                {stat.trendValue}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ActivitySummaryCard() {
  const activities = [
    { type: "call", title: "Demo with Vercel", time: "2h ago", status: "completed" },
    { type: "email", title: "Proposal sent to OpenAI", time: "4h ago", status: "completed" },
    { type: "meeting", title: "QBR with Shadcn", time: "Tomorrow 10AM", status: "upcoming" },
    { type: "followup", title: "Follow up on Astro deal", time: "Today 3PM", status: "overdue" },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest updates and tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50",
              activity.status === "overdue" && "border-destructive/30 bg-destructive/5",
              activity.status === "upcoming" && "border-primary/30 bg-primary/5",
            )}
          >
            <div
              className={cn(
                "mt-1 rounded-full p-1.5",
                activity.status === "overdue"
                  ? "bg-destructive/10"
                  : activity.status === "upcoming"
                    ? "bg-primary/10"
                    : "bg-green-500/10",
              )}
            >
              {activity.status === "completed" ? (
                <CheckCircle className="size-3 text-green-500" />
              ) : activity.status === "overdue" ? (
                <AlertCircle className="size-3 text-destructive" />
              ) : (
                <Clock className="size-3 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.title}</p>
              <p className="text-muted-foreground text-xs">{activity.time}</p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "h-4 text-[10px]",
                activity.status === "overdue" && "bg-destructive/10 text-destructive border-destructive/20",
                activity.status === "upcoming" && "bg-primary/10 text-primary border-primary/20",
                activity.status === "completed" && "bg-green-500/10 text-green-500 border-green-500/20",
              )}
            >
              {activity.status}
            </Badge>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full text-primary">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
}
