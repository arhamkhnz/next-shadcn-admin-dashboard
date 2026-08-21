"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { ReportChartCard } from "../../reports/_components/report-chart-card";
import { buildClosedDealSeries } from "../../reports/_components/report-data/report-selectors";
import { useOverviewFilters } from "./overview-filters";

const wonLostRevenueConfig = {
  won: { label: "Won revenue", color: "var(--chart-2)" },
  lost: { label: "Lost revenue", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function RevenueChart() {
  const { closedDealsCurrent, window, windowLabel } = useOverviewFilters();

  const series = useMemo(() => buildClosedDealSeries(closedDealsCurrent, window.current), [closedDealsCurrent, window]);
  const isEmpty = series.every((point) => point.won === 0 && point.lost === 0);

  return (
    <ReportChartCard
      title="Won vs lost"
      description={`Revenue of deals closed ${windowLabel}`}
      config={wonLostRevenueConfig}
      isEmpty={isEmpty}
      emptyTitle="No decided deals in this period"
      emptyDescription="Deals marked Closed Won or Closed Lost will appear here."
      summary={`Won and lost revenue grouped over ${windowLabel}.`}
      heightClass="h-64"
      action={
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/crm/reports">Full reports</Link>
        </Button>
      }
    >
      <BarChart data={series} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} fontSize={11} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="won" fill="var(--color-won)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="lost" fill="var(--color-lost)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ReportChartCard>
  );
}
