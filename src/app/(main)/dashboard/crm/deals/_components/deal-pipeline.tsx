"use client";

import * as React from "react";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { format, parseISO } from "date-fns";
import { CalendarDays, GripVertical } from "lucide-react";

import { currentSalesOwnerId, getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type { Deal, DealHealth, DealStage } from "./deals-data/schema";
import { useDealStore } from "./deals-data/use-deal-store";
import { PipelineColumn } from "./pipeline-column";

const openStages: readonly DealStage[] = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"];

const stageOrder: readonly DealStage[] = [
  "Discovery",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const stageProbabilityDefaults: Record<DealStage, number> = {
  Discovery: 15,
  Qualified: 35,
  "Proposal Sent": 60,
  Negotiation: 80,
  "Closed Won": 100,
  "Closed Lost": 0,
};

const healthBadgeVariant: Record<DealHealth, string> = {
  Healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Attention: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "At Risk": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

function avatarTone(name: string) {
  const tones = [
    "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700 dark:[&_[data-slot=avatar-fallback]]:bg-amber-500/15 dark:[&_[data-slot=avatar-fallback]]:text-amber-300",
    "[&_[data-slot=avatar-fallback]]:bg-orange-100 [&_[data-slot=avatar-fallback]]:text-orange-700 dark:[&_[data-slot=avatar-fallback]]:bg-orange-500/15 dark:[&_[data-slot=avatar-fallback]]:text-orange-300",
    "[&_[data-slot=avatar-fallback]]:bg-rose-100 [&_[data-slot=avatar-fallback]]:text-rose-700 dark:[&_[data-slot=avatar-fallback]]:bg-rose-500/15 dark:[&_[data-slot=avatar-fallback]]:text-rose-300",
    "[&_[data-slot=avatar-fallback]]:bg-pink-100 [&_[data-slot=avatar-fallback]]:text-pink-700 dark:[&_[data-slot=avatar-fallback]]:bg-pink-500/15 dark:[&_[data-slot=avatar-fallback]]:text-pink-300",
    "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700 dark:[&_[data-slot=avatar-fallback]]:bg-purple-500/15 dark:[&_[data-slot=avatar-fallback]]:text-purple-300",
    "[&_[data-slot=avatar-fallback]]:bg-violet-100 [&_[data-slot=avatar-fallback]]:text-violet-700 dark:[&_[data-slot=avatar-fallback]]:bg-violet-500/15 dark:[&_[data-slot=avatar-fallback]]:text-violet-300",
    "[&_[data-slot=avatar-fallback]]:bg-indigo-100 [&_[data-slot=avatar-fallback]]:text-indigo-700 dark:[&_[data-slot=avatar-fallback]]:bg-indigo-500/15 dark:[&_[data-slot=avatar-fallback]]:text-indigo-300",
    "[&_[data-slot=avatar-fallback]]:bg-sky-100 [&_[data-slot=avatar-fallback]]:text-sky-700 dark:[&_[data-slot=avatar-fallback]]:bg-sky-500/15 dark:[&_[data-slot=avatar-fallback]]:text-sky-300",
    "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700 dark:[&_[data-slot=avatar-fallback]]:bg-emerald-500/15 dark:[&_[data-slot=avatar-fallback]]:text-emerald-300",
    "[&_[data-slot=avatar-fallback]]:bg-teal-100 [&_[data-slot=avatar-fallback]]:text-teal-700 dark:[&_[data-slot=avatar-fallback]]:bg-teal-500/15 dark:[&_[data-slot=avatar-fallback]]:text-teal-300",
  ];
  return tones[name.length % tones.length];
}

function isForwardMove(from: DealStage, to: DealStage): boolean {
  return stageOrder.indexOf(to) > stageOrder.indexOf(from);
}

function isOverdue(deal: Deal): boolean {
  if (!deal.expectedCloseDate) return false;
  const today = new Date(2026, 7, 16);
  return new Date(deal.expectedCloseDate).getTime() < today.getTime();
}

function generateActivityId(): string {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function groupByStage(deals: Deal[]): Map<DealStage, Deal[]> {
  const grouped = new Map<DealStage, Deal[]>();
  for (const stage of openStages) {
    grouped.set(stage, []);
  }
  for (const deal of deals) {
    const stageGroup = grouped.get(deal.stage);
    if (stageGroup) {
      stageGroup.push(deal);
    }
  }
  return grouped;
}

function getOverlayCardData(deal: Deal) {
  const company = useCompanyStore.getState().getCompanyById(deal.companyId);
  const contact = deal.primaryContactId ? useContactStore.getState().getContactById(deal.primaryContactId) : null;
  const ownerName = deal.ownerId ? getOwnerName(deal.ownerId) : null;
  const overdue = isOverdue(deal);

  return { company, contact, ownerName, overdue };
}

interface DealPipelineProps {
  deals: Deal[];
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
}

export function DealPipeline({ deals, onChangeStage, onMarkWon, onMarkLost, onEditDeal }: DealPipelineProps) {
  const updateDeal = useDealStore((s) => s.updateDeal);
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const groupedDeals = React.useMemo(() => groupByStage(deals), [deals]);

  function handleDragStart(event: DragStartEvent) {
    const deal = event.active.data.current?.deal as Deal | undefined;
    if (deal) setActiveDeal(deal);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const deal = active.data.current?.deal as Deal | undefined;
    if (!deal) return;

    let targetStage: DealStage | null = null;

    if (openStages.includes(over.id as DealStage)) {
      targetStage = over.id as DealStage;
    } else if (over.data.current?.deal) {
      targetStage = (over.data.current.deal as Deal).stage;
    }

    if (!targetStage || deal.stage === targetStage) return;

    if (isForwardMove(deal.stage, targetStage)) {
      const now = new Date().toISOString();
      updateDeal(deal.id, {
        stage: targetStage,
        probability: stageProbabilityDefaults[targetStage],
        updatedAt: now,
        activities: [
          ...deal.activities,
          {
            id: generateActivityId(),
            type: "status_change",
            title: `Stage changed from ${deal.stage} to ${targetStage}`,
            date: now,
            createdBy: currentSalesOwnerId,
          },
        ],
      });
    } else {
      if (onChangeStage) onChangeStage(deal);
    }
  }

  function handleMoveToStage(deal: Deal, stage: string) {
    const targetStage = stage as DealStage;

    if (isForwardMove(deal.stage, targetStage)) {
      const now = new Date().toISOString();
      updateDeal(deal.id, {
        stage: targetStage,
        probability: stageProbabilityDefaults[targetStage],
        updatedAt: now,
        activities: [
          ...deal.activities,
          {
            id: generateActivityId(),
            type: "status_change",
            title: `Stage changed from ${deal.stage} to ${targetStage}`,
            date: now,
            createdBy: currentSalesOwnerId,
          },
        ],
      });
    } else if (onChangeStage) {
      onChangeStage(deal);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="scrollbar-thin flex gap-4 overflow-x-auto px-1 pb-4 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-2">
        {openStages.map((stage) => (
          <PipelineColumn
            key={stage}
            stage={stage}
            deals={groupedDeals.get(stage) ?? []}
            onMoveToStage={handleMoveToStage}
            onChangeStage={onChangeStage}
            onMarkWon={onMarkWon}
            onMarkLost={onMarkLost}
            onEditDeal={onEditDeal}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>{activeDeal && <OverlayCard deal={activeDeal} />}</DragOverlay>
    </DndContext>
  );
}

function OverlayCard({ deal }: { deal: Deal }) {
  const { company, contact, ownerName, overdue } = getOverlayCardData(deal);

  return (
    <article
      className={cn(
        "flex w-64 rotate-2 flex-col gap-2.5 rounded-xl border bg-card p-3.5 text-card-foreground shadow-xl",
        overdue && "border-destructive/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="line-clamp-1 font-medium text-sm leading-none">{deal.name}</p>
          {company && <p className="line-clamp-1 text-muted-foreground text-xs leading-none">{company.name}</p>}
        </div>
        <GripVertical className="size-3.5 shrink-0 text-muted-foreground/40" />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm tabular-nums">
          {formatCurrency(deal.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <Badge className={cn("rounded-md px-1.5 font-medium text-[10px]", healthBadgeVariant[deal.health])}>
          {deal.health}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {ownerName && (
            <>
              <Avatar className={cn("size-4", avatarTone(ownerName))}>
                <AvatarFallback className="text-[8px]">{getInitials(ownerName)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-muted-foreground text-xs">{ownerName}</span>
            </>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-1 text-muted-foreground text-xs">
          {deal.expectedCloseDate && (
            <span className={cn("flex items-center gap-0.5", overdue && "font-medium text-destructive")}>
              {format(parseISO(deal.expectedCloseDate), "MMM d")}
              <CalendarDays className="size-3" />
            </span>
          )}
        </div>
      </div>

      {contact && <p className="truncate text-muted-foreground text-xs leading-none">{contact.name}</p>}
    </article>
  );
}
