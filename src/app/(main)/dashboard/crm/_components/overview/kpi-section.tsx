"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ComparisonBadge } from "../../reports/_components/metric-card";
import { useOverviewFilters } from "./overview-filters";
import { buildOverviewKpis } from "./overview-selectors";

export function KpiSection() {
  const { activeLeads, currentMetrics, previousMetrics, scopedActivities } = useOverviewFilters();

  const kpis = useMemo(
    () => buildOverviewKpis({ activeLeads, currentMetrics, previousMetrics, scopedActivities }),
    [activeLeads, currentMetrics, previousMetrics, scopedActivities],
  );

  return (
    <section aria-labelledby="overview-kpis-heading" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <h2 id="overview-kpis-heading" className="sr-only">
        Key metrics
      </h2>
      {kpis.map((kpi) => (
        <Card key={kpi.id} className="gap-2 py-4">
          <CardHeader className="px-4">
            <CardDescription>{kpi.label}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{kpi.value}</CardTitle>
            <CardAction>
              <Badge asChild variant="ghost">
                <Link href={kpi.href} aria-label={kpi.linkLabel}>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="px-4">
            <div className="flex flex-wrap items-center gap-2">
              {kpi.comparison ? <ComparisonBadge comparison={kpi.comparison} /> : null}
              <p className="text-muted-foreground text-xs">{kpi.caption}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
