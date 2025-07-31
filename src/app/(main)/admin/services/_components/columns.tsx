"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Service } from "@/types/database";

import { ServiceActions } from "./service-actions";

export const useServiceColumns = (): ColumnDef<Service>[] => {
  const isMobile = useIsMobile();

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "branchId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Branch ID" />,
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    },
    {
      accessorKey: "duration_min",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Duration (min)" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const service = row.original;
        return <ServiceActions service={service} />;
      },
    },
  ];

  if (isMobile) {
    return columns.filter((col) => col.accessorKey !== "branchId" && col.accessorKey !== "duration_min");
  }

  return columns;
};
