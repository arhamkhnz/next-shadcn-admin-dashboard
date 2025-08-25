"use client";

import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Service } from "@/types/database";

import { ServiceActions } from "./service-actions";

// Define a type that extends Service with branchName
type ServiceWithBranchName = Service & { branchName?: string; description?: string };

export const useServiceColumns = (): ColumnDef<ServiceWithBranchName>[] => {
  const isMobile = useIsMobile();

  const columns = useMemo(() => {
    const baseColumns: ColumnDef<ServiceWithBranchName>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      },
      {
        accessorKey: "description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        cell: ({ row }) => {
          const description = row.original.description;
          return description ? (
            <div className="max-w-xs truncate" title={description}>
              {description}
            </div>
          ) : (
            <span className="text-muted-foreground">No description</span>
          );
        },
      },
      {
        accessorKey: "branchName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
        cell: ({ row }) => {
          const service = row.original;
          return (
            <div className="flex items-center gap-2">
              <span>{service.branchName}</span>
            </div>
          );
        },
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
      return baseColumns.filter(
        (col) =>
          ("accessorKey" in col &&
            col.accessorKey !== "branchName" &&
            col.accessorKey !== "duration_min" &&
            col.accessorKey !== "description") ||
          ("id" in col && col.id === "actions"),
      );
    }

    return baseColumns;
  }, [isMobile]);

  return columns;
};
