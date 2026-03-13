"use client";

import * as React from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import {
  buildEcommerceSnapshot,
  COMPARISON_OPTIONS,
  type CommerceMetric,
  type ComparisonMode,
  getPresetDateRange,
  TIME_RANGE_OPTIONS,
  type TimeRange,
} from "./ecommerce.config";

export function EcommerceOverview() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d");
  const [comparisonMode, setComparisonMode] = React.useState<ComparisonMode>("previous-period");
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>(() => getPresetDateRange("30d"));
  const [isPending, startTransition] = React.useTransition();

  const snapshot = buildEcommerceSnapshot({ dateRange, comparisonMode });

  const handlePresetChange = (value: string) => {
    if (!value) {
      return;
    }

    const nextRange = value as TimeRange;
    startTransition(() => {
      setTimeRange(nextRange);
      setDateRange(getPresetDateRange(nextRange));
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <ToggleGroup
          type="single"
          value={timeRange}
          variant="outline"
          size="sm"
          className="w-36"
          onValueChange={handlePresetChange}
        >
          {TIME_RANGE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex-1 justify-center"
              aria-label={option.label}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Select value={comparisonMode} onValueChange={(value) => setComparisonMode(value as ComparisonMode)}>
          <SelectTrigger className="min-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {COMPARISON_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download data-icon="inline-start" />
          Export
        </Button>
        {isPending ? <span className="text-muted-foreground text-xs">Refreshing</span> : null}
      </div>

      <MetricStrip metrics={snapshot.metrics} />
    </div>
  );
}

function MetricStrip({ metrics }: { metrics: CommerceMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => {
        const delta = getMetricDelta(metric);
        const deltaLabel = formatMetricDelta(metric);

        return (
          <Card key={metric.key} size="sm" className="data-[size=sm]:gap-2 data-[size=sm]:pt-3 data-[size=sm]:pb-0">
            <CardHeader>
              <CardTitle className="text-foreground/90 text-sm/none">{metric.label}</CardTitle>
            </CardHeader>

            <CardContent className="overflow-hidden border-t bg-muted/50 group-data-[size=sm]/card:px-0">
              <div className="space-y-0.5 px-4 py-3">
                <div className="font-semibold text-2xl tabular-nums leading-none tracking-tight">
                  {formatMetricValue(metric)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-nowrap text-muted-foreground text-xs">{getMetricSupportText(metric)}</div>
                  <div className={cn("text-nowrap font-medium text-xs tabular-nums", getDeltaTextClass(metric, delta))}>
                    {deltaLabel}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function getMetricDelta(metric: CommerceMetric) {
  if (metric.deltaFormat === "points") {
    return metric.value - metric.baseline;
  }

  if (metric.baseline === 0) {
    return 0;
  }

  return (metric.value - metric.baseline) / metric.baseline;
}

function formatMetricValue(metric: CommerceMetric) {
  if (metric.format === "currency") {
    return formatShortCurrency(metric.value);
  }
  if (metric.format === "number") {
    return formatCompactNumber(metric.value);
  }
  return formatPercent(metric.value, 1);
}

function formatMetricDelta(metric: CommerceMetric) {
  const delta = getMetricDelta(metric);
  const sign = delta > 0 ? "+" : delta < 0 ? "-" : "";

  if (metric.deltaFormat === "points") {
    return `${sign}${Math.abs(delta * 100).toFixed(1)}pp`;
  }

  if (metric.deltaFormat === "absolute") {
    return `${sign}${Math.abs(delta).toLocaleString()}`;
  }

  return `${sign}${Math.abs(delta * 100).toFixed(1)}%`;
}

function getDeltaTextClass(metric: CommerceMetric, delta: number) {
  const isPositive = metric.intent === "up" ? delta >= 0 : delta <= 0;
  if (isPositive) {
    return "text-emerald-700";
  }
  return "text-destructive";
}

function getMetricSupportText(metric: CommerceMetric) {
  switch (metric.comparisonLabel) {
    case "Previous period":
      return "vs prior period";
    case "Target pace":
      return "vs target pace";
    default:
      return `vs ${metric.comparisonLabel.toLowerCase()}`;
  }
}

function formatShortCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits,
  }).format(value);
}
