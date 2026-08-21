"use client";

import { AlertTriangle, CalendarClock, ChevronRight, ListTodo } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn, getInitials } from "@/lib/utils";

import { buildAttentionItems } from "./crm-data/attention-items";
import { filterOpportunities, opportunityRows } from "./crm-data/opportunities";
import { getOwnerName } from "./crm-data/sales-team";
import type { AttentionItem } from "./crm-data/schema";
import { useCrmFilters } from "./crm-filters";

function PriorityDot({ priority }: { priority: AttentionItem["priority"] }) {
  return (
    <span
      className={cn(
        "mt-1.5 size-2 shrink-0 rounded-full",
        priority === "High" && "bg-destructive",
        priority === "Medium" && "bg-amber-500",
        priority === "Low" && "bg-muted-foreground/50",
      )}
      title={`${priority} priority`}
    />
  );
}

function KindIcon({ kind }: { kind: AttentionItem["kind"] }) {
  const Icon = kind === "overdue-activity" || kind === "deal-at-risk" ? AlertTriangle : CalendarClock;
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Icon className="size-4" />
    </div>
  );
}

export function AttentionNeeded() {
  const { window, ownerId } = useCrmFilters();

  const opportunities = filterOpportunities(opportunityRows, window.current, ownerId);
  const items = buildAttentionItems(opportunities, window.current, ownerId).slice(0, 8);

  return (
    <section className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Attention Needed</CardTitle>
          <CardDescription>Overdue activities, stale deals, and follow-ups that require a response.</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              View all
              <ChevronRight data-icon="inline-end" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="flex flex-col">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-b border-border/50 py-3.5 last:border-b-0">
                  <KindIcon kind={item.kind} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-sm">{item.title}</span>
                      <PriorityDot priority={item.priority} />
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {item.companyName}
                      {item.contact ? ` · ${item.contact}` : ""}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      <span className="text-muted-foreground">{item.reason}</span>
                      <span className="font-medium text-foreground">{item.detail}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="size-6">
                        <AvatarFallback className="rounded-md text-[10px]">
                          {getInitials(getOwnerName(item.ownerId))}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{getOwnerName(item.ownerId)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                      {item.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListTodo />
                </EmptyMedia>
                <EmptyTitle>All caught up</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>No attention items match the current period and owner filters.</EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
