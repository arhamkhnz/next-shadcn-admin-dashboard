"use client";

import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { exportToCSV } from "@/lib/export-utils";

import { DataTableFacetedFilter } from "../../_components/data-table-faceted-filter";

import { columns, Branch } from "./columns";

interface BranchDataTableProps {
  data: Branch[];
}

export function BranchDataTable({ data }: BranchDataTableProps) {
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  // Get unique franchises for faceted filter
  const franchises = Array.from(new Set(data.map((branch) => branch.franchise))).map((franchise) => ({
    label: franchise,
    value: franchise,
  }));

  // Get service count ranges for faceted filter
  const serviceCounts = data.map((branch) => branch.services?.length ?? 0);
  const maxServices = Math.max(...serviceCounts, 0);

  // Create service count ranges
  const serviceRanges = [];
  if (maxServices > 0) {
    if (maxServices <= 5) {
      // If max is small, just show individual counts
      for (let i = 0; i <= maxServices; i++) {
        serviceRanges.push({
          label: `${i} service${i !== 1 ? "s" : ""}`,
          value: i.toString(),
        });
      }
    } else {
      // Otherwise create ranges
      serviceRanges.push({ label: "No services", value: "0" });
      serviceRanges.push({ label: "1-2 services", value: "1-2" });
      serviceRanges.push({ label: "3-5 services", value: "3-5" });
      if (maxServices > 5) {
        serviceRanges.push({ label: "6-10 services", value: "6-10" });
      }
      if (maxServices > 10) {
        serviceRanges.push({ label: "10+ services", value: "10+" });
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <DataTableFacetedFilter column={table.getColumn("franchise")} title="Franchise" options={franchises} />
          {serviceRanges.length > 0 && (
            <DataTableFacetedFilter column={table.getColumn("serviceCount")} title="Services" options={serviceRanges} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm" onClick={() => exportToCSV(table, "branches.csv")}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
