"use client";

import Link from "next/link";

import { format, parseISO } from "date-fns";

import { getOwnerName } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { EditableCustomCell } from "@/components/crm/table-engine/editable-custom-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TableField } from "@/lib/crm-table-engine/types";
import { cn, getInitials } from "@/lib/utils";

import { avatarTone, FollowUpBadge, formatRelativeDate, ScoreBadge, StatusBadge } from "./leads-columns";
import type { Lead } from "./leads-data/schema";

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

function CompanyCell({ company }: { company: string | null }) {
  return <span className="text-muted-foreground text-sm">{company ?? "Not provided"}</span>;
}

function ContactCell({ email, phone }: { email: string; phone: string | null }) {
  return (
    <div className="min-w-0 text-sm">
      <div className="truncate">{email}</div>
      {phone ? <div className="truncate text-muted-foreground text-xs">{phone}</div> : null}
    </div>
  );
}

function DateCell({ value }: { value: string }) {
  return <span className="text-muted-foreground text-sm tabular-nums">{format(parseISO(value), "MMM d, yyyy")}</span>;
}

export function renderLeadFieldCell(params: {
  field: TableField;
  lead: Lead;
  onCommitCustomValue: (lead: Lead, field: TableField, value: NonNullable<Lead["customFields"]>[string]) => void;
}) {
  const { field, lead, onCommitCustomValue } = params;

  switch (field.key) {
    case "lead.name":
      return (
        <Link
          href={`/dashboard/crm/leads/${lead.id}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Avatar className={cn("font-medium", avatarTone(lead.name))}>
            <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground text-sm">{lead.name}</div>
            {lead.jobTitle ? <div className="truncate text-muted-foreground text-xs">{lead.jobTitle}</div> : null}
          </div>
        </Link>
      );
    case "lead.company":
      return <CompanyCell company={lead.company ?? null} />;
    case "lead.email":
      return <ContactCell email={lead.email} phone={lead.phone ?? null} />;
    case "lead.phone":
      return lead.phone ? (
        <a href={`tel:${lead.phone}`} className="truncate text-sm hover:underline">
          {lead.phone}
        </a>
      ) : (
        <span className="text-muted-foreground/60 text-sm">—</span>
      );
    case "lead.source":
      return (
        <Badge className="rounded-full px-2.5 font-medium" variant="outline">
          {lead.source}
        </Badge>
      );
    case "lead.status":
      return <StatusBadge status={lead.status} />;
    case "lead.score":
      return <ScoreBadge score={lead.score} />;
    case "lead.owner":
      return <OwnerCell ownerId={lead.ownerId ?? null} />;
    case "lead.lastActivity":
      return (
        <span className="text-muted-foreground text-sm tabular-nums">{formatRelativeDate(lead.lastActivity)}</span>
      );
    case "lead.nextActivity":
      return <FollowUpBadge nextActivity={lead.nextActivity} />;
    case "lead.createdAt":
      return <DateCell value={lead.createdAt} />;
    case "lead.updatedAt":
      return lead.updatedAt ? (
        <DateCell value={lead.updatedAt} />
      ) : (
        <span className="text-muted-foreground/60 text-sm">—</span>
      );
    default:
      break;
  }

  if (!field.isCore) {
    const isArchivedLead = Boolean(lead.archivedAt);
    return (
      <EditableCustomCell
        field={field}
        value={lead.customFields?.[field.systemName]}
        disabled={isArchivedLead}
        disabledReason={isArchivedLead ? "Archived leads cannot be edited." : undefined}
        onCommit={(value) => onCommitCustomValue(lead, field, value)}
      />
    );
  }

  return null;
}
