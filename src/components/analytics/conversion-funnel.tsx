"use client";

import * as React from "react";

import { ArrowRight, ChevronDown, ChevronUp, Filter, LineChart, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatCurrency } from "@/lib/utils";

// Mock data for the conversion funnel
const funnelStages = [
  {
    id: "visitors",
    label: "Visitors",
    count: 12450,
    percentage: 100,
    change: 8.5,
    color: "var(--chart-1)",
  },
  {
    id: "product_views",
    label: "Product Views",
    count: 8320,
    percentage: 66.8,
    change: 12.3,
    color: "var(--chart-2)",
  },
  {
    id: "add_to_cart",
    label: "Add to Cart",
    count: 4150,
    percentage: 33.3,
    change: -2.7,
    color: "var(--chart-3)",
  },
];

// Calculate conversion rates between stages
const conversionRates = funnelStages.slice(1).map((stage, index) => {
  const previousStage = funnelStages[index];
  const conversionRate = (stage.count / previousStage.count) * 100;

  return {
    fromStage: previousStage.id,
    toStage: stage.id,
    fromLabel: previousStage.label,
    toLabel: stage.label,
    rate: conversionRate,
    change: stage.change - previousStage.change,
  };
});

// Calculate revenue metrics
const averageOrderValue = 85.42;
const totalRevenue = funnelStages[funnelStages.length - 1].count * averageOrderValue;
const potentialRevenue = funnelStages[funnelStages.length - 2].count * averageOrderValue;
const lostRevenue = potentialRevenue - totalRevenue;

export function ConversionFunnel() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null);

  // Handle stage click to show details
  const handleStageClick = (stageId: string) => {
    setSelectedStage(selectedStage === stageId ? null : stageId);
  };

  // Extracted functions to reduce complexity
  const renderStageHeader = (stage: (typeof funnelStages)[0]) => (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <div className="size-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
        <span className="text-xs font-medium">{stage.label}</span>
        <Badge variant="outline" className="ml-1 px-1.5 py-0 text-[10px]">
          {stage.percentage.toFixed(1)}%
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="text-xs font-medium tabular-nums">{stage.count.toLocaleString()}</span>
          <Badge variant={stage.change >= 0 ? "default" : "destructive"} className="ml-1.5 px-1 py-0 text-[10px]">
            {stage.change >= 0 ? (
              <ChevronUp className="mr-0.5 size-2.5" />
            ) : (
              <ChevronDown className="mr-0.5 size-2.5" />
            )}
            {Math.abs(stage.change)}%
          </Badge>
        </div>
        {selectedStage === stage.id ? (
          <ChevronUp className="text-muted-foreground size-3.5" />
        ) : (
          <ChevronDown className="text-muted-foreground size-3.5" />
        )}
      </div>
    </div>
  );

  const renderStageDetails = (stage: (typeof funnelStages)[0]) => {
    if (selectedStage !== stage.id) return null;

    return (
      <div className="bg-card mt-2 rounded-b-lg border-t p-2">
        <div className="grid grid-cols-1 gap-2 @md/funnel:grid-cols-2">
          <div className="bg-muted/40 rounded-lg p-2">
            <div className="text-muted-foreground text-[10px]">Average Time Spent</div>
            <div className="text-sm font-medium">3m 45s</div>
          </div>
          <div className="bg-muted/40 rounded-lg p-2">
            <div className="text-muted-foreground text-[10px]">Bounce Rate</div>
            <div className="text-sm font-medium">{(100 - stage.percentage).toFixed(1)}%</div>
          </div>
          {stage.id === "purchase" && (
            <>
              <div className="bg-muted/40 rounded-lg p-2">
                <div className="text-muted-foreground text-[10px]">Average Order Value</div>
                <div className="text-sm font-medium">{formatCurrency(averageOrderValue)}</div>
              </div>
              <div className="bg-muted/40 rounded-lg p-2">
                <div className="text-muted-foreground text-[10px]">Total Revenue</div>
                <div className="text-sm font-medium">{formatCurrency(totalRevenue)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderStageConnector = (stage: (typeof funnelStages)[0], nextStage: (typeof funnelStages)[0] | null) => {
    if (!nextStage) return null;

    const conversionRate = (nextStage.count / stage.count) * 100;

    return (
      <div className="flex items-center justify-center py-0.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center">
                <ArrowRight className="text-muted-foreground size-3.5" />
                <span className="text-muted-foreground text-[10px] font-medium">{conversionRate.toFixed(1)}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-[10px]">
              <p>
                {conversionRate.toFixed(1)}% of users move from {stage.label} to {nextStage.label}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <Card className="@container/funnel">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <LineChart className="size-4" />
          Conversion Funnel
        </CardTitle>
        <CardDescription className="text-xs">Track user journey from visit to conversion</CardDescription>
        <CardAction className="flex gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Filter className="mr-1.5 size-3.5" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Traffic</DropdownMenuItem>
              <DropdownMenuItem>Organic Search</DropdownMenuItem>
              <DropdownMenuItem>Direct Traffic</DropdownMenuItem>
              <DropdownMenuItem>Social Media</DropdownMenuItem>
              <DropdownMenuItem>Email Campaigns</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-7 w-[110px] text-xs" size="sm">
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="flex flex-col gap-1">
          {funnelStages.map((stage, index) => {
            const isLast = index === funnelStages.length - 1;
            const nextStage = !isLast ? funnelStages[index + 1] : null;

            return (
              <React.Fragment key={stage.id}>
                <div
                  className={cn(
                    "relative cursor-pointer transition-all",
                    selectedStage === stage.id && "ring-ring rounded-lg ring-1",
                  )}
                  onClick={() => handleStageClick(stage.id)}
                >
                  {renderStageHeader(stage)}

                  <div
                    className="bg-muted relative h-2.5 w-full overflow-hidden rounded-full"
                    aria-label={`${stage.label} conversion rate: ${stage.percentage}%`}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${stage.percentage}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>

                  {renderStageDetails(stage)}
                </div>

                {renderStageConnector(stage, nextStage)}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 @md/funnel:grid-cols-3">
          <div className="rounded-lg border p-2">
            <div className="text-muted-foreground text-[10px]">Conversion Rate</div>
            <div className="mt-0.5 text-base font-semibold">
              {funnelStages[funnelStages.length - 1].percentage.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-lg border p-2">
            <div className="text-muted-foreground text-[10px]">Revenue Generated</div>
            <div className="mt-0.5 text-base font-semibold">{formatCurrency(totalRevenue, { noDecimals: true })}</div>
          </div>

          <div className="rounded-lg border p-2">
            <div className="text-muted-foreground text-[10px]">Lost Revenue</div>
            <div className="mt-0.5 text-base font-semibold">{formatCurrency(lostRevenue, { noDecimals: true })}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
