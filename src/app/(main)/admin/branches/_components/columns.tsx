"use client";

import { ColumnDef } from "@tanstack/react-table";

import { BranchActions } from "./branch-actions";
import { Branch } from "./types";

export const columns: ColumnDef<Branch>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "franchise", header: "Franchise" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "services", header: "Services" },
  { accessorKey: "activeBookings", header: "Active Bookings" },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      return <BranchActions branch={branch} />;
    },
  },
];
