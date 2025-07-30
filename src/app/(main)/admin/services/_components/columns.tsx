"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Service } from "@/types/database";

import { ServiceActions } from "./service-actions";

export const columns: ColumnDef<Service>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "branchId", header: "Branch ID" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "duration_min", header: "Duration (min)" },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;
      return <ServiceActions service={service} />;
    },
  },
];
