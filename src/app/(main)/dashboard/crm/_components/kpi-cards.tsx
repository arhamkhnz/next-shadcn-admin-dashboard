"use client";

import { ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { computeKpiMetrics, type KpiMetric } from "./crm-data/metrics";
import { filterOpportunities, opportunityRows } from "./crm-data/opportunities";
import { entriesInWindow } from "./crm-data/period";
import { qualifiedFlow, sumFlowEntries } from "./crm-data/qualified-flow";
import { CrmFilterBar } from "./crm-filter-bar";
import { useCrmFilters } from "./crm-filters";

function TrendBadge({ metric }: { metric: KpiMetric }) {
  const { trend, trendLabel } = metric;
  return (
    <Badge
      variant="outline"
      className={cn(
        trend === "up" &&
          "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300",
        trend === "down" && "border-destructive/20 bg-destructive/10 text-destructive",
        trend === "flat" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {trend === "up" ? <TrendingUp /> : trend === "down" ? <TrendingDown /> : <Minus />}
      {trendLabel}
    </Badge>
  );
}

export function KpiCards() {
  const { window, ownerId } = useCrmFilters();

  const currentOpportunities = filterOpportunities(opportunityRows, window.current, ownerId);
  const previousOpportunities = filterOpportunities(opportunityRows, window.previous, ownerId);
  const currentFlow = sumFlowEntries(entriesInWindow(qualifiedFlow, window.current, ownerId));
  const previousFlow = sumFlowEntries(entriesInWindow(qualifiedFlow, window.previous, ownerId));

  const metrics = computeKpiMetrics({
    currentOpportunities,
    previousOpportunities,
    currentFlow,
    previousFlow,
    comparisonLabel: window.comparisonLabel,
  });

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl tracking-tight">Pipeline Overview</h2>
          <p className="text-muted-foreground text-sm">
            Keep tabs on lead quality, open opportunities, and conversion rates across the current sales cycle.
          </p>
        </div>
        <CrmFilterBar />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardAction>
                <ArrowUpRight className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none tracking-tight">{metric.value}</span>
                <TrendBadge metric={metric} />
              </div>
              <p className="text-sm">
                <span className="font-medium text-foreground">{metric.previousLabel}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
