"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTableToolbar } from "../../_components/data-table-toolbar";

import { columns, Franchise } from "./columns";

interface FranchiseDataTableProps {
  data: Franchise[];
}

export function FranchiseDataTable({ data }: FranchiseDataTableProps) {
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterColumn="name"
        facetedFilters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
