import type { ComponentType } from "react";

import { AlertTriangle, BadgeDollarSign, PackageCheck, Percent, Receipt, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 dark:*:data-[slot=card]:bg-card">
      {kpiMetrics.map((metric) => {
        const Icon = metricIcons[metric.key];

        return (
          <Card key={metric.key}>
            <CardHeader>
              <CardTitle>
                <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </CardTitle>
              <CardDescription>{metric.label}</CardDescription>
              <CardAction>
                <Badge variant="secondary" className={cn("font-medium tabular-nums", toneClasses[metric.tone])}>
                  {metric.delta}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
                  {formatMetricValue(metric)}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{metric.helper}</p>
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
