"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

type Report = {
  id: string;
  name: string;
  dateRange: string;
  generatedOn: string;
};

const mockReports: Report[] = [
  { id: "1", name: "Monthly Bookings", dateRange: "June 2024", generatedOn: "2024-07-01" },
  { id: "2", name: "Washer Performance", dateRange: "Q2 2024", generatedOn: "2024-07-01" },
  { id: "3", name: "Service Popularity", dateRange: "June 2024", generatedOn: "2024-07-02" },
  { id: "4", name: "Branch Revenue", dateRange: "May 2024", generatedOn: "2024-06-01" },
];

const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "name",
    header: "Report Name",
  },
  {
    accessorKey: "dateRange",
    header: "Date Range",
  },
  {
    accessorKey: "generatedOn",
    header: "Generated On",
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    ),
  },
];

export function FranchiseReportsView() {
  const table = useDataTableInstance({
    data: mockReports,
    columns,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>View and download generated reports for your franchise.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable table={table} columns={columns} />
      </CardContent>
    </Card>
  );
}
