"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ArrowRight, Handshake } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { getOwnerName } from "../crm-data/sales-team";
import { useOverviewFilters } from "./overview-filters";
import { buildDealsRequiringAttention } from "./overview-selectors";

export function DealsAttention() {
  const { openDeals, names } = useOverviewFilters();
  const rows = useMemo(
    () => buildDealsRequiringAttention({ openDeals, companyNames: names.companyNameById }),
    [openDeals, names],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Deals requiring attention
          {rows.length > 0 ? <Badge variant="secondary">{rows.length}</Badge> : null}
        </CardTitle>
        <CardDescription>
          Past-due close dates, at-risk health, stalled momentum, and missing next steps.
        </CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/crm/deals">
              All deals
              <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Handshake />
              </EmptyMedia>
              <EmptyTitle>Pipeline looks healthy</EmptyTitle>
              <EmptyDescription>No open deals are overdue, stalled, or missing next steps.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y">
            {rows.map((row) => (
              <li key={row.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">
                    <Link href={row.detailHref} className="hover:underline">
                      {row.name}
                    </Link>
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {row.stage}
                    {row.companyName ? ` · ${row.companyName}` : ""} ·{" "}
                    {row.ownerId ? getOwnerName(row.ownerId) : "Unassigned"}
                  </p>
                </div>
                <span className="font-medium text-sm tabular-nums">{row.valueLabel}</span>
                <Badge variant={row.severity === 0 ? "destructive" : "outline"} className="max-w-[220px] truncate">
                  {row.reason}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
