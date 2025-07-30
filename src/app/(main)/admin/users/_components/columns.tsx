"use client";

import { ColumnDef } from "@tanstack/react-table";

import { User } from "./types";
import { UserActions } from "./user-actions";

export const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "cars", header: "Cars" },
  { accessorKey: "bookings", header: "Bookings" },
  { accessorKey: "totalWashes", header: "Total Washes" },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActions user={user} />;
    },
  },
];
