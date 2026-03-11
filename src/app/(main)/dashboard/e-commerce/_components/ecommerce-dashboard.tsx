"use client";

import * as React from "react";

import { format, startOfDay } from "date-fns";
import { Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, formatCurrency } from "@/lib/utils";

import {
  buildEcommerceSnapshot,
  COMPARISON_OPTIONS,
  type CommerceMetric,
  type ComparisonMode,
  type EcommerceSnapshot,
  getComparisonLabel,
  getPresetDateRange,
  getTimeRangeFromDateRange,
  type MerchandiseRow,
  type OpsAlert,
  TIME_RANGE_OPTIONS,
  type TimeRange,
} from "./ecommerce.config";

const chartConfig = {
  sales: {
    label: "Net sales",
    color: "color-mix(in oklab, var(--chart-2) 76%, var(--foreground) 24%)",
  },
  orders: {
    label: "Orders",
    color: "color-mix(in oklab, var(--chart-4) 72%, var(--background) 28%)",
  },
} satisfies ChartConfig;

export function EcommerceDashboard() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d");
  const [comparisonMode, setComparisonMode] = React.useState<ComparisonMode>("previous-period");
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>(() => getPresetDateRange("30d"));
  const [isPending, startTransition] = React.useTransition();

  const snapshot = buildEcommerceSnapshot({ dateRange, comparisonMode });
  const comparisonLabel = getComparisonLabel(comparisonMode);

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

  const handleDateRangeChange = (value: DateRange | undefined) => {
    if (!value?.from || !value?.to) {
      return;
    }

    const nextRange = {
      from: startOfDay(value.from),
      to: startOfDay(value.to),
    };

    startTransition(() => {
      setDateRange(nextRange);
      setTimeRange(getTimeRangeFromDateRange(nextRange));
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-4">
        <DashboardHeader
          comparisonMode={comparisonMode}
          dateRange={dateRange}
          isPending={isPending}
          onComparisonChange={setComparisonMode}
          onDateRangeChange={handleDateRangeChange}
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="text-muted-foreground text-sm">
            {format(dateRange.from, "d MMM yyyy")} to {format(dateRange.to, "d MMM yyyy")} · {comparisonLabel}
          </p>

          <ToggleGroup type="single" value={timeRange} variant="outline" size="sm" onValueChange={handlePresetChange}>
            {TIME_RANGE_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <MetricStrip metrics={snapshot.metrics} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <TradingPulseCard snapshot={snapshot} className="xl:col-span-8" />
        <DecisionQueueCard snapshot={snapshot} className="xl:col-span-4" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <FunnelCard snapshot={snapshot} className="xl:col-span-6" />
        <WatchlistCard snapshot={snapshot} className="xl:col-span-6" />
      </div>

      <MerchandiseTableCard rows={snapshot.merchandiseRows} />
    </div>
  );
}

function DashboardHeader({
  comparisonMode,
  dateRange,
  isPending,
  onComparisonChange,
  onDateRangeChange,
}: {
  comparisonMode: ComparisonMode;
  dateRange: { from: Date; to: Date };
  isPending: boolean;
  onComparisonChange: (value: ComparisonMode) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <DateRangePicker value={dateRange} onChange={onDateRangeChange} />

      <Select value={comparisonMode} onValueChange={(value) => onComparisonChange(value as ComparisonMode)}>
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
              <CardTitle className="text-muted-foreground text-sm/none">{metric.label}</CardTitle>
            </CardHeader>

            <CardContent className="overflow-hidden border-t bg-muted group-data-[size=sm]/card:px-0">
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

function TradingPulseCard({ snapshot, className }: { snapshot: EcommerceSnapshot; className?: string }) {
  const revenueMetric = snapshot.metrics[0];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>Trading Pulse</CardTitle>
          <CardDescription>Sales versus target and order pace.</CardDescription>
        </div>
        <CardAction>
          <Badge variant="outline" className="rounded-md">
            {revenueMetric.context}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <SummaryTile
            label="Target attainment"
            value={formatPercent(snapshot.summary.targetAttainmentRate / 100, 0)}
            note="Against plan"
          />
          <SummaryTile
            label="Order pace"
            value={formatPercent(snapshot.summary.orderPaceRate / 100, 0)}
            note="Against baseline"
          />
          <SummaryTile
            label="Late shipments"
            value={formatPercent(snapshot.summary.lateShipmentRate, 1)}
            note="Current rate"
          />
        </div>

        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ComposedChart data={snapshot.tradingSeries} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="dayLabel" tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
            <YAxis
              yAxisId="sales"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={72}
              tickFormatter={(value) => formatShortCurrency(value)}
            />
            <YAxis yAxisId="orders" orientation="right" hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium text-foreground tabular-nums">
                        {name === "Net sales"
                          ? formatCurrency(Number(value), { noDecimals: true })
                          : Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ReferenceLine
              yAxisId="sales"
              x={snapshot.anomaly.label}
              stroke="color-mix(in oklab, var(--chart-5) 45%, var(--border) 55%)"
              strokeDasharray="4 4"
            />
            <Area
              yAxisId="sales"
              type="monotone"
              dataKey="netSales"
              name="Net sales"
              fill="var(--color-sales)"
              fillOpacity={0.16}
              stroke="var(--color-sales)"
              strokeWidth={2}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>

        <div className="grid gap-1 rounded-lg border p-4">
          <p className="font-medium text-sm">{snapshot.anomaly.title}</p>
          <p className="text-muted-foreground text-sm">{snapshot.anomaly.detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DecisionQueueCard({ snapshot, className }: { snapshot: EcommerceSnapshot; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Decision Queue</CardTitle>
        <CardDescription>Top actions by impact.</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-3">
        {snapshot.decisionQueue.map((item, index) => (
          <div key={item.key} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Priority {index + 1}</span>
                <p className="font-medium text-base">{item.title}</p>
              </div>
              <Badge variant="outline" className={cn("rounded-md text-[11px]", getUrgencyBadgeClass(item.urgency))}>
                {item.impactLabel}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm">{item.summary}</p>

            <div className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium">{item.owner}</span>
              </div>
              <div className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Next step</span>
                <span className="max-w-56 text-right">{item.nextStep}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FunnelCard({ snapshot, className }: { snapshot: EcommerceSnapshot; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Funnel Leakage</CardTitle>
        <CardDescription>Where shoppers drop before purchase.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border p-4">
          <p className="font-medium text-sm">{snapshot.leakNote.title}</p>
          <p className="mt-1 text-muted-foreground text-sm">{snapshot.leakNote.detail}</p>
        </div>

        <div className="flex flex-col gap-3">
          {snapshot.funnelStages.map((stage) => (
            <div key={stage.key} className="grid gap-2 rounded-lg border p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{stage.label}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatCompactNumber(stage.count)} shoppers · {formatPercent(stage.shareOfStart, 0)} of the funnel
                    start
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg tabular-nums">{formatPercent(stage.passThroughRate, 0)}</p>
                  <p className="text-muted-foreground text-xs">
                    {stage.key === "sessions" ? "entry point" : "pass-through"}
                  </p>
                </div>
              </div>
              <Progress value={Math.max(stage.shareOfStart * 100, 6)} className="h-2.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WatchlistCard({ snapshot, className }: { snapshot: EcommerceSnapshot; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Inventory &amp; Fulfillment Watchlist</CardTitle>
        <CardDescription>Inventory, shipping, and returns.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <WatchlistStat
            label="Low-cover SKUs"
            value={snapshot.summary.lowCoverSkuCount.toString()}
            note="Inside 14 days of cover"
          />
          <WatchlistStat
            label="Aging inventory"
            value={formatShortCurrency(snapshot.summary.agingInventoryValue)}
            note="Capital tied to slow footwear"
          />
          <WatchlistStat
            label="Late shipment rate"
            value={formatPercent(snapshot.summary.lateShipmentRate, 1)}
            note="Keep under 2.8%"
          />
          <WatchlistStat
            label="Return rate"
            value={formatPercent(snapshot.summary.returnRate, 1)}
            note="Fit/expectation guardrail"
          />
        </div>

        <div className="flex flex-col gap-3">
          {snapshot.opsAlerts.map((alert) => (
            <WatchlistRow key={alert.key} alert={alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MerchandiseTableCard({ rows }: { rows: MerchandiseRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchandise Movement</CardTitle>
        <CardDescription>Products ranked by operating impact.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-52">Product</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>Stock cover</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-72">Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.sku}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{row.sku}</span>
                    <span className="text-muted-foreground text-xs">{row.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatCurrency(row.revenue, { noDecimals: true })}
                </TableCell>
                <TableCell className="tabular-nums">{row.units.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums">{formatPercent(row.marginRate, 1)}</TableCell>
                <TableCell className="tabular-nums">{formatPercent(row.conversionRate, 1)}</TableCell>
                <TableCell className="tabular-nums">{row.stockCoverDays}d</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("rounded-md text-[11px]", getStatusBadgeClass(row.status))}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-72 whitespace-normal text-muted-foreground text-sm">
                  {row.recommendation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SummaryTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="font-semibold text-2xl tracking-tight">{value}</div>
      <p className="text-muted-foreground text-sm">{note}</p>
    </div>
  );
}

function WatchlistStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-semibold text-2xl tracking-tight">{value}</span>
      <span className="text-muted-foreground text-sm">{note}</span>
    </div>
  );
}

function WatchlistRow({ alert }: { alert: OpsAlert }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{alert.label}</span>
          <p className="text-muted-foreground text-sm">{alert.detail}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg tabular-nums">{alert.metricLabel}</p>
          <p className="text-muted-foreground text-xs">{alert.thresholdLabel}</p>
        </div>
      </div>
      <Progress value={Math.max(alert.progress, 8)} className={cn("h-2.5", getProgressClass(alert.urgency))} />
      <p className="text-muted-foreground text-sm">{alert.recommendation}</p>
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
  if (metric.format === "percent") {
    return formatPercent(metric.value, 1);
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

function getUrgencyBadgeClass(urgency: "stable" | "watch" | "critical") {
  if (urgency === "stable") {
    return "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  if (urgency === "watch") {
    return "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
  return "border-destructive/35 bg-destructive/10 text-destructive";
}

function getProgressClass(urgency: "stable" | "watch" | "critical") {
  if (urgency === "stable") {
    return "[&_[data-slot=progress-indicator]]:bg-emerald-500";
  }
  if (urgency === "watch") {
    return "[&_[data-slot=progress-indicator]]:bg-amber-500";
  }
  return "[&_[data-slot=progress-indicator]]:bg-destructive";
}

function getStatusBadgeClass(status: MerchandiseRow["status"]) {
  switch (status) {
    case "Healthy":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "Push bundles":
      return "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "Aging":
      return "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "Review returns":
      return "border-destructive/35 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-muted/40 text-foreground";
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
