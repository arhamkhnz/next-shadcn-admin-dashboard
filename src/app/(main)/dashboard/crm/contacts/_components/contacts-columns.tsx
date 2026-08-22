"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { CheckCircle2, Clock, MoreHorizontal, XCircle } from "lucide-react";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableField } from "@/lib/crm-table-engine/types";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import type { Contact, ContactFollowUpState, ContactLifecycleStage } from "./contacts-data/schema";

const today = new Date(2026, 7, 16);

const lifecycleMeta: Record<ContactLifecycleStage, { badgeClass: string; dotClass: string }> = {
  Subscriber: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Lead: {
    badgeClass:
      "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  "Marketing Qualified": {
    badgeClass:
      "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  "Sales Qualified": {
    badgeClass:
      "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Opportunity: {
    badgeClass:
      "border-purple-200 bg-purple-500/10 text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/15 dark:text-purple-300",
    dotClass: "bg-purple-500",
  },
  Customer: {
    badgeClass:
      "border-teal-200 bg-teal-500/10 text-teal-700 dark:border-teal-900/40 dark:bg-teal-500/15 dark:text-teal-300",
    dotClass: "bg-teal-500",
  },
  "Former Customer": {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
};

export function getFollowUpState(nextActivity: string | null): ContactFollowUpState {
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

function ContactNameCell({ name, jobTitle }: { name: string; jobTitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className={cn("font-medium", avatarTone(name))}>
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground text-sm">{name}</div>
        {jobTitle ? <div className="truncate text-muted-foreground text-xs">{jobTitle}</div> : null}
      </div>
    </div>
  );
}

function LifecycleBadge({ stage }: { stage: ContactLifecycleStage }) {
  const meta = lifecycleMeta[stage];
  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {stage}
    </Badge>
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

function DateCell({ value }: { value: string }) {
  return <span className="text-muted-foreground text-sm tabular-nums">{format(parseISO(value), "MMM d, yyyy")}</span>;
}

function OwnerCell({ ownerId }: { ownerId: string | null }) {
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

export function renderContactFieldCell(params: {
  field: TableField;
  contact: Contact;
  onCommitCustomValue: (
    contact: Contact,
    field: TableField,
    value: NonNullable<Contact["customFields"]>[string],
  ) => void;
}) {
  const { field, contact, onCommitCustomValue } = params;

  switch (field.key) {
    case "contact.name":
      return <ContactNameCell name={contact.name} jobTitle={contact.jobTitle} />;
    case "contact.company":
      return <span className="text-muted-foreground text-sm">{contact.companyName ?? "No company"}</span>;
    case "contact.email":
      return (
        <div className="min-w-0 text-sm">
          <div className="truncate text-foreground">{contact.email}</div>
          {contact.phone ? <div className="truncate text-muted-foreground text-xs">{contact.phone}</div> : null}
        </div>
      );
    case "contact.phone":
      return contact.phone ? (
        <a href={`tel:${contact.phone}`} className="truncate text-sm hover:underline">
          {contact.phone}
        </a>
      ) : (
        <span className="text-muted-foreground/60 text-sm">—</span>
      );
    case "contact.jobTitle":
      return <span className="text-muted-foreground text-sm">{contact.jobTitle ?? "—"}</span>;
    case "contact.lifecycleStage":
      return <LifecycleBadge stage={contact.lifecycleStage} />;
    case "contact.owner":
      return <OwnerCell ownerId={contact.ownerId ?? null} />;
    case "contact.openDeals": {
      const count = contact.openDealCount;
      const value = contact.openDealValue;
      if (count === 0) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      return (
        <div className="text-sm">
          <span className="font-medium tabular-nums">{count}</span>
          <span className="ml-1 text-muted-foreground text-xs">{formatCurrency(value)}</span>
        </div>
      );
    }
    case "contact.lastContacted":
      return contact.lastContacted ? (
        <span className="text-muted-foreground text-sm tabular-nums">{formatRelativeDate(contact.lastContacted)}</span>
      ) : (
        <span className="text-muted-foreground text-sm">Never</span>
      );
    case "contact.followUpState":
      return <FollowUpBadge nextActivity={contact.nextActivity} />;
    case "contact.createdAt":
      return <DateCell value={contact.createdAt} />;
    default:
      break;
  }

  if (!field.isCore) {
    const isArchivedContact = Boolean(contact.archivedAt);
    return (
      <EditableCustomCell
        field={field}
        value={contact.customFields?.[field.systemName]}
        disabled={isArchivedContact}
        disabledReason={isArchivedContact ? "Archived contacts cannot be edited." : undefined}
        onCommit={(value) => onCommitCustomValue(contact, field, value)}
      />
    );
  }

  return null;
}

export function getContactsSelectColumn(): ColumnDef<Contact> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select all contacts"
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

export type ContactsColumnsOptions = {
  onEditContact?: (contact: Contact) => void;
  onArchiveContact?: (contact: Contact) => void;
  onRestoreContact?: (contact: Contact) => void;
};

export function getContactsActionsColumn(options?: ContactsColumnsOptions): ColumnDef<Contact> {
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
                <Link href={`/dashboard/crm/contacts/${row.original.id}`}>View Contact</Link>
              </DropdownMenuItem>
              {isArchived ? (
                <DropdownMenuItem onClick={() => options?.onRestoreContact?.(row.original)}>
                  Restore Contact
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => options?.onEditContact?.(row.original)}>
                    Edit Contact
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>Assign Owner (coming soon)</DropdownMenuItem>
                  <DropdownMenuItem disabled>Add Tag (coming soon)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => options?.onArchiveContact?.(row.original)} variant="destructive">
                    Archive
                  </DropdownMenuItem>
                </>
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
