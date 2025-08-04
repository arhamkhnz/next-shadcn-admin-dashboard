"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchActions } from "./branch-actions";

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const services = row.original.services ?? [];
      return <span>{services.length}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      return <BranchActions branch={branch} />;
    },
  },
];
