"use client";

import { useSortable } from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";

import { DealCard } from "./deal-card";
import type { ColumnId, Deal } from "./types";

export function SortableDealCard({ deal, columnId }: { deal: Deal; columnId: ColumnId }) {
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
      <DealCard deal={deal} columnId={columnId} />
    </div>
  );
}
