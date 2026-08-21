"use client";

import * as React from "react";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  type BarRectangleItem,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  type PieSectorDataItem,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { formatCurrency } from "@/lib/utils";

import { getOwnerName } from "../../_components/crm-data/sales-team";
import { dealDrillRow } from "./drill-down-rows";
import { MetricCard } from "./metric-card";
import { ReportChartCard } from "./report-chart-card";
import {
  buildClosedDealSeries,
  buildOwnerValueSeries,
  compareMetric,
  computeSalesOverviewMetrics,
  DEAL_STAGE_PROBABILITIES,
} from "./report-data/report-selectors";
import { useReports } from "./reports-context";

const revenueTrendConfig = {
  won: { label: "Won revenue", color: "var(--chart-2)" },
  lost: { label: "Lost revenue", color: "var(--chart-5)" },
} satisfies ChartConfig;

const wonLostConfig = {
  Won: { label: "Won deals" },
  Lost: { label: "Lost deals" },
} satisfies ChartConfig;

const ownerValueConfig = {
  value: { label: "Open pipeline value", color: "var(--chart-1)" },
} satisfies ChartConfig;

const stageCountConfig = {
  count: { label: "Deals", color: "var(--chart-3)" },
} satisfies ChartConfig;

function formatDays(days: number | null): string {
  if (days === null || !Number.isFinite(days)) return "—";
  return `${Math.round(days)} days`;
}

