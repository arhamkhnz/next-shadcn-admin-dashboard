"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { addMinutes, differenceInCalendarDays, endOfToday, format, parseISO } from "date-fns";
import { CircleAlertIcon, CircleCheckIcon, Clock3Icon, LoaderIcon, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { RecentCustomerRow } from "./schema";

function billingIcon(billing: string) {
  switch (billing) {
    case "Paid":
      return <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />;
    case "Pending":
      return <LoaderIcon />;
    case "Overdue":
      return <CircleAlertIcon className="text-amber-600 dark:text-amber-500" />;
    case "Trial":
      return <Clock3Icon className="text-muted-foreground" />;
    default:
      return null;
  }
}

export const recentCustomersColumns: ColumnDef<RecentCustomerRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all customers on this page"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select ${row.original.name}`}
        />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md border bg-muted">
          <UserRound className="size-4 text-muted-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-end justify-between gap-3">
            <div className="grid min-w-0 gap-0.5">
              <span className="truncate font-medium text-sm leading-none">{row.original.name}</span>
              <span className="truncate text-muted-foreground text-xs leading-none">#{row.original.id}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.id} ${row.name} ${row.email}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "billing",
    header: "Billing",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {billingIcon(row.original.billing)}
        {row.original.billing}
      </Badge>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => <span className="text-sm">{row.original.plan}</span>,
  },
  {
    id: "joinedWindow",
    accessorFn: (row) => {
      const daysSinceJoined = differenceInCalendarDays(endOfToday(), parseISO(row.joined));

      if (daysSinceJoined <= 30) return ["30", "90"];
      if (daysSinceJoined <= 90) return ["90"];
      return [];
    },
    filterFn: "arrIncludes",
    enableHiding: true,
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ row }) => {
      const baseDate = parseISO(row.original.joined);
      const joinedAt = addMinutes(baseDate, 9 * 60 + (Number(row.original.id) % 12) * 17);

      return (
        <div className="grid gap-0.5">
          <span className="text-sm">{format(joinedAt, "do MMMM yyyy")}</span>
          <span className="text-muted-foreground text-xs">at {format(joinedAt, "h:mm a")}</span>
        </div>
      );
    },
  },
];
