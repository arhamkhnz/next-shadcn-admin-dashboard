"use client";

import * as React from "react";

import { Download } from "lucide-react";
import { Bar, BarChart, type BarRectangleItem, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getOwnerName } from "../../_components/crm-data/sales-team";
import { activityDrillRow } from "./drill-down-rows";
import { MetricCard } from "./metric-card";
import { ReportChartCard } from "./report-chart-card";
import { buildCsv, buildReportFilename, type CsvCellValue, downloadCsvFile } from "./report-data/csv-export";
import {
  buildActivityStatusSeries,
  buildActivityTimeSeries,
  buildActivityTypeSeries,
  compareMetric,
  computeActivityOwnerStats,
  computeActivityPerformanceMetrics,
  isOverdueActivity,
} from "./report-data/report-selectors";
import { useReports } from "./reports-context";

const overTimeConfig = {
  count: { label: "Activities", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig;

const byTypeConfig = {
  count: { label: "Activities", color: "var(--chart-3)" },
} satisfies ChartConfig;

const byStatusConfig = {
  count: { label: "Activities", color: "var(--chart-4)" },
} satisfies ChartConfig;

const tasksConfig = {
  completed: { label: "Completed tasks", color: "var(--chart-2)" },
  overdue: { label: "Overdue tasks", color: "var(--chart-5)" },
} satisfies ChartConfig;

const byOwnerConfig = {
  count: { label: "Activities", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ActivityPerformance() {
  const { window, scopedActivitiesCurrent, scopedActivitiesPrevious, openDrillDown } = useReports();

  const metrics = React.useMemo(
    () => computeActivityPerformanceMetrics(scopedActivitiesCurrent),
    [scopedActivitiesCurrent],
  );
  const previousMetrics = React.useMemo(
    () => computeActivityPerformanceMetrics(scopedActivitiesPrevious),
    [scopedActivitiesPrevious],
  );

  const timeSeries = React.useMemo(
    () =>
      buildActivityTimeSeries(scopedActivitiesCurrent, window.current).map((point) => ({
        label: point.bucket.label,
        tooltipLabel: point.bucket.tooltipLabel,
        count: point.count,
        completed: point.completed,
      })),
    [scopedActivitiesCurrent, window],
  );

  const typeSeries = React.useMemo(() => buildActivityTypeSeries(scopedActivitiesCurrent), [scopedActivitiesCurrent]);
  const statusSeries = React.useMemo(
    () => buildActivityStatusSeries(scopedActivitiesCurrent),
    [scopedActivitiesCurrent],
  );

  const ownerStats = React.useMemo(() => computeActivityOwnerStats(scopedActivitiesCurrent), [scopedActivitiesCurrent]);

  const overdueTasks = React.useMemo(
    () => scopedActivitiesCurrent.filter((activity) => activity.type === "Task" && isOverdueActivity(activity)),
    [scopedActivitiesCurrent],
  );
  const completedTasks = React.useMemo(
    () => scopedActivitiesCurrent.filter((activity) => activity.type === "Task" && activity.status === "Completed"),
    [scopedActivitiesCurrent],
  );

  const taskChartData = [
    { label: "Completed", completed: completedTasks.length, overdue: 0 },
    { label: "Overdue", completed: 0, overdue: overdueTasks.length },
  ];

  const ownerChartData = React.useMemo(
    () =>
      ownerStats.map((stat) => ({
        label: stat.ownerId ? getOwnerName(stat.ownerId) : "Unassigned",
        ownerId: stat.ownerId,
        count: stat.total,
      })),
    [ownerStats],
  );

  function showActivities(title: string, rows: typeof scopedActivitiesCurrent) {
    openDrillDown({
      title,
      description: `${rows.length} activities match this selection.`,
      rows: rows.map(activityDrillRow),
    });
  }

  function exportOwnerTable() {
    const headers = ["Owner", "Calls", "Meetings", "Tasks", "Completed", "Overdue", "Canceled", "Completion Rate (%)"];
    const rows: CsvCellValue[][] = ownerStats.map((stat) => [
      stat.ownerId ? getOwnerName(stat.ownerId) : "Unassigned",
      stat.calls,
      stat.meetings,
      stat.tasks,
      stat.completed,
      stat.overdue,
      stat.canceled,
      stat.completionRate === null ? "" : stat.completionRate.toFixed(1),
    ]);
    downloadCsvFile(
      buildReportFilename("activity-owners", window.current.start, window.current.end),
      buildCsv(headers, rows),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Total Activities"
          value={String(metrics.totalActivities)}
          caption={`Scheduled ${window.label}`}
          comparison={compareMetric(metrics.totalActivities, previousMetrics.totalActivities)}
          onDrillDown={() => showActivities(`Activities (${window.label})`, scopedActivitiesCurrent)}
        />
        <MetricCard
          label="Completed Activities"
          value={String(metrics.completedActivities)}
          caption="Status Completed"
          comparison={compareMetric(metrics.completedActivities, previousMetrics.completedActivities)}
          onDrillDown={() =>
            showActivities(
              "Completed activities",
              scopedActivitiesCurrent.filter((a) => a.status === "Completed"),
            )
          }
        />
        <MetricCard
          label="Scheduled Activities"
          value={String(metrics.scheduledActivities)}
          caption="Still scheduled, to do, or in progress"
          onDrillDown={() =>
            showActivities(
              "Scheduled activities",
              scopedActivitiesCurrent.filter((a) => ["Scheduled", "To Do", "In Progress"].includes(a.status)),
            )
          }
        />
        <MetricCard
          label="Canceled Activities"
          value={String(metrics.canceledActivities)}
          caption="Status Canceled"
          comparison={compareMetric(metrics.canceledActivities, previousMetrics.canceledActivities)}
          onDrillDown={() =>
            showActivities(
              "Canceled activities",
              scopedActivitiesCurrent.filter((a) => a.status === "Canceled"),
            )
          }
        />
        <MetricCard
          label="Overdue Activities"
          value={String(metrics.overdueActivities)}
          caption="Past due and not completed"
          onDrillDown={() =>
            showActivities(
              "Overdue activities",
              scopedActivitiesCurrent.filter((a) => isOverdueActivity(a)),
            )
          }
        />
        <MetricCard
          label="Task Completion Rate"
          value={metrics.taskCompletionRate === null ? "—" : `${metrics.taskCompletionRate.toFixed(0)}%`}
          caption="Completed ÷ all Task-type activities"
        />
        <MetricCard
          label="Calls Completed"
          value={String(metrics.callsCompleted)}
          caption="Call-type activities completed"
          comparison={compareMetric(metrics.callsCompleted, previousMetrics.callsCompleted)}
        />
        <MetricCard
          label="Meetings Completed"
          value={String(metrics.meetingsCompleted)}
          caption="Meeting-type activities completed"
          comparison={compareMetric(metrics.meetingsCompleted, previousMetrics.meetingsCompleted)}
        />
        <MetricCard
          label="Average Activities per Deal"
          value={metrics.averageActivitiesPerDeal === null ? "—" : metrics.averageActivitiesPerDeal.toFixed(1)}
          caption="Deal-linked activities ÷ distinct deals"
        />
      </div>

      <ReportChartCard
        title="Activities over time"
        description={`Total vs completed activities · ${window.label}`}
        config={overTimeConfig}
        isEmpty={scopedActivitiesCurrent.length === 0}
        emptyTitle="No activities in this period"
        summary={`Activity volume per period bucket across ${window.label}.`}
      >
        <BarChart data={timeSeries} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ReportChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportChartCard
          title="Activities by type"
          description="All activities in the period grouped by type"
          config={byTypeConfig}
          isEmpty={scopedActivitiesCurrent.length === 0}
          emptyTitle="No activities in this period"
          summary={`Activities by type: ${typeSeries.map((point) => `${point.label} ${point.count}`).join(", ")}.`}
        >
          <BarChart data={typeSeries} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} tickMargin={8} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ReportChartCard>

        <ReportChartCard
          title="Activities by status"
          description="All activities in the period grouped by status"
          config={byStatusConfig}
          isEmpty={scopedActivitiesCurrent.length === 0}
          emptyTitle="No activities in this period"
          summary={`Activities by status: ${statusSeries.map((point) => `${point.label} ${point.count}`).join(", ")}.`}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Pie
              data={statusSeries
                .filter((point) => point.count > 0)
                .map((point) => ({ name: point.label, count: point.count }))}
              dataKey="count"
              nameKey="name"
              innerRadius={50}
              outerRadius={85}
              strokeWidth={2}
              isAnimationActive={false}
            >
              {statusSeries
                .filter((point) => point.count > 0)
                .map((point) => (
                  <Cell key={point.label} cursor="pointer" />
                ))}
            </Pie>
          </PieChart>
        </ReportChartCard>

        <ReportChartCard
          title="Tasks completed versus overdue"
          description="Task-type activities only — counted once via the shared store"
          config={tasksConfig}
          isEmpty={completedTasks.length === 0 && overdueTasks.length === 0}
          emptyTitle="No tasks in this period"
          summary={`${completedTasks.length} completed tasks and ${overdueTasks.length} overdue tasks in the period.`}
        >
          <BarChart data={taskChartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="label" width={96} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            <Bar dataKey="overdue" fill="var(--color-overdue)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
          </BarChart>
        </ReportChartCard>

        <ReportChartCard
          title="Activities by owner"
          description="Total activities per owner in the period"
          config={byOwnerConfig}
          heightClass="h-64"
          isEmpty={scopedActivitiesCurrent.length === 0}
          emptyTitle="No activities in this period"
          summary={`Activities by owner: ${ownerStats
            .map((stat) => `${stat.ownerId ? getOwnerName(stat.ownerId) : "Unassigned"} ${stat.total}`)
            .join(", ")}.`}
        >
          <BarChart data={ownerChartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
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
                showActivities(
                  `Activities owned by ${getOwnerName(datum.ownerId)}`,
                  scopedActivitiesCurrent.filter((activity) => activity.ownerId === datum.ownerId),
                );
              }}
            />
          </BarChart>
        </ReportChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity performance by owner</CardTitle>
          <CardDescription>Calls, meetings, tasks, and completion rates for the selected period</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={exportOwnerTable}>
              <Download className="size-3" />
              Export CSV
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {ownerStats.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">No activities match the current filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Calls</TableHead>
                    <TableHead className="text-right">Meetings</TableHead>
                    <TableHead className="text-right">Tasks</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Overdue</TableHead>
                    <TableHead className="text-right">Canceled</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerStats.map((stat) => (
                    <TableRow key={stat.ownerId ?? "unassigned"}>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                          onClick={() =>
                            showActivities(
                              `Activities owned by ${stat.ownerId ? getOwnerName(stat.ownerId) : "Unassigned"}`,
                              scopedActivitiesCurrent.filter((activity) => activity.ownerId === stat.ownerId),
                            )
                          }
                        >
                          {stat.ownerId ? getOwnerName(stat.ownerId) : "Unassigned"}
                        </button>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{stat.calls}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.meetings}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.tasks}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.completed}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.overdue}</TableCell>
                      <TableCell className="text-right tabular-nums">{stat.canceled}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stat.completionRate === null ? "—" : `${stat.completionRate.toFixed(0)}%`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
