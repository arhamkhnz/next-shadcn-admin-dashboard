"use client";

import Link from "next/link";

import { format, parseISO } from "date-fns";
import { CalendarDays, MoreVertical, Trophy, XCircle } from "lucide-react";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type { Deal, DealHealth } from "./deals-data/schema";

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

function isOverdue(deal: Deal): boolean {
  if (!deal.expectedCloseDate) return false;
  const today = new Date(2026, 7, 16);
  return new Date(deal.expectedCloseDate).getTime() < today.getTime();
}

interface PipelineDealCardProps {
  deal: Deal;
  isOverlay?: boolean;
  onMoveToStage?: (deal: Deal, stage: string) => void;
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
}

export function PipelineDealCard({
  deal,
  isOverlay = false,
  onMoveToStage,
  onChangeStage,
  onMarkWon,
  onMarkLost,
  onEditDeal,
}: PipelineDealCardProps) {
  const company = useCompanyStore.getState().getCompanyById(deal.companyId);
  const contact = deal.primaryContactId ? useContactStore.getState().getContactById(deal.primaryContactId) : null;
  const ownerName = deal.ownerId ? getOwnerName(deal.ownerId) : null;
  const overdue = isOverdue(deal);

  const openStages = ["Discovery", "Qualified", "Proposal Sent", "Negotiation"] as const;
  const otherStages = openStages.filter((s) => s !== deal.stage);

  return (
    <article
      className={cn(
        "flex flex-col gap-2.5 rounded-xl border bg-card p-3.5 text-card-foreground shadow-xs transition-shadow hover:shadow-md",
        isOverlay && "w-64 rotate-1 shadow-lg",
        overdue && "border-destructive/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={`/dashboard/crm/deals/${deal.id}`}
            className="line-clamp-1 font-medium text-sm leading-none transition-opacity hover:opacity-80"
          >
            {deal.name}
          </Link>
          {company && <p className="line-clamp-1 text-muted-foreground text-xs leading-none">{company.name}</p>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="-mr-1 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${deal.name}`}
            >
              <MoreVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/crm/deals/${deal.id}`}>View deal</Link>
            </DropdownMenuItem>
            {onEditDeal && <DropdownMenuItem onClick={() => onEditDeal(deal)}>Edit deal</DropdownMenuItem>}
            <DropdownMenuSeparator />
            {otherStages.length > 0 && onMoveToStage && (
              <>
                {otherStages.map((stage) => (
                  <DropdownMenuItem key={stage} onClick={() => onMoveToStage(deal, stage)}>
                    Move to {stage}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {onChangeStage && <DropdownMenuItem onClick={() => onChangeStage(deal)}>Change stage...</DropdownMenuItem>}
            {onMarkWon && (
              <DropdownMenuItem onClick={() => onMarkWon(deal)}>
                <Trophy className="mr-2 size-3.5" />
                Mark Won
              </DropdownMenuItem>
            )}
            {onMarkLost && (
              <DropdownMenuItem onClick={() => onMarkLost(deal)}>
                <XCircle className="mr-2 size-3.5 text-destructive" />
                Mark Lost
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