export function SalesOverview() {
  const { window, openDeals, allNonArchivedDeals, closedDealsCurrent, closedDealsPrevious, openDrillDown } =
    useReports();

  const current = React.useMemo(
    () => computeSalesOverviewMetrics(openDeals, closedDealsCurrent),
    [openDeals, closedDealsCurrent],
  );
  const previous = React.useMemo(
    () => computeSalesOverviewMetrics(openDeals, closedDealsPrevious),
    [openDeals, closedDealsPrevious],
  );

  const revenueTrend = React.useMemo(
    () => buildClosedDealSeries(closedDealsCurrent, window.current),
    [closedDealsCurrent, window],
  );

  const ownerValue = React.useMemo(
    () =>
      buildOwnerValueSeries(
        openDeals.map((deal) => ({ ownerId: deal.ownerId, value: deal.value })),
        getOwnerName,
      ),
    [openDeals],
  );

  const stageCounts = React.useMemo(() => {
    const stages = Object.keys(DEAL_STAGE_PROBABILITIES) as (keyof typeof DEAL_STAGE_PROBABILITIES)[];
    return stages.map((stage) => ({
      stage,
      count: allNonArchivedDeals.filter((deal) => deal.stage === stage).length,
    }));
  }, [allNonArchivedDeals]);

  const wonLostData = React.useMemo(
    () =>
      [
        { label: "Won", value: current.wonDeals, fill: "var(--chart-2)" },
        { label: "Lost", value: current.lostDeals, fill: "var(--chart-5)" },
      ].filter((entry) => entry.value > 0),
    [current.wonDeals, current.lostDeals],
  );

  function showClosedDeals(stage: "Closed Won" | "Closed Lost") {
    const deals = closedDealsCurrent.filter((deal) => deal.stage === stage);
    openDrillDown({
      title: `${stage} deals`,
      description: `Deals closed between ${window.label}`,
      rows: deals.map(dealDrillRow),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Total Pipeline Value"
          value={formatCurrency(current.totalPipelineValue, { noDecimals: true })}
          caption="Open, non-archived deals · current snapshot"
          onDrillDown={() =>
            openDrillDown({
              title: "Open pipeline deals",
              description: "Active deals currently in an open stage",
              rows: openDeals.map(dealDrillRow),
            })
          }
        />
        <MetricCard
          label="Weighted Pipeline Value"
          value={formatCurrency(current.weightedPipelineValue, { noDecimals: true })}
          caption="Deal value × stage probability · current snapshot"
        />
        <MetricCard
          label="Open Deals"
          value={String(current.openDeals)}
          caption="Non-archived deals in open stages"
          onDrillDown={() =>
            openDrillDown({
              title: "Open deals",
              description: "Deals currently in an open stage",
              rows: openDeals.map(dealDrillRow),
            })
          }
        />
        <MetricCard
          label="Won Revenue"
          value={formatCurrency(current.wonRevenue, { noDecimals: true })}
          caption={`Closed ${window.label}`}
          comparison={compareMetric(current.wonRevenue, previous.wonRevenue)}
          onDrillDown={() => showClosedDeals("Closed Won")}
          drillDownLabel="View won deals"
        />
        <MetricCard
          label="Lost Revenue"
          value={formatCurrency(current.lostRevenue, { noDecimals: true })}
          caption={`Closed ${window.label}`}
          comparison={compareMetric(current.lostRevenue, previous.lostRevenue)}
          onDrillDown={() => showClosedDeals("Closed Lost")}
          drillDownLabel="View lost deals"
        />
        <MetricCard
          label="Won Deals"
          value={String(current.wonDeals)}
          caption={`Closed ${window.label}`}
          comparison={compareMetric(current.wonDeals, previous.wonDeals)}
          onDrillDown={() => showClosedDeals("Closed Won")}
          drillDownLabel="View won deals"
        />
        <MetricCard
          label="Average Deal Value"
          value={
            current.averageWonDealValue === null
              ? "—"
              : formatCurrency(current.averageWonDealValue, { noDecimals: true })
          }
          caption="Average value of won deals"
          comparison={compareMetric(current.averageWonDealValue, previous.averageWonDealValue)}
        />
        <MetricCard
          label="Win Rate"
          value={current.winRate === null ? "—" : `${current.winRate.toFixed(1)}%`}
          caption="Won ÷ (won + lost) closed deals"
          comparison={compareMetric(current.winRate, previous.winRate)}
        />
        <MetricCard
          label="Average Sales Cycle"
          value={formatDays(current.averageSalesCycleDays)}
          caption="Created → closed for decided deals"
          comparison={compareMetric(current.averageSalesCycleDays, previous.averageSalesCycleDays)}
        />
      </div>

      <ReportChartCard
        title="Revenue trend"
        description={`Won and lost revenue of deals closed ${window.label}`}
        config={revenueTrendConfig}
        isEmpty={revenueTrend.every((point) => point.won === 0 && point.lost === 0)}
        emptyTitle="No closed deals in this period"
        summary={`Won and lost revenue grouped over ${window.label}.`}
      >
        <BarChart data={revenueTrend} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="won" fill="var(--color-won)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="lost" fill="var(--color-lost)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ReportChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportChartCard
          title="Deals won versus lost"
          description={`Decided deals closed ${window.label}`}
          config={wonLostConfig}
          isEmpty={wonLostData.length === 0}
          emptyTitle="No decided deals"
          summary={`${current.wonDeals} won and ${current.lostDeals} lost deals in ${window.label}. Use the Won Deals and Lost Revenue cards above for keyboard access to these lists.`}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Pie
              data={wonLostData}
              dataKey="value"
              nameKey="label"
              innerRadius={54}
              outerRadius={88}
              strokeWidth={2}
              isAnimationActive={false}
              onClick={(data: PieSectorDataItem) => {
                const datum = data.payload as { name?: string } | undefined;
                showClosedDeals(datum?.name === "Won" ? "Closed Won" : "Closed Lost");
              }}
            />
          </PieChart>
        </ReportChartCard>

        <ReportChartCard
          title="Deal value by owner"
          description="Open pipeline value per owner · current snapshot"
          config={ownerValueConfig}
          isEmpty={ownerValue.length === 0}
          emptyTitle="No open deals"
          summary="Open pipeline value grouped by deal owner."
        >
          <BarChart data={ownerValue} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <YAxis type="category" dataKey="label" width={96} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
              onClick={(data: BarRectangleItem) => {
                const datum = data.payload as { ownerId?: string | null } | undefined;
                if (!datum?.ownerId) return;
                openDrillDown({
                  title: `Open deals — ${getOwnerName(datum.ownerId)}`,
                  rows: openDeals.filter((deal) => deal.ownerId === datum.ownerId).map(dealDrillRow),
                });
              }}
            >
              {ownerValue.map((point) => (
                <Cell key={point.label} cursor="pointer" />
              ))}
            </Bar>
          </BarChart>
        </ReportChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal count by stage</CardTitle>
          <CardDescription>All non-archived deals grouped by current stage</CardDescription>
          <CardAction>
            <span className="text-muted-foreground text-sm">Current snapshot</span>
          </CardAction>
        </CardHeader>
        <CardContent>
          {allNonArchivedDeals.length === 0 ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BarChart3 />
                  </EmptyMedia>
                  <EmptyTitle>No deals match the filters</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <EmptyDescription>Adjust or reset the report filters to see stage counts.</EmptyDescription>
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_240px]">
              <ChartContainer config={stageCountConfig} className="h-64 w-full">
                <BarChart data={stageCounts} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
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
                  <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    onClick={(data: BarRectangleItem) => {
                      const datum = data.payload as { stage?: string } | undefined;
                      if (!datum?.stage) return;
                      openDrillDown({
                        title: `Deals in ${datum.stage}`,
                        rows: allNonArchivedDeals.filter((deal) => deal.stage === datum.stage).map(dealDrillRow),
                      });
                    }}
                  >
                    {stageCounts.map((point) => (
                      <Cell key={point.stage} cursor="pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>

              <ul className="flex flex-col gap-2 self-center">
                {stageCounts.map((stat) => (
                  <li key={stat.stage} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                    <span className="text-sm">{stat.stage}</span>
                    <span className="font-medium text-sm tabular-nums">{stat.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="sr-only">Number of non-archived deals in each pipeline stage.</p>
        </CardContent>
      </Card>
    </div>
  );
}
