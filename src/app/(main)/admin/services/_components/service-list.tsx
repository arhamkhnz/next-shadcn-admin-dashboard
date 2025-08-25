"use client";

import * as React from "react";
import { useMemo } from "react";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Download } from "lucide-react";

import { DataTableToolbar } from "@/app/(main)/admin/_components/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exportToCSV } from "@/lib/export-utils";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";

import { useServiceColumns } from "./columns";
import { ServiceForm } from "./service-form";

// Define a type that extends Service with branchName
type ServiceWithBranchName =
  ReturnType<typeof useServiceStore> extends { services: infer S }
    ? S extends Array<infer T>
      ? T & { branchName?: string }
      : never
    : never;

export function ServiceList() {
  const services = useServiceStore((state) => state.services);
  const { branches } = useBranchStore();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const columns = useServiceColumns();

  // Memoize servicesWithBranchNames to prevent infinite re-renders
  // All services are global by default
  const servicesWithBranchNames = useMemo(() => {
    return services.map((service) => {
      return {
        ...service,
        branchName: "Global",
      };
    });
  }, [services]);

  const table = useReactTable({
    data: servicesWithBranchNames,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Memoize branchNames to prevent infinite re-renders
  const branchNames = useMemo(() => {
    // Only "Global" since all services are global
    return ["Global"];
  }, []);

  const facetedFilters = useMemo(
    () => [
      {
        columnId: "branchName",
        title: "Branch",
        options: branchNames.map((name) => ({ label: name, value: name })),
      },
    ],
    [branchNames],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DataTableToolbar table={table} filterColumn="name" facetedFilters={facetedFilters} />
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>Create Service</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Service</DialogTitle>
              </DialogHeader>
              <ServiceForm onClose={() => setCreateModalOpen(false)} />
            </DialogContent>
          </Dialog>
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm" onClick={() => exportToCSV(table, "services.csv")}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
