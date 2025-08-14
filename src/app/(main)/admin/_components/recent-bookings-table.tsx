"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";

import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

export function RecentBookingsTable() {
  const { bookings } = useBookingStore();
  const table = useDataTableInstance({
    data: bookings,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Track and manage your latest bookings.</CardDescription>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <DataTableToolbar
          table={table}
          filterColumn="user"
          facetedFilters={[
            {
              columnId: "status",
              title: "Status",
              options: [
                { label: "Pending", value: "pending" },
                { label: "In Progress", value: "in-progress" },
                { label: "Completed", value: "completed" },
                { label: "Scheduled", value: "scheduled" },
              ],
            },
          ]}
        />
        <div className="overflow-hidden rounded-md border">
          <DataTable table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
