"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { cn, formatCurrency } from "@/lib/utils";

import type { Deal, DealStage } from "./deals-data/schema";
import { SortableDealCard } from "./sortable-deal-card";

const stageColumnColors: Record<DealStage, string> = {
  Discovery: "border-t-sky-500",
  Qualified: "border-t-violet-500",
  "Proposal Sent": "border-t-amber-500",
  Negotiation: "border-t-orange-500",
  "Closed Won": "border-t-emerald-500",
  "Closed Lost": "border-t-rose-500",
};

interface PipelineColumnProps {
  stage: DealStage;
  deals: Deal[];
  onMoveToStage?: (deal: Deal, stage: string) => void;
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
}

export function PipelineColumn({
  stage,
  deals,
  onMoveToStage,
  onChangeStage,
  onMarkWon,
  onMarkLost,
  onEditDeal,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <section
      className={cn(
        "flex min-h-0 min-w-64 flex-col rounded-t-xl border border-t-2 bg-muted/30 transition-colors",
        stageColumnColors[stage],
        isOver && "bg-muted/60",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <div className="min-w-0 space-y-0.5">
          <h2 className="truncate font-medium text-sm leading-none">{stage}</h2>
          <p className="text-muted-foreground text-xs tabular-nums leading-none">
            {deals.length} {deals.length === 1 ? "deal" : "deal"}
          </p>
        </div>
        <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
          {formatCurrency(totalValue, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
      </div>

      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="scrollbar-thin flex min-h-12 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1"
        >
          {deals.map((deal) => (
            <SortableDealCard
              key={deal.id}
              deal={deal}
              onMoveToStage={onMoveToStage}
              onChangeStage={onChangeStage}
              onMarkWon={onMarkWon}
              onMarkLost={onMarkLost}
              onEditDeal={onEditDeal}
            />
          ))}
          {deals.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-muted-foreground text-xs">
              No deals in this stage
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
