import type { ComponentType } from "react";

import { AlertTriangle, BadgeDollarSign, PackageCheck, Percent, Receipt, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

import { type KpiMetric, kpiMetrics } from "./data";

const metricIcons = {
  "net-sales": BadgeDollarSign,
  orders: Receipt,
  conversion: Percent,
  aov: ShoppingCart,
  margin: PackageCheck,
  "stockout-risk": AlertTriangle,
} satisfies Record<KpiMetric["key"], ComponentType<{ className?: string }>>;

const toneClasses = {
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  negative: "bg-destructive/10 text-destructive",
} satisfies Record<KpiMetric["tone"], string>;

export function KpiStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {kpiMetrics.map((metric) => {
        const Icon = metricIcons[metric.key];

        return (
          <Card key={metric.key} size="sm" className="shadow-xs">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <Badge variant="secondary" className={cn("font-medium tabular-nums", toneClasses[metric.tone])}>
                  {metric.delta}
                </Badge>
              </div>

              <div className="min-w-0 space-y-1">
                <div className="text-muted-foreground text-sm">{metric.label}</div>
                <div className="truncate font-semibold text-2xl tabular-nums tracking-tight">
                  {formatMetricValue(metric)}
                </div>
                <div className="truncate text-muted-foreground text-xs">{metric.helper}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function formatMetricValue(metric: KpiMetric) {
  if (metric.format === "currency") {
    return formatCurrency(metric.value, {
      noDecimals: metric.value >= 1000,
      maximumFractionDigits: metric.value >= 1000 ? 0 : 2,
    });
  }

  if (metric.format === "percent") {
    return `${metric.value.toFixed(1)}%`;
  }

  return metric.value.toLocaleString("en-US");
}
