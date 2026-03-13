"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";

import { buildEcommerceSnapshot, getPresetDateRange, type MerchandiseRow, type OpsAlert } from "./ecommerce.config";

export function EcommerceDashboard() {
  const snapshot = buildEcommerceSnapshot({
    dateRange: getPresetDateRange("30d"),
    comparisonMode: "previous-period",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <FunnelCard snapshot={snapshot} className="xl:col-span-6" />
        <WatchlistCard snapshot={snapshot} className="xl:col-span-6" />
      </div>

      <MerchandiseTableCard rows={snapshot.merchandiseRows} />
    </div>
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
