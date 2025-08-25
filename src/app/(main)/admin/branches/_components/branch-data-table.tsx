/* eslint-disable complexity */
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

import { columns } from "./columns";
import { Branch } from "./types";

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
  const franchises = Array.from(new Set(data.map((branch) => branch.franchise)))
    .filter((franchise): franchise is string => Boolean(franchise))
    .map((franchise) => ({
      label: franchise,
      value: franchise,
    }));

  // Get unique cities for faceted filter
  const cities = Array.from(new Set(data.map((branch) => branch.city)))
    .filter((city): city is string => Boolean(city))
    .map((city) => ({
      label: city,
      value: city,
    }));

  // Get service count ranges for faceted filter
  // Filter out branches where services haven't loaded yet
  const loadedBranches = data.filter((branch) => branch.services !== undefined);
  const serviceCounts = loadedBranches.map((branch) => branch.services?.length ?? 0);
  const maxServices = serviceCounts.length > 0 ? Math.max(...serviceCounts, 0) : 0;

  // Create service count ranges
  const serviceRanges = [];

  // Only create service ranges if we have loaded data
  if (loadedBranches.length > 0 && maxServices >= 0) {
    // Always include "No services" option
    serviceRanges.push({ label: "No services", value: "0" });

    if (maxServices > 0) {
      if (maxServices <= 5) {
        // If max is small, show individual counts (1-maxServices)
        for (let i = 1; i <= maxServices; i++) {
          serviceRanges.push({
            label: `${i} service${i !== 1 ? "s" : ""}`,
            value: i.toString(),
          });
        }
      } else {
        // Otherwise create ranges
        if (maxServices >= 1) {
          serviceRanges.push({ label: "1-2 services", value: "1-2" });
        }
        if (maxServices >= 3) {
          serviceRanges.push({ label: "3-5 services", value: "3-5" });
        }
        if (maxServices >= 6) {
          serviceRanges.push({ label: "6-10 services", value: "6-10" });
        }
        if (maxServices > 10) {
          serviceRanges.push({ label: "10+ services", value: "10+" });
        }
      }
    }
  }

  // Get rating ranges for faceted filter
  const ratings = [
    { label: "5 stars", value: "5" },
    { label: "4+ stars", value: "4+" },
    { label: "3+ stars", value: "3+" },
    { label: "Below 3 stars", value: "<3" },
    { label: "Not rated", value: "0" },
  ];

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
          {cities.length > 0 && (
            <DataTableFacetedFilter column={table.getColumn("city")} title="City" options={cities} />
          )}
          <DataTableFacetedFilter column={table.getColumn("ratings")} title="Rating" options={ratings} />
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
