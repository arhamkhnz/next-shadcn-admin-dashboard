"use client";

import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Service } from "@/types/database";

import { ServiceActions } from "./service-actions";

// Define a type that extends Service with branchName
type ServiceWithBranchName = Service & { branchName?: string };

export const useServiceColumns = (): ColumnDef<ServiceWithBranchName>[] => {
  const isMobile = useIsMobile();

  const columns = useMemo(() => {
    const baseColumns: ColumnDef<ServiceWithBranchName>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      },
      {
        accessorKey: "branchName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
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
      return baseColumns.filter((col) => col.accessorKey !== "branchName" && col.accessorKey !== "duration_min");
    }

    return baseColumns;
  }, [isMobile]);

  return columns;
};
