"use client";

import { CalendarDays, CircleCheck, FileText, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

import { tagTones } from "./data";
import type { ColumnId, Deal } from "./types";

export function DealCard({
  deal,
  columnId,
  isOverlay = false,
}: {
  deal: Deal;
  columnId?: ColumnId;
  isOverlay?: boolean;
}) {
  const isWon = columnId === "won";
  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-4 text-card-foreground shadow-xs",
        isOverlay && "w-[272px] rotate-1 shadow-lg",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg border border-foreground/10 font-semibold text-sm",
            deal.logoTone,
          )}
        >
          {deal.logo}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-sm leading-5">{deal.company}</h3>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-5">{deal.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm">
        <span className="font-semibold text-base">{formatCurrency(deal.amount, { noDecimals: true })}</span>
        <span className="h-4 w-px bg-border" />
        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="size-4" />
          <span className="truncate">{deal.date}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {deal.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn("rounded-md border-transparent px-2 font-medium", tagTones[tag])}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center border-t pt-3">
        {isWon ? (
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 text-sm dark:text-emerald-300">
            <CircleCheck className="size-4" />
            Won
          </div>
        ) : (
          <div className="flex items-center gap-5 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="size-4" />
              {deal.comments}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="size-4" />
              {deal.files}
            </span>
          </div>
        )}
        <Avatar size="sm" className="ml-auto">
          <AvatarFallback className={cn("font-semibold text-[10px]", deal.assigneeTone)}>
            {deal.assignee}
          </AvatarFallback>
        </Avatar>
      </div>
    </article>
  );
}
