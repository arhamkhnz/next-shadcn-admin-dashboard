"use client";

import * as React from "react";

import { Bar, BarChart, CartesianGrid, Funnel, FunnelChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

import { dealDrillRow } from "./drill-down-rows";
import { MetricCard } from "./metric-card";
import { ReportChartCard } from "./report-chart-card";
import {
  computeExpectedCloseDeals,
  computeOverdueDeals,
  computeStageStats,
  computeStalledDeals,
  STALLED_DEAL_DAYS,
} from "./report-data/report-selectors";
import { useReports } from "./reports-context";

const funnelConfig = {
  count: { label: "Deals", color: "var(--chart-1)" },
} satisfies ChartConfig;

const stageValueConfig = {
  total: { label: "Total value", color: "var(--chart-1)" },
  weighted: { label: "Weighted value", color: "var(--chart-4)" },
} satisfies ChartConfig;

function formatDays(days: number | null): string {
  if (days === null || !Number.isFinite(days)) return "—";
  return `${Math.round(days)}d`;
}

export function PipelineReport() {
  const { openDeals, allNonArchivedDeals, openDrillDown } = useReports();

  const expectedClose = React.useMemo(() => computeExpectedCloseDeals(openDeals), [openDeals]);
  const overdue = React.useMemo(() => computeOverdueDeals(openDeals), [openDeals]);
  const stalled = React.useMemo(() => computeStalledDeals(openDeals), [openDeals]);
  const stageStats = React.useMemo(() => computeStageStats(allNonArchivedDeals), [allNonArchivedDeals]);

  const funnelData = React.useMemo(
    () =>
      stageStats
        .filter((stat) => stat.stage !== "Closed Lost")
        .map((stat) => ({
          stage: stat.stage,
          count: stat.count,
          fill: "var(--color-count)",
        })),
    [stageStats],
  );

  const stageValueData = React.useMemo(
    () =>
      stageStats.map((stat) => ({
        stage: stat.stage,
        total: stat.totalValue,
        weighted: stat.weightedValue,
      })),
    [stageStats],
  );

  const openPipelineValue = React.useMemo(() => openDeals.reduce((sum, deal) => sum + deal.value, 0), [openDeals]);
  const weightedPipelineValue = React.useMemo(
    () =>
      stageStats
        .filter((stat) => stat.stage !== "Closed Won" && stat.stage !== "Closed Lost")
        .reduce((sum, stat) => sum + stat.weightedValue, 0),
    [stageStats],
  );

  function showStage(stage: string) {
    openDrillDown({
      title: `Deals in ${stage}`,
      description: "Current snapshot of non-archived deals",
      rows: allNonArchivedDeals.filter((deal) => deal.stage === stage).map(dealDrillRow),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Open Deals"
          value={String(openDeals.length)}
          caption="Non-archived deals in open stages"
          onDrillDown={() => openDrillDown({ title: "Open deals", rows: openDeals.map(dealDrillRow) })}
        />
        <MetricCard
          label="Open Pipeline Value"
          value={formatCurrency(openPipelineValue, { noDecimals: true })}
          caption="Sum of open deal values"
        />
        <MetricCard
          label="Weighted Pipeline Value"
          value={formatCurrency(weightedPipelineValue, { noDecimals: true })}
          caption="Deal value × stage probability"
        />
        <MetricCard
          label="Expected to Close (30 days)"
          value={String(expectedClose.length)}
          caption="By expected close date · snapshot"
          onDrillDown={() =>
            openDrillDown({
              title: "Expected to close in the next 30 days",
              description: "Open deals with an expected close date within the next 30 days",
              rows: expectedClose.map(dealDrillRow),
            })
          }
        />
        <MetricCard
          label="Overdue Deals"
          value={String(overdue.length)}
          caption="Past their expected close date"
          onDrillDown={() =>
            openDrillDown({
              title: "Overdue deals",
              description: "Open deals past their expected close date",
              rows: overdue.map(dealDrillRow),
            })
          }
        />
        <MetricCard
          label="Stalled Deals"
          value={String(stalled.length)}
          caption={`No activity in ${STALLED_DEAL_DAYS}+ days`}
          onDrillDown={() =>
            openDrillDown({
              title: "Stalled deals",
              description: `Open deals without recorded activity for at least ${STALLED_DEAL_DAYS} days`,
              rows: stalled.map(dealDrillRow),
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportChartCard
          title="Pipeline funnel"
          description="Deal count flowing through the stages · current snapshot"
          config={funnelConfig}
          isEmpty={funnelData.every((point) => point.count === 0)}
          emptyTitle="No deals match the filters"
          summary={`Funnel of deal counts by stage: ${funnelData
            .map((point) => `${point.stage} ${point.count}`)
            .join(", ")}.`}
        >
          <FunnelChart>
            <Funnel dataKey="count" data={funnelData} isAnimationActive={false}>
              <LabelList position="right" dataKey="stage" fill="var(--foreground)" stroke="none" fontSize={12} />
              <LabelList position="inside" dataKey="count" fill="var(--background)" stroke="none" fontSize={12} />
            </Funnel>
          </FunnelChart>
        </ReportChartCard>

        <ReportChartCard
          title="Deal value by stage"
          description="Total vs weighted value per stage · current snapshot"
          config={stageValueConfig}
          heightClass="h-80"
          isEmpty={allNonArchivedDeals.length === 0}
          emptyTitle="No pipeline value"
          summary="Total and probability-weighted deal value for each pipeline stage."
        >
          <BarChart data={stageValueData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="stage"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              fontSize={11}
              interval={0}
              angle={-16}
              textAnchor="end"
              height={52}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="weighted" fill="var(--color-weighted)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ReportChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stage performance</CardTitle>
          <CardDescription>
            Per-stage breakdown of non-archived deals. Average time in stage is not available because stage transition
            history is not tracked; conversion to next stage is inferred from the current stage distribution.
          </CardDescription>
          <CardAction>
            <span className="text-muted-foreground text-sm">Current snapshot</span>
          </CardAction>
        </CardHeader>
        <CardContent>
          {allNonArchivedDeals.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">No deals match the current filters.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Deal Count</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-right">Weighted Value</TableHead>
                      <TableHead className="text-right">Average Deal Age</TableHead>
                      <TableHead className="text-right">Average Time in Stage</TableHead>
                      <TableHead className="text-right">Conversion to Next Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stageStats.map((stat) => (
                      <TableRow key={stat.stage}>
                        <TableCell>
                          <button
                            type="button"
                            className="font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                            onClick={() => showStage(stat.stage)}
                          >
                            {stat.stage}
                          </button>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{stat.count}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(stat.totalValue, { noDecimals: true })}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(stat.weightedValue, { noDecimals: true })}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatDays(stat.averageDealAgeDays)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">Not Available</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {stat.conversionToNextStage === null
                            ? "—"
                            : `${stat.conversionToNextStage.toFixed(0)}%${stat.conversionInferred ? "*" : ""}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-muted-foreground text-xs">
                * Inferred from the current distribution of deals across stages — historical stage transitions are not
                recorded, so this is an estimate rather than a measured conversion rate.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
