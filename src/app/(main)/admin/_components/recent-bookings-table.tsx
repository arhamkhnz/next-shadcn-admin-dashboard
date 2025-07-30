"use client";

import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { columns } from "./columns";

// Mock data - replace with actual Supabase data
const recentBookings = [
  {
    id: "BK001",
    user: "John Doe",
    branch: "Downtown Branch",
    service: "Premium Wash",
    status: "completed",
    date: new Date(2023, 5, 15),
  },
  {
    id: "BK002",
    user: "Jane Smith",
    branch: "North Branch",
    service: "Basic Wash",
    status: "pending",
    date: new Date(2023, 5, 16),
  },
  {
    id: "BK003",
    user: "Robert Johnson",
    branch: "East Branch",
    service: "Deluxe Wash",
    status: "in-progress",
    date: new Date(2023, 5, 16),
  },
  {
    id: "BK004",
    user: "Emily Davis",
    branch: "West Branch",
    service: "Premium Wash",
    status: "scheduled",
    date: new Date(2023, 5, 17),
  },
  {
    id: "BK005",
    user: "Michael Wilson",
    branch: "South Branch",
    service: "Basic Wash",
    status: "completed",
    date: new Date(2023, 5, 14),
  },
];

export function RecentBookingsTable() {
  const table = useDataTableInstance({
    data: recentBookings,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Track and manage your latest bookings.</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
            <Button variant="outline" size="sm">
              <Download />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <DataTable table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
