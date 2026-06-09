"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

import { SortableDealCard } from "./sortable-deal-card";
import type { columns, Deal } from "./types";
import { getColumnTotal } from "./utils";

interface KanbanColumnProps {
  column: (typeof columns)[number];
  deals: Deal[];
}

export function KanbanColumn({ column, deals }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-0 flex-col rounded-xl border bg-background/70 transition-colors",
        isOver && "bg-muted/70",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={cn("truncate font-semibold text-base", column.accent)}>{column.title}</h2>
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full font-medium text-xs",
                column.countTone,
              )}
            >
              {deals.length}
            </span>
          </div>
          <p className="mt-2 font-medium text-muted-foreground text-sm">
            {formatCurrency(getColumnTotal(deals), { noDecimals: true })}
          </p>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Button variant="ghost" size="icon-sm" aria-label={`Add deal to ${column.title}`}>
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`${column.title} column actions`}>
            <MoreHorizontal />
          </Button>
        </div>
      </div>

      <SortableContext items={deals.map((deal) => deal.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3">
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} columnId={column.id} />
          ))}
          <Button
            variant="outline"
            className="h-12 shrink-0 border-dashed bg-background/40 text-muted-foreground hover:bg-muted/70"
          >
            <Plus data-icon="inline-start" />
            Add deal
          </Button>
        </div>
      </SortableContext>
    </section>
  );
}
