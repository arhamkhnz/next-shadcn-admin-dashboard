"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Promotion } from "@/types/database";

import { PromotionActions } from "./promotion-actions";

export const usePromotionColumns = (): ColumnDef<Promotion>[] => {
  const isMobile = useIsMobile();

  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    },
    {
      accessorKey: "discount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Discount (%)" />,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "active",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const promotion = row.original;
        return <PromotionActions promotion={promotion} />;
      },
    },
  ];

  if (isMobile) {
    return columns.filter(
      (col) =>
        ("accessorKey" in col && col.accessorKey !== "startDate" && col.accessorKey !== "endDate") ||
        ("id" in col && col.id === "actions"),
    );
  }

  return columns;
};
