"use client";

import * as React from "react";

import { format } from "date-fns";
import { Download } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getOwnerName } from "../../_components/crm-data/sales-team";
import { leadDrillRow } from "./drill-down-rows";
import { MetricCard } from "./metric-card";
import { ReportChartCard } from "./report-chart-card";
import { buildCsv, buildReportFilename, type CsvCellValue, downloadCsvFile } from "./report-data/csv-export";
import {
  buildLeadCreatedSeries,
  buildLeadScoreDistribution,
  compareMetric,
  computeLeadPerformanceMetrics,
  computeLeadSourceStats,
} from "./report-data/report-selectors";
import { useReports } from "./reports-context";

const createdOverTimeConfig = {
  count: { label: "New leads", color: "var(--chart-1)" },
} satisfies ChartConfig;

const bySourceConfig = {
  count: { label: "Leads", color: "var(--chart-2)" },
} satisfies ChartConfig;

const byStatusConfig = {
  count: { label: "Leads", color: "var(--chart-3)" },
} satisfies ChartConfig;

const scoreDistributionConfig = {
  count: { label: "Leads", color: "var(--chart-4)" },
} satisfies ChartConfig;

const conversionBySourceConfig = {
  total: { label: "Total leads", color: "var(--chart-1)" },
  qualified: { label: "Qualified leads", color: "var(--chart-2)" },
} satisfies ChartConfig;

const byOwnerConfig = {
  count: { label: "Leads", color: "var(--chart-5)" },
} satisfies ChartConfig;

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Nurturing", "Unqualified"] as const;

