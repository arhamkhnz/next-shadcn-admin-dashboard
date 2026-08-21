"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ArrowRight, UserRoundSearch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { getOwnerName } from "../crm-data/sales-team";
import { useOverviewFilters } from "./overview-filters";
import { buildLeadsNeedingFollowUp } from "./overview-selectors";

export function LeadFollowup() {
  const { activeLeads } = useOverviewFilters();
  const rows = useMemo(() => buildLeadsNeedingFollowUp({ activeLeads }), [activeLeads]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Leads needing follow-up
          {rows.length > 0 ? <Badge variant="secondary">{rows.length}</Badge> : null}
        </CardTitle>
        <CardDescription>Overdue follow-ups, unassigned leads, and hot leads losing momentum.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/crm/leads">
              All leads
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
                <UserRoundSearch />
              </EmptyMedia>
              <EmptyTitle>Follow-ups are on track</EmptyTitle>
              <EmptyDescription>No overdue follow-ups or neglected hot leads right now.</EmptyDescription>
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
                    {row.company ?? "No company"} · {row.ownerId ? getOwnerName(row.ownerId) : "Unassigned"}
                  </p>
                </div>
                <Badge variant={row.score >= 75 ? "default" : "secondary"} className="tabular-nums">
                  Score {row.score}
                </Badge>
                <Badge variant={row.severity === 0 ? "destructive" : "outline"} className="max-w-[240px] truncate">
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
