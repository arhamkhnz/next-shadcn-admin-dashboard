"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { FranchiseActions } from "./franchise-actions";
import { Franchise } from "./types";

export const columns: ColumnDef<Franchise>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // const status = row.getValue("status") as string;
      const { status } = row.original;

      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
  { accessorKey: "branches", header: "Branches" },
  { accessorKey: "washers", header: "Washers" },
  {
    id: "actions",
    cell: ({ row }) => {
      const franchise = row.original;
      return <FranchiseActions franchise={franchise} />;
    },
  },
];
