"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { Washer } from "./types";
import { WasherActions } from "./washer-actions";

export const columns: ColumnDef<Washer>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "branch", header: "Branch" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
  { accessorKey: "rating", header: "Rating" },
  {
    id: "actions",
    cell: ({ row }) => {
      const washer = row.original;
      return <WasherActions washer={washer} />;
    },
  },
];
