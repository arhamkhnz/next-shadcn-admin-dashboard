"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Building2, ExternalLink, MoreHorizontal } from "lucide-react";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
import { EditableCustomCell } from "@/components/crm/table-engine/editable-custom-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableField } from "@/lib/crm-table-engine/types";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type { Company } from "./companies-data/schema";

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

function CompanyNameCell({ name, domain, companyId }: { name: string; domain?: string | null; companyId: string }) {
  return (
    <Link
      href={`/dashboard/crm/companies/${companyId}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <Avatar className={cn("font-medium", avatarTone(name))}>
        <AvatarFallback>
          <Building2 className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground text-sm">{name}</div>
        {domain ? (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <ExternalLink className="size-3 shrink-0" />
            <span className="truncate">{domain}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function DateCell({ value }: { value: string }) {
  return <span className="text-muted-foreground text-sm tabular-nums">{format(parseISO(value), "MMM d, yyyy")}</span>;
}

export function renderCompanyFieldCell(params: {
  field: TableField;
  company: Company;
  onCommitCustomValue: (
    company: Company,
    field: TableField,
    value: NonNullable<Company["customFields"]>[string],
  ) => void;
}) {
  const { field, company, onCommitCustomValue } = params;

  switch (field.key) {
    case "company.name":
      return <CompanyNameCell name={company.name} domain={company.domain} companyId={company.id} />;
    case "company.industry":
      return <span className="text-muted-foreground text-sm">{company.industry}</span>;
    case "company.website":
      return company.website ? (
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ExternalLink className="size-3 shrink-0" />
          <span className="max-w-[140px] truncate">{company.website.replace(/^https?:\/\//, "")}</span>
        </a>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    case "company.location":
      return <span className="text-muted-foreground text-sm">{company.location ?? "—"}</span>;
    case "company.size":
      return <span className="text-muted-foreground text-sm tabular-nums">{company.size}</span>;
    case "company.type":
      return <span className="text-muted-foreground text-sm">{company.type}</span>;
    case "company.primaryContact": {
      const primaryContactId = company.primaryContactId;
      if (!primaryContactId) return <span className="text-muted-foreground text-sm">—</span>;
      const contact = useContactStore.getState().getContactById(primaryContactId);
      if (!contact) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/dashboard/crm/contacts/${primaryContactId}`}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Avatar className={cn("size-6 font-medium", avatarTone(contact.name))}>
            <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{contact.name}</span>
        </Link>
      );
    }
    case "company.owner": {
      const ownerId = company.ownerId;
      if (!ownerId) {
        return <span className="text-muted-foreground text-sm">Unassigned</span>;
      }
      const name = getOwnerName(ownerId);
      return (
        <div className="flex items-center gap-2">
          <Avatar className={cn("font-medium", avatarTone(name))}>
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm">{name}</span>
        </div>
      );
    }
    case "company.openDeals":
      return <span className="text-sm tabular-nums">{company.openDealCount}</span>;
    case "company.pipelineValue": {
      const value = company.openPipelineValue;
      if (!value) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <span className="text-sm tabular-nums">
          {formatCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
      );
    }
    case "company.lastActivity":
      return company.lastActivity ? (
        <span className="text-muted-foreground text-sm tabular-nums">
          {format(parseISO(company.lastActivity), "MMM d, yyyy")}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    case "company.createdAt":
      return <DateCell value={company.createdAt} />;
    default:
      break;
  }

  if (!field.isCore) {
    const isArchivedCompany = Boolean(company.archivedAt);
    return (
      <EditableCustomCell
        field={field}
        value={company.customFields?.[field.systemName]}
        disabled={isArchivedCompany}
        disabledReason={isArchivedCompany ? "Archived companies cannot be edited." : undefined}
        onCommit={(value) => onCommitCustomValue(company, field, value)}
      />
    );
  }

  return null;
}

export function getCompaniesSelectColumn(): ColumnDef<Company> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select all companies"
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

export type CompaniesColumnsOptions = {
  onArchiveCompany?: (company: Company) => void;
  onRestoreCompany?: (company: Company) => void;
};

export function getCompaniesActionsColumn(options?: CompaniesColumnsOptions): ColumnDef<Company> {
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
                <Link href={`/dashboard/crm/companies/${row.original.id}`}>View company</Link>
              </DropdownMenuItem>
              {!isArchived ? (
                <>
                  <DropdownMenuItem disabled>Edit company (coming soon)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>Assign owner (coming soon)</DropdownMenuItem>
                  <DropdownMenuItem disabled>Add tag (coming soon)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => options?.onArchiveCompany?.(row.original)}>
                    Archive
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => options?.onRestoreCompany?.(row.original)}>
                  Restore company
                </DropdownMenuItem>
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
