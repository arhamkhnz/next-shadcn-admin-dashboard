"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { WasherWithBranch } from "@/stores/franchise-dashboard/user-store";
import { Washer } from "@/types/franchise";

import { WasherActions } from "./washer-actions";

export const columns: ColumnDef<WasherWithBranch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "branch", // Use a simple, unique ID for the column
    header: "Branch",
    accessorFn: (row) => row.branches?.name, // Use a function to get the nested value
    cell: ({ row }) => {
      const branchName = row.original.branches?.name;
      return branchName ?? <span className="text-muted-foreground">Unassigned</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return rating ? rating.toFixed(2) : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const washer = row.original;
      return <WasherActions washer={washer} />;
    },
  },
];
