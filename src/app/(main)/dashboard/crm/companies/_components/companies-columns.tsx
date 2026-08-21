"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Building2, ExternalLink, MoreHorizontal } from "lucide-react";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { useContactStore } from "@/app/(main)/dashboard/crm/contacts/_components/contacts-data/use-contact-store";
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
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type { Company } from "./companies-data/schema";

export type CompaniesColumnsOptions = {
  onArchiveCompany?: (company: Company) => void;
  onRestoreCompany?: (company: Company) => void;
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

export function getCompaniesColumns(options?: CompaniesColumnsOptions): ColumnDef<Company>[] {
  return [
    {
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
    },
    {
      id: "search",
      accessorFn: (row) => `${row.name} ${row.domain ?? ""} ${row.industry} ${row.location ?? ""} ${row.website ?? ""}`,
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: "Company",
      cell: ({ row }) => (
        <CompanyNameCell name={row.original.name} domain={row.original.domain} companyId={row.original.id} />
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.industry}</span>,
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => {
        const website = row.original.website;
        if (!website) return <span className="text-muted-foreground text-sm">—</span>;
        return (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-3 shrink-0" />
            <span className="max-w-[140px] truncate">{website.replace(/^https?:\/\//, "")}</span>
          </a>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.location ?? "—"}</span>,
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => <span className="text-muted-foreground text-sm tabular-nums">{row.original.size}</span>,
    },
    {
      id: "primaryContact",
      header: "Primary Contact",
      cell: ({ row }) => {
        const primaryContactId = row.original.primaryContactId;
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
      },
    },
    {
      accessorKey: "ownerId",
      header: "Owner",
      filterFn: "equalsString",
      cell: ({ row }) => {
        const ownerId = row.original.ownerId;
        if (!ownerId) {
          return <span className="text-muted-foreground text-sm">Unassigned</span>;
        }
        const name = getOwnerName(ownerId);
        return (
          <div className="flex items-center gap-2">
            <Avatar className={cn("font-medium", avatarTone(name))}>
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "openDealCount",
      header: "Open Deals",
      cell: ({ row }) => {
        const count = row.original.openDealCount;
        return <span className="text-sm tabular-nums">{count}</span>;
      },
    },
    {
      accessorKey: "openPipelineValue",
      header: "Pipeline Value",
      cell: ({ row }) => {
        const value = row.original.openPipelineValue;
        if (!value) return <span className="text-muted-foreground text-sm">—</span>;
        return (
          <span className="text-sm tabular-nums">
            {formatCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        );
      },
    },
    {
      accessorKey: "lastActivity",
      header: "Last Activity",
      cell: ({ row }) => {
        const lastActivity = row.original.lastActivity;
        if (!lastActivity) return <span className="text-muted-foreground text-sm">—</span>;
        return (
          <span className="text-muted-foreground text-sm tabular-nums">
            {format(parseISO(lastActivity), "MMM d, yyyy")}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {format(parseISO(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
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
                <DropdownMenuItem
                  onClick={() => {
                    window.location.href = `/dashboard/crm/companies/${row.original.id}`;
                  }}
                >
                  View company
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
    },
  ];
}

export function getCompaniesColumnsDefault(): ColumnDef<Company>[] {
  return getCompaniesColumns();
}

export const companiesColumns: ColumnDef<Company>[] = getCompaniesColumnsDefault();
