"use client";

import * as React from "react";

import { Download, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { salesOwners } from "../../_components/crm-data/sales-team";
import { MetricCard } from "./metric-card";
import { buildCsv, buildReportFilename, type CsvCellValue, downloadCsvFile } from "./report-data/csv-export";
import { compareMetric, computeTeamRows } from "./report-data/report-selectors";
import { useReports } from "./reports-context";

export function TeamPerformance() {
  const {
    window,
    activeLeads,
    openDeals,
    closedDealsCurrent,
    closedDealsPrevious,
    scopedActivitiesCurrent,
    scopedActivitiesPrevious,
    ownerFilter,
    setOwnerFilter,
    resetFilters,
  } = useReports();

  const teamRows = React.useMemo(
    () =>
      computeTeamRows({
        owners: salesOwners,
        activeLeads,
        openDeals,
        closedDeals: closedDealsCurrent,
        scopedActivities: scopedActivitiesCurrent,
      }),
    [activeLeads, openDeals, closedDealsCurrent, scopedActivitiesCurrent],
  );

  const previousTeamRows = React.useMemo(
    () =>
      computeTeamRows({
        owners: salesOwners,
        activeLeads,
        openDeals,
        closedDeals: closedDealsPrevious,
        scopedActivities: scopedActivitiesPrevious,
      }),
    [activeLeads, openDeals, closedDealsPrevious, scopedActivitiesPrevious],
  );

  const totals = React.useMemo(
    () => ({
      wonRevenue: teamRows.reduce((sum, row) => sum + row.wonRevenue, 0),
      pipelineValue: teamRows.reduce((sum, row) => sum + row.pipelineValue, 0),
      activitiesCompleted: teamRows.reduce((sum, row) => sum + row.activitiesCompleted, 0),
      overdueTasks: teamRows.reduce((sum, row) => sum + row.overdueTasks, 0),
    }),
    [teamRows],
  );

  const previousTotals = React.useMemo(
    () => ({
      wonRevenue: previousTeamRows.reduce((sum, row) => sum + row.wonRevenue, 0),
      activitiesCompleted: previousTeamRows.reduce((sum, row) => sum + row.activitiesCompleted, 0),
      overdueTasks: previousTeamRows.reduce((sum, row) => sum + row.overdueTasks, 0),
    }),
    [previousTeamRows],
  );

  function selectOwner(ownerId: string) {
    if (ownerFilter === ownerId) {
      resetFilters();
      return;
    }
    setOwnerFilter(ownerId);
  }

  function exportTeamTable() {
    const headers = [
      "Owner",
      "Assigned Leads",
      "Open Deals",
      "Pipeline Value",
      "Won Revenue",
      "Win Rate (%)",
      "Activities Completed",
      "Overdue Tasks",
      "Average Deal Value",
    ];
    const rows: CsvCellValue[][] = teamRows.map((row) => [
      row.name,
      row.assignedLeads,
      row.openDeals,
      row.pipelineValue,
      row.wonRevenue,
      row.winRate === null ? "" : row.winRate.toFixed(1),
      row.activitiesCompleted,
      row.overdueTasks,
      row.averageDealValue === null ? "" : Math.round(row.averageDealValue),
    ]);
    downloadCsvFile(
      buildReportFilename("team-performance", window.current.start, window.current.end),
      buildCsv(headers, rows),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Team Won Revenue"
          value={`$${Math.round(totals.wonRevenue / 1000)}k`}
          caption={`Closed ${window.label}`}
          comparison={compareMetric(totals.wonRevenue, previousTotals.wonRevenue)}
        />
        <MetricCard
          label="Team Pipeline Value"
          value={`$${Math.round(totals.pipelineValue / 1000)}k`}
          caption="Open deals · current snapshot"
        />
        <MetricCard
          label="Activities Completed"
          value={String(totals.activitiesCompleted)}
          caption={window.label}
          comparison={compareMetric(totals.activitiesCompleted, previousTotals.activitiesCompleted)}
        />
        <MetricCard label="Overdue Tasks" value={String(totals.overdueTasks)} caption="Task-type activities past due" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Owner performance</CardTitle>
          <CardDescription>
            Per-owner results from the shared leads, deals, and activities stores. Select an owner to focus every report
            section on their records; select again to clear.
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={exportTeamTable}>
              <Download className="size-3" />
              Export CSV
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {ownerFilter !== "all" ? (
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <UserRound className="size-3" />
                Filtered to {salesOwners.find((owner) => owner.id === ownerFilter)?.name ?? ownerFilter}
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
                Clear
              </Button>
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Assigned Leads</TableHead>
                  <TableHead className="text-right">Open Deals</TableHead>
                  <TableHead className="text-right">Pipeline Value</TableHead>
                  <TableHead className="text-right">Won Revenue</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Activities Completed</TableHead>
                  <TableHead className="text-right">Overdue Tasks</TableHead>
                  <TableHead className="text-right">Average Deal Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamRows.map((row) => {
                  const isSelected = ownerFilter === row.ownerId;
                  return (
                    <TableRow
                      key={row.ownerId}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(isSelected && "bg-muted/50")}
                    >
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
                          onClick={() => selectOwner(row.ownerId)}
                          aria-pressed={isSelected}
                        >
                          {row.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{row.assignedLeads}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.openDeals}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        ${Math.round(row.pipelineValue / 1000)}k
                      </TableCell>
                      <TableCell className="text-right tabular-nums">${Math.round(row.wonRevenue / 1000)}k</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.winRate === null ? "—" : `${row.winRate.toFixed(0)}%`}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{row.activitiesCompleted}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.overdueTasks}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.averageDealValue === null ? "—" : `$${Math.round(row.averageDealValue / 1000)}k`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-muted-foreground text-xs">
            Assigned leads and pipeline values are current snapshots; won revenue, win rate, and activity counts cover{" "}
            {window.label}. Owners without decided deals show no win rate instead of a fabricated one.
          </p>
        </CardContent>
      </Card>

      <p className="sr-only">
        Team performance covers {window.label}. Use the owner buttons in the table to filter all report sections.
      </p>
    </div>
  );
}