export function LeadPerformance() {
  const { window, activeLeads, archivedLeads, newLeadsCurrent, newLeadsPrevious, openDrillDown } = useReports();

  const metrics = React.useMemo(
    () => computeLeadPerformanceMetrics(activeLeads, archivedLeads.length, newLeadsCurrent.length),
    [activeLeads, archivedLeads, newLeadsCurrent],
  );
  const previousMetrics = React.useMemo(
    () => computeLeadPerformanceMetrics(activeLeads, archivedLeads.length, newLeadsPrevious.length),
    [activeLeads, archivedLeads, newLeadsPrevious],
  );

  const createdSeries = React.useMemo(() => buildLeadCreatedSeries(activeLeads, window.current), [activeLeads, window]);

  const sourceStats = React.useMemo(() => computeLeadSourceStats(activeLeads), [activeLeads]);

  const bySourceData = React.useMemo(
    () => sourceStats.map((stat) => ({ name: stat.source, count: stat.total })),
    [sourceStats],
  );

  const byStatusData = React.useMemo(
    () =>
      LEAD_STATUSES.map((status) => ({
        status,
        count: activeLeads.filter((lead) => lead.status === status).length,
      })),
    [activeLeads],
  );

  const scoreDistribution = React.useMemo(() => buildLeadScoreDistribution(activeLeads), [activeLeads]);

  const conversionBySourceData = React.useMemo(
    () =>
      sourceStats.map((stat) => ({
        source: stat.source,
        total: stat.total,
        qualified: stat.qualified,
      })),
    [sourceStats],
  );

  const byOwnerData = React.useMemo(() => {
    const byOwner = new Map<string, { label: string; ownerId: string | null; count: number }>();
    for (const lead of activeLeads) {
      const key = lead.ownerId ?? "unassigned";
      const existing = byOwner.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        byOwner.set(key, {
          label: lead.ownerId ? getOwnerName(lead.ownerId) : "Unassigned",
          ownerId: lead.ownerId,
          count: 1,
        });
      }
    }
    return [...byOwner.values()].sort((a, b) => b.count - a.count);
  }, [activeLeads]);

  function showLeads(title: string, rows: typeof activeLeads) {
    openDrillDown({ title, description: `${rows.length} leads match this selection.`, rows: rows.map(leadDrillRow) });
  }

  function exportSourceTable() {
    const headers = [
      "Source",
      "Total Leads",
      "Qualified Leads",
      "Converted Leads",
      "Conversion Rate (%)",
      "Average Score",
      "Average Response Time (days)",
    ];
    const rows: CsvCellValue[][] = sourceStats.map((stat) => [
      stat.source,
      stat.total,
      stat.qualified,
      stat.converted,
      stat.conversionRate === null ? "" : stat.conversionRate.toFixed(1),
      stat.averageScore === null ? "" : stat.averageScore.toFixed(1),
      stat.averageResponseTimeDays === null ? "" : Math.round(stat.averageResponseTimeDays),
    ]);
    downloadCsvFile(
      buildReportFilename("lead-sources", window.current.start, window.current.end),
      buildCsv(headers, rows),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="New Leads"
          value={String(metrics.newLeads)}
          caption={`Created ${window.label}`}
          comparison={compareMetric(metrics.newLeads, previousMetrics.newLeads)}
          onDrillDown={() => showLeads(`New leads (${window.label})`, newLeadsCurrent)}
        />
        <MetricCard
          label="Active Leads"
          value={String(metrics.activeLeads)}
          caption="Non-archived · current snapshot"
          onDrillDown={() => showLeads("Active leads", activeLeads)}
        />
        <MetricCard
          label="Qualified Leads"
          value={String(metrics.qualifiedLeads)}
          caption="Status Qualified · snapshot"
          onDrillDown={() =>
            showLeads(
              "Qualified leads",
              activeLeads.filter((lead) => lead.status === "Qualified"),
            )
          }
        />
        <MetricCard label="Converted Leads" value={String(metrics.convertedLeads)} caption="Reached Qualified status" />
        <MetricCard
          label="Archived Leads"
          value={String(metrics.archivedLeads)}
          caption="Archived · current snapshot"
          onDrillDown={() => showLeads("Archived leads", archivedLeads)}
        />
        <MetricCard
          label="Lead Conversion Rate"
          value={metrics.conversionRate === null ? "—" : `${metrics.conversionRate.toFixed(1)}%`}
          caption="Qualified ÷ active leads"
          comparison={compareMetric(metrics.conversionRate, previousMetrics.conversionRate)}
        />
        <MetricCard
          label="Average Lead Score"
          value={metrics.averageLeadScore === null ? "—" : metrics.averageLeadScore.toFixed(0)}
          caption="Active leads · snapshot"
        />
        <MetricCard
          label="Average Response Time"
          value={metrics.averageResponseTimeDays === null ? "—" : `${Math.round(metrics.averageResponseTimeDays)} days`}
          caption="Created → last activity"
        />
      </div>

      <ReportChartCard
        title="Leads created over time"
        description={`Leads created ${window.label}`}
        config={createdOverTimeConfig}
        isEmpty={newLeadsCurrent.length === 0}
        emptyTitle="No new leads in this period"
        summary={`Leads created per period bucket across ${window.label}.`}
      >
        <BarChart data={createdSeries.map((point) => ({ label: point.bucket.label, count: point.count }))}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ReportChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportChartCard
          title="Leads by source"
          description="Active leads grouped by source · snapshot"
          config={bySourceConfig}
          isEmpty={activeLeads.length === 0}
          emptyTitle="No active leads"
          summary={`Active leads by source: ${bySourceData.map((point) => `${point.name} ${point.count}`).join(", ")}.`}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Pie
              data={bySourceData}
              dataKey="count"
              nameKey="name"
              innerRadius={50}
              outerRadius={85}
              strokeWidth={2}
              isAnimationActive={false}
              onClick={(data: PieSectorDataItem) => {
                const datum = data.payload as { name?: string } | undefined;
                if (!datum?.name) return;
                showLeads(
                  `Leads from ${datum.name}`,
                  activeLeads.filter((lead) => lead.source === datum.name),
                );
              }}
            >
              {bySourceData.map((point) => (
                <Cell key={point.name} cursor="pointer" />
              ))}
            </Pie>
          </PieChart>
        </ReportChartCard>

        <ReportChartCard
          title="Leads by status"
          description="Active leads grouped by lifecycle status · snapshot"
          config={byStatusConfig}
          isEmpty={activeLeads.length === 0}
          emptyTitle="No active leads"
          summary={`Active leads by status: ${byStatusData.map((point) => `${point.status} ${point.count}`).join(", ")}.`}
        >
          <BarChart data={byStatusData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              fontSize={11}
              interval={0}
              angle={-16}
              textAnchor="end"
              height={48}
            />
            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ReportChartCard>

        <ReportChartCard
          title="Lead score distribution"
          description="Active leads grouped by score band · snapshot"
          config={scoreDistributionConfig}
          isEmpty={activeLeads.length === 0}
          emptyTitle="No active leads"
          summary={`Lead score distribution: ${scoreDistribution.map((point) => `${point.label}: ${point.count}`).join(", ")}.`}
        >
          <BarChart data={scoreDistribution} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ReportChartCard>

        <ReportChartCard
          title="Lead conversion by source"
          description="Total vs qualified leads per source · snapshot"
          config={conversionBySourceConfig}
          isEmpty={activeLeads.length === 0}
          emptyTitle="No active leads"
          summary="Total and qualified lead counts for each source."
        >
          <BarChart data={conversionBySourceData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="source" width={104} tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            <Bar dataKey="qualified" fill="var(--color-qualified)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
          </BarChart>
        </ReportChartCard>
      </div>

      <ReportChartCard
        title="Leads by owner"
        description="Active leads per owner · snapshot"
        config={byOwnerConfig}
        heightClass="h-64"
        isEmpty={activeLeads.length === 0}
        emptyTitle="No active leads"
        summary={`Active leads by owner: ${byOwnerData.map((point) => `${point.label} ${point.count}`).join(", ")}.`}
      >
        <BarChart data={byOwnerData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="label" width={110} tickLine={false} axisLine={false} fontSize={11} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
            onClick={(data: BarRectangleItem) => {
              const datum = data.payload as { ownerId?: string | null } | undefined;
              if (!datum?.ownerId) return;
              showLeads(
                `Leads owned by ${getOwnerName(datum.ownerId)}`,
                activeLeads.filter((lead) => lead.ownerId === datum.ownerId),
              );
            }}
          />
        </BarChart>
      </ReportChartCard>

      <Card>
        <CardHeader>
          <CardTitle>Lead sources</CardTitle>
          <CardDescription>Performance of each lead source across active leads</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={exportSourceTable}>
              <Download className="size-3" />
              Export CSV
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {sourceStats.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">No leads match the current filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Total Leads</TableHead>
                    <TableHead className="text-right">Qualified Leads</TableHead>
                    <TableHead className="text-right">Converted Leads</TableHead>
                    <TableHead className="text-right">Conversion Rate</TableHead>
                    <TableHead className="text-right">Average Score</TableHead>
                    <TableHead className="text-right">Avg Response Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sourceStats.map((stat) => (
                    <TableRow key={stat.source}>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                          onClick={() =>
                            showLeads(
                              `Leads from ${stat.source}`,
                              activeLeads.filter((lead) => lead.source === stat.source),
                            )
                          }
                        >
                          {stat.source}
                        </button>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{stat.total}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.qualified}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.converted}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stat.conversionRate === null ? "—" : `${stat.conversionRate.toFixed(1)}%`}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stat.averageScore === null ? "—" : stat.averageScore.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stat.averageResponseTimeDays === null ? "—" : `${Math.round(stat.averageResponseTimeDays)}d`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <p className="mt-3 text-muted-foreground text-xs">
            Converted counts leads that reached the Qualified lifecycle stage — explicit lead-to-contact conversion is
            not tracked in the current data model.
          </p>
        </CardContent>
      </Card>

      <p className="sr-only">
        Reporting window: {format(window.current.start, "MMM d, yyyy")} – {format(window.current.end, "MMM d, yyyy")}.
      </p>
    </div>
  );
}
