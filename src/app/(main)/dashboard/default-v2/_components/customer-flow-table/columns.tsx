"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, CircleSlash2, Clock3, Phone, Star, UserRoundPlus } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { CustomerFlowRow } from "./schema";

const statusIconMap = {
  success: BadgeCheck,
  warning: Star,
  danger: CircleSlash2,
  info: Phone,
  neutral: Clock3,
  accent: UserRoundPlus,
} as const;

const statusToneClass = "text-primary";

function LeadNameCell({ name }: Pick<CustomerFlowRow, "name">) {
  return (
    <div className="min-w-0">
      <span className="block truncate font-medium">{name}</span>
    </div>
  );
}

function StatusCell({ status, statusTone }: Pick<CustomerFlowRow, "status" | "statusTone">) {
  const StatusIcon = statusIconMap[statusTone];

  return (
    <div className="flex min-w-0 items-center gap-2">
      <StatusIcon className={cn("size-4 shrink-0", statusToneClass)} />
      <span className="truncate">{status}</span>
    </div>
  );
}

function AssigneeCell({ assignee }: Pick<CustomerFlowRow, "assignee">) {
  return (
    <div className="min-w-0">
      <span className="block truncate text-muted-foreground">{assignee}</span>
    </div>
  );
}

export const customerFlowColumns: ColumnDef<CustomerFlowRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <div className="min-w-[220px]">Customer</div>,
    cell: ({ row }) => <LeadNameCell name={row.original.name} />,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: () => <div className="w-[160px]">Status</div>,
    cell: ({ row }) => <StatusCell status={row.original.status} statusTone={row.original.statusTone} />,
    enableHiding: false,
  },
  {
    accessorKey: "revenue",
    header: () => <div className="w-[120px] text-right">Revenue</div>,
    cell: ({ row }) => <div className="w-[120px] text-right tabular-nums">{row.original.revenue}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "assignee",
    header: () => <div className="w-[140px]">Assigned To</div>,
    cell: ({ row }) => <AssigneeCell assignee={row.original.assignee} />,
    enableHiding: false,
  },
  {
    accessorKey: "joined",
    header: () => <div className="w-[120px]">Joined</div>,
    cell: ({ row }) => <div className="w-[120px] text-muted-foreground">{row.original.joined}</div>,
    enableHiding: false,
  },
];
