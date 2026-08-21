"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, getInitials } from "@/lib/utils";

import { activitiesScheduledInWindow, computeTeamRows } from "../../reports/_components/report-data/report-selectors";
import { currentSalesOwnerId, salesOwners } from "../crm-data/sales-team";
import { useOverviewFilters } from "./overview-filters";

export function TeamSnapshot() {
  const { activeLeads, openDeals, closedDealsCurrent, scopedActivities, window, ownerId } = useOverviewFilters();

  const rows = useMemo(() => {
    const owners = ownerId ? salesOwners.filter((owner) => owner.id === ownerId) : salesOwners;
    return computeTeamRows({
      owners,
      activeLeads,
      openDeals,
      closedDeals: closedDealsCurrent,
      scopedActivities: activitiesScheduledInWindow(scopedActivities, window.current),
    });
  }, [activeLeads, closedDealsCurrent, openDeals, ownerId, scopedActivities, window]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Team snapshot
          <Badge variant="secondary">{rows.length}</Badge>
        </CardTitle>
        <CardDescription>
          Load per owner for the selected period · leads and pipeline are live snapshots.
        </CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/crm/reports">Full report</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No owners match the filter</EmptyTitle>
              <EmptyDescription>Reset the owner filter to see the whole team.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Open deals</TableHead>
                  <TableHead className="text-right">Pipeline</TableHead>
                  <TableHead className="text-right">Won revenue</TableHead>
                  <TableHead className="text-right">Activities done</TableHead>
                  <TableHead className="text-right">Overdue tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ownerId}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-[10px]">{getInitials(row.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {row.ownerId === currentSalesOwnerId ? `${row.name} (me)` : row.name}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.assignedLeads}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.openDeals}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(row.pipelineValue)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(row.wonRevenue)}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.activitiesCompleted}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.overdueTasks > 0 ? (
                        <Badge variant="destructive" className="tabular-nums">
                          {row.overdueTasks}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
