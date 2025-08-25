"use client";

import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Download, FileText } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFranchiseAnalyticsStore } from "@/stores/franchise-dashboard/analytics-store";

type Report = {
  id: string;
  name: string;
  dateRange: string;
  generatedOn: string;
  type: string;
};

const generateReports = (bookings: any[], services: any[], washers: any[], branches: any[]) => {
  // Calculate date range from data
  const bookingDates = bookings.filter((b) => b.scheduled_at).map((b) => new Date(b.scheduled_at));

  if (bookingDates.length === 0) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return [
      {
        id: "1",
        name: "Monthly Bookings Report",
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "bookings",
      },
      {
        id: "2",
        name: "Washer Performance Report",
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "washers",
      },
      {
        id: "3",
        name: "Service Popularity Report",
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "services",
      },
      {
        id: "4",
        name: "Branch Revenue Report",
        dateRange: `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`,
        generatedOn: today.toISOString().split("T")[0],
        type: "branches",
      },
    ];
  }

  const minDate = new Date(Math.min(...bookingDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...bookingDates.map((d) => d.getTime())));

  const formatDateRange = (start: Date, end: Date) => {
    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${start.toLocaleString("default", { month: "long" })} ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const dateRange = formatDateRange(minDate, maxDate);
  const generatedOn = new Date().toISOString().split("T")[0];

  return [
    {
      id: "1",
      name: "Monthly Bookings Report",
      dateRange,
      generatedOn,
      type: "bookings",
    },
    {
      id: "2",
      name: "Washer Performance Report",
      dateRange,
      generatedOn,
      type: "washers",
    },
    {
      id: "3",
      name: "Service Popularity Report",
      dateRange,
      generatedOn,
      type: "services",
    },
    {
      id: "4",
      name: "Branch Revenue Report",
      dateRange,
      generatedOn,
      type: "branches",
    },
  ];
};

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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      const typeLabels: Record<string, string> = {
        bookings: "Bookings",
        washers: "Washers",
        services: "Services",
        branches: "Branches",
      };
      return <span className="capitalize">{typeLabels[type as string] ?? type}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      );
    },
  },
];

export function FranchiseReportsView() {
  const { bookings, services, washers, branches, fetchAllData } = useFranchiseAnalyticsStore();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setReports(generateReports(bookings, services, washers, branches));
  }, [bookings, services, washers, branches]);

  const table = useDataTableInstance({
    data: reports,
    columns,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Reports
        </CardTitle>
        <CardDescription>View and download reports for your Karwi franchise.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable table={table} columns={columns} />
      </CardContent>
    </Card>
  );
}
