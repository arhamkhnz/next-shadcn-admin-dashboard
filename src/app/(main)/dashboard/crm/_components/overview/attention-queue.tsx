"use client";

import { useMemo } from "react";

import Link from "next/link";

import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getInitials } from "@/lib/utils";

import { getOwnerName } from "../crm-data/sales-team";
import { useOverviewFilters } from "./overview-filters";
import { type AttentionItem, buildAttentionQueue } from "./overview-selectors";

const MAX_VISIBLE = 8;

const tierLabels: Record<AttentionItem["tier"], string> = {
  0: "Urgent",
  1: "Overdue",
  2: "Past due",
  3: "Due today",
  4: "Unassigned",
  5: "Coming up",
  6: "Stalled",
  7: "Cooling",
};

const tierBadgeVariants: Record<AttentionItem["tier"], "destructive" | "outline" | "secondary"> = {
  0: "destructive",
  1: "outline",
  2: "outline",
  3: "secondary",
  4: "secondary",
  5: "secondary",
  6: "outline",
  7: "outline",
};

function OwnerAvatar({ ownerId }: { ownerId: string | null }) {
  if (!ownerId) {
    return (
      <span
        role="img"
        aria-label="Unassigned"
        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-muted-foreground/50 border-dashed text-[10px] text-muted-foreground"
      >
        ?
      </span>
    );
  }
  const name = getOwnerName(ownerId);
  return (
    <Avatar className="size-6">
      <AvatarFallback className="text-[10px]">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

export function AttentionQueue() {
  const { scopedActivities, openDeals, activeLeads } = useOverviewFilters();

  const items = useMemo(
    () => buildAttentionQueue({ scopedActivities, openDeals, activeLeads }),
    [scopedActivities, openDeals, activeLeads],
  );

  const visible = items.slice(0, MAX_VISIBLE);
  const remaining = items.length - visible.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Attention required
          {items.length > 0 ? <Badge variant="destructive">{items.length}</Badge> : null}
        </CardTitle>
        <CardDescription>Prioritized across overdue work, at-risk deals, and neglected records.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleCheck />
              </EmptyMedia>
              <EmptyTitle>You are all caught up</EmptyTitle>
              <EmptyDescription>No overdue work, stalled deals, or neglected leads right now.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <ul className="flex flex-col divide-y">
              {visible.map((item) => (
                <li key={item.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
                  <Badge variant={tierBadgeVariants[item.tier]} className="w-[86px] justify-center">
                    {tierLabels[item.tier]}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{item.title}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {item.reason}
                      {item.dateLabel ? ` · ${item.dateLabel}` : ""}
                      {item.entityType === "Task" || item.entityType === "Activity" ? ` · ${item.entityType}` : ""}
                    </p>
                  </div>
                  <OwnerAvatar ownerId={item.ownerId} />
                  <Button asChild variant="ghost" size="sm">
                    <Link href={item.href}>
                      {item.actionLabel}
                      <ArrowRight />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
            {remaining > 0 ? (
              <p className="mt-3 flex items-center gap-1.5 text-muted-foreground text-xs" role="status">
                <CircleAlert className="size-3.5" aria-hidden="true" />
                {remaining} more item{remaining === 1 ? "" : "s"} waiting beyond the top {MAX_VISIBLE}.
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
