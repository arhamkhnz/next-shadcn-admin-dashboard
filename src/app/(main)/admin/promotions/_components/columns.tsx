"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Promotion } from "@/types/database";

import { PromotionActions } from "./promotion-actions";

export const columns: ColumnDef<Promotion>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "discount", header: "Discount (%)" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  { accessorKey: "active", header: "Active" },
  {
    id: "actions",
    cell: ({ row }) => {
      const promotion = row.original;
      return <PromotionActions promotion={promotion} />;
    },
  },
];
