"use client";

import { useSortable } from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";

import type { Deal } from "./deals-data/schema";
import { PipelineDealCard } from "./pipeline-deal-card";

interface SortableDealCardProps {
  deal: Deal;
  onMoveToStage?: (deal: Deal, stage: string) => void;
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
}

export function SortableDealCard({
  deal,
  onMoveToStage,
  onChangeStage,
  onMarkWon,
  onMarkLost,
  onEditDeal,
}: SortableDealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { type: "deal", deal },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-30")}
      {...attributes}
      {...listeners}
    >
      <PipelineDealCard
        deal={deal}
        onMoveToStage={onMoveToStage}
        onChangeStage={onChangeStage}
        onMarkWon={onMarkWon}
        onMarkLost={onMarkLost}
        onEditDeal={onEditDeal}
      />
    </div>
  );
}
