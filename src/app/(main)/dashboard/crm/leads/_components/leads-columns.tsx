"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { CheckCircle2, Clock, MoreHorizontal, XCircle } from "lucide-react";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

import type { Lead, LeadScoreClassification, LeadStatus } from "./leads-data/schema";

const today = new Date(2026, 7, 16);

export type LeadsColumnsOptions = {
  onEditLead?: (lead: Lead) => void;
  onArchiveLead?: (lead: Lead) => void;
  onRestoreLead?: (lead: Lead) => void;
};

const statusMeta: Record<LeadStatus, { badgeClass: string; dotClass: string }> = {
  New: {
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  Contacted: {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  Qualified: {
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Unqualified: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Nurturing: {
    badgeClass:
      "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
    dotClass: "bg-purple-500",
  },
};

const classificationMeta: Record<LeadScoreClassification, { badgeClass: string; dotClass: string }> = {
  Hot: {
    badgeClass: "border-red-200 bg-red-500/10 text-red-700 dark:border-red-900/40 dark:bg-red-500/15 dark:text-red-300",
    dotClass: "bg-red-500",
  },
  Warm: {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  Cold: {
    badgeClass: "border-sky-200 bg-sky-500/10 text-sky-700 dark:border-sky-900/40 dark:bg-sky-500/15 dark:text-sky-300",
    dotClass: "bg-sky-500",
  },
};

export function getScoreClassification(score: number): LeadScoreClassification {
  if (score >= 75) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}

export function getFollowUpState(nextActivity: string | null): "Overdue" | "Due Today" | "Upcoming" | "Not Scheduled" {
  if (!nextActivity) return "Not Scheduled";
  const diff = differenceInCalendarDays(parseISO(nextActivity), today);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due Today";
  return "Upcoming";
}

function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr);
  const diff = differenceInCalendarDays(today, date);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return format(date, "MMM d");
}

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

function LeadNameCell({ name, jobTitle, leadId }: { name: string; jobTitle?: string; leadId: string }) {
  return (
    <Link
      href={`/dashboard/crm/leads/${leadId}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <Avatar className={cn("font-medium", avatarTone(name))}>
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground text-sm">{name}</div>
        {jobTitle ? <div className="truncate text-muted-foreground text-xs">{jobTitle}</div> : null}
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const classification = getScoreClassification(score);
  const meta = classificationMeta[classification];
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm tabular-nums">{score}</span>
      <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
        <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
        {classification}
      </Badge>
    </div>
  );
}

function FollowUpBadge({ nextActivity }: { nextActivity: string | null }) {
  const state = getFollowUpState(nextActivity);

  const meta: Record<string, { badgeClass: string; icon: typeof CheckCircle2 | null }> = {
    Overdue: {
      badgeClass: "border-destructive/20 bg-destructive/10 text-destructive",
      icon: XCircle,
    },
    "Due Today": {
      badgeClass:
        "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
      icon: Clock,
    },
    Upcoming: {
      badgeClass:
        "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
      icon: CheckCircle2,
    },
    "Not Scheduled": {
      badgeClass: "border-border bg-muted/50 text-muted-foreground",
      icon: null,
    },
  };

  const config = meta[state];
  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", config.badgeClass)} variant="outline">
      {Icon ? <Icon className="size-3" /> : null}
      {state}
    </Badge>
  );
}

export function getLeadsColumns(options?: LeadsColumnsOptions): ColumnDef<Lead>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            aria-label="Select all leads"
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
      accessorFn: (row) => `${row.name} ${row.company ?? ""} ${row.email} ${row.phone ?? ""}`,
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: "Lead",
      cell: ({ row }) => (
        <LeadNameCell name={row.original.name} jobTitle={row.original.jobTitle} leadId={row.original.id} />
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.company ?? "Not provided"}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="min-w-0 text-sm">
          <div className="truncate text-foreground">{row.original.email}</div>
          {row.original.phone ? (
            <div className="truncate text-muted-foreground text-xs">{row.original.phone}</div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge className="rounded-full px-2.5 font-medium" variant="outline">
          {row.original.source}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => <ScoreBadge score={row.original.score} />,
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
      id: "lastActivity",
      accessorFn: (row) => parseISO(row.lastActivity).getTime(),
      header: "Last Activity",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatRelativeDate(row.original.lastActivity)}
        </span>
      ),
    },
    {
      id: "nextActivity",
      accessorFn: (row) => {
        if (!row.nextActivity) return 0;
        return parseISO(row.nextActivity).getTime();
      },
      header: "Next Activity",
      cell: ({ row }) => <FollowUpBadge nextActivity={row.original.nextActivity} />,
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
                    window.location.href = `/dashboard/crm/leads/${row.original.id}`;
                  }}
                >
                  View lead
                </DropdownMenuItem>
                {!isArchived ? (
                  <>
                    <DropdownMenuItem onClick={() => options?.onEditLead?.(row.original)}>Edit lead</DropdownMenuItem>
                    <DropdownMenuItem disabled>Assign owner (coming soon)</DropdownMenuItem>
                    <DropdownMenuItem disabled>Change status (coming soon)</DropdownMenuItem>
                    <DropdownMenuItem disabled>Add tag (coming soon)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => options?.onArchiveLead?.(row.original)}>
                      Archive
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => options?.onRestoreLead?.(row.original)}>
                    Restore lead
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

export const leadsColumns: ColumnDef<Lead>[] = getLeadsColumns();
