"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Payment } from "@/stores/admin-dashboard/payment-store";

import { DataTableToolbar } from "../../_components/data-table-toolbar";

import { columns } from "./columns";

interface PaymentDataTableProps {
  data: Payment[];
}

export function PaymentDataTable({ data }: PaymentDataTableProps) {
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterColumn="booking_id"
        facetedFilters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Succeeded", value: "succeeded" },
              { label: "Failed", value: "failed" },
              { label: "Pending", value: "pending" },
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
