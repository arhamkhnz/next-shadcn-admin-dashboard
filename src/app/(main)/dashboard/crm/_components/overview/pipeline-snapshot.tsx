"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

import { computeStageStats, isOpenStage } from "../../reports/_components/report-data/report-selectors";
import { useOverviewFilters } from "./overview-filters";

export function PipelineSnapshot() {
  const { openDeals } = useOverviewFilters();

  const stages = useMemo(() => computeStageStats(openDeals).filter((stat) => isOpenStage(stat.stage)), [openDeals]);
  const totalValue = stages.reduce((sum, stat) => sum + stat.totalValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Pipeline by stage
          <Badge variant="secondary">{openDeals.length} open deals</Badge>
        </CardTitle>
        <CardDescription>Live snapshot of open pipeline · click a stage to open it on the deals board.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/crm/deals?view=pipeline">Open pipeline</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {openDeals.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Layers />
              </EmptyMedia>
              <EmptyTitle>No open deals</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <EmptyDescription>Adjust the owner filter or create a deal to see the pipeline.</EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stages.map((stat) => {
              const share = totalValue > 0 ? (stat.totalValue / totalValue) * 100 : 0;
              return (
                <li key={stat.stage}>
                  <Link
                    href={`/dashboard/crm/deals?view=pipeline&stage=${encodeURIComponent(stat.stage)}`}
                    className="flex flex-col gap-1.5 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{stat.stage}</span>
                      <Badge variant="outline" className="tabular-nums">
                        {stat.count}
                      </Badge>
                    </div>
                    <span className="font-semibold text-lg tabular-nums">{formatCurrency(stat.totalValue)}</span>
                    <Progress value={share} aria-label={`${stat.stage} share of open pipeline`} />
                    <span className="text-muted-foreground text-xs">
                      Weighted {formatCurrency(stat.weightedValue)} · {share.toFixed(0)}% of pipeline
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
