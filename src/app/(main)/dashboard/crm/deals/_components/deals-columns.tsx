"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Building2, MoreHorizontal } from "lucide-react";

import { getOwnerName, salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { EditableCustomCell } from "@/components/crm/table-engine/editable-custom-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableField } from "@/lib/crm-table-engine/types";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type { Deal, DealHealth, DealStage } from "./deals-data/schema";

export type DealsColumnsOptions = {
  onEditDeal?: (deal: Deal) => void;
  onChangeStage?: (deal: Deal) => void;
  onMarkWon?: (deal: Deal) => void;
  onMarkLost?: (deal: Deal) => void;
  onReopenDeal?: (deal: Deal) => void;
  onArchiveDeal?: (deal: Deal) => void;
  onRestoreDeal?: (deal: Deal) => void;
  onAssignOwner?: (deal: Deal, ownerId: string) => void;
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

const stageBadgeVariant: Record<DealStage, string> = {
  Discovery: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  Qualified: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "Proposal Sent": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Negotiation: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  "Closed Won": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "Closed Lost": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

const healthBadgeVariant: Record<DealHealth, string> = {
  Healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Attention: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "At Risk": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

function probabilityColor(p: number): string {
  if (p >= 60) return "bg-emerald-500";
  if (p >= 30) return "bg-amber-500";
  return "bg-muted-foreground/30";
}

function DateCell({ value }: { value: string }) {
  return <span className="text-muted-foreground text-sm tabular-nums">{format(parseISO(value), "MMM d, yyyy")}</span>;
}

export function renderDealFieldCell(params: {
  field: TableField;
  deal: Deal;
  onCommitCustomValue: (deal: Deal, field: TableField, value: NonNullable<Deal["customFields"]>[string]) => void;
}) {
  const { field, deal, onCommitCustomValue } = params;

  switch (field.key) {
    case "deal.name":
      return (
        <Link
          href={`/dashboard/crm/deals/${deal.id}`}
          className="truncate font-medium text-foreground text-sm transition-opacity hover:opacity-80"
        >
          {deal.name}
        </Link>
      );
    case "deal.company": {
      const company = useCompanyStore.getState().getCompanyById(deal.companyId);
      if (!company) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/dashboard/crm/companies/${company.id}`}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Avatar className={cn("size-6 font-medium", avatarTone(company.name))}>
            <AvatarFallback>
              <Building2 className="size-3" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm">{company.name}</span>
        </Link>
      );
    }
    case "deal.primaryContact": {
      const contactId = deal.primaryContactId;
      if (!contactId) return <span className="text-muted-foreground text-sm">—</span>;
      const contact = useContactStore.getState().getContactById(contactId);
      if (!contact) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/dashboard/crm/contacts/${contactId}`}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Avatar className={cn("size-6 font-medium", avatarTone(contact.name))}>
            <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{contact.name}</span>
        </Link>
      );
    }
    case "deal.stage":
      return <Badge className={cn("font-medium", stageBadgeVariant[deal.stage])}>{deal.stage}</Badge>;
    case "deal.value":
      return (
        <span className="text-sm tabular-nums">
          {formatCurrency(deal.value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
      );
    case "deal.probability": {
      const p = deal.probability;
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", probabilityColor(p))} style={{ width: `${p}%` }} />
          </div>
          <span className="text-muted-foreground text-xs tabular-nums">{p}%</span>
        </div>
      );
    }
    case "deal.health":
      return <Badge className={cn("font-medium", healthBadgeVariant[deal.health])}>{deal.health}</Badge>;
    case "deal.owner":
      return <OwnerCell ownerId={deal.ownerId ?? null} />;
    case "deal.source":
      return <span className="text-muted-foreground text-sm">{deal.source}</span>;
    case "deal.lastActivity":
      return deal.lastActivityDate ? (
        <DateCell value={deal.lastActivityDate} />
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    case "deal.expectedClose": {
      const d = deal.expectedCloseDate;
      if (!d) return <span className="text-muted-foreground text-sm">—</span>;
      const isOverdue = parseISO(d).getTime() < new Date(2026, 7, 16).getTime();
      return (
        <span
          className={cn("text-sm tabular-nums", isOverdue ? "font-medium text-destructive" : "text-muted-foreground")}
        >
          {format(parseISO(d), "MMM d, yyyy")}
        </span>
      );
    }
    case "deal.createdAt":
      return <DateCell value={deal.createdAt} />;
    default:
      break;
  }

  if (!field.isCore) {
    const isArchivedDeal = Boolean(deal.archivedAt);
    return (
      <EditableCustomCell
        field={field}
        value={deal.customFields?.[field.systemName]}
        disabled={isArchivedDeal}
        disabledReason={isArchivedDeal ? "Archived deals cannot be edited." : undefined}
        onCommit={(value) => onCommitCustomValue(deal, field, value)}
      />
    );
  }

  return null;
}

function OwnerCell({ ownerId }: { ownerId: string | null }) {
  if (!ownerId) return <span className="text-muted-foreground text-sm">Unassigned</span>;
  const name = getOwnerName(ownerId);
  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("size-6 font-medium", avatarTone(name))}>
        <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm">{name}</span>
    </div>
  );
}

export function getDealsSelectColumn(): ColumnDef<Deal> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select all deals"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label={`Select ${row.original.name}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  };
}

export function getDealsActionsColumn(options?: DealsColumnsOptions): ColumnDef<Deal> {
  return {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const isArchived = Boolean(row.original.archivedAt);
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Open actions for ${row.original.name}`}
                className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/crm/deals/${row.original.id}`}>View deal</Link>
              </DropdownMenuItem>
              {!isArchived ? (
                <>
                  <DropdownMenuItem onClick={() => options?.onEditDeal?.(row.original)}>Edit deal</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isOpenStage(row.original.stage) ? (
                    <>
                      <DropdownMenuItem onClick={() => options?.onChangeStage?.(row.original)}>
                        Change stage
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Assign owner</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {salesOwners.map((owner) => (
                            <DropdownMenuItem
                              key={owner.id}
                              onClick={() => options?.onAssignOwner?.(row.original, owner.id)}
                            >
                              {owner.name}
                              {row.original.ownerId === owner.id && (
                                <span className="ml-1 text-muted-foreground text-xs">(current)</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => options?.onMarkWon?.(row.original)}>Mark Won</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => options?.onMarkLost?.(row.original)}>Mark Lost</DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => options?.onReopenDeal?.(row.original)}>
                        Reopen Deal
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Assign owner</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {salesOwners.map((owner) => (
                            <DropdownMenuItem
                              key={owner.id}
                              onClick={() => options?.onAssignOwner?.(row.original, owner.id)}
                            >
                              {owner.name}
                              {row.original.ownerId === owner.id && (
                                <span className="ml-1 text-muted-foreground text-xs">(current)</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => options?.onArchiveDeal?.(row.original)}>
                    Archive
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => options?.onRestoreDeal?.(row.original)}>Restore deal</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  };
}

function isOpenStage(stage: DealStage): boolean {
  return stage !== "Closed Won" && stage !== "Closed Lost";
}
