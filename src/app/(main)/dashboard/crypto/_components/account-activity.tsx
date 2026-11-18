"use client";

import { useState } from "react";

import { type PaginationState, useTable } from "@tanstack/react-table";
import { cn } from "cn";
import { Search } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataTableFeatures } from "@/lib/data-table-features";

import { activityColumns } from "./activity-columns";
import { accountActivities } from "./data";

export function AccountActivityTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const table = useTable({
    features: dataTableFeatures,
    data: accountActivities,
    columns: activityColumns,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    getRowId: (row) => row.id,
  });
  const activityCount = table.getFilteredRowModel().rows.length;
  const firstRow = activityCount ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const lastRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, activityCount);

  return (
    <Card size="sm" id="crypto-activity" className="gap-0">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Recent account activity</CardTitle>
          <InputGroup className="h-7 w-full sm:w-48">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search account activity"
              placeholder="Search activity..."
              value={globalFilter}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table
          className="min-w-180 [&_td]:h-11 [&_td]:px-4 [&_td]:py-2 [&_th]:h-9 [&_th]:px-4"
          aria-label="Recent account activity"
        >
          <TableHeader className="[&_th]:text-muted-foreground [&_th]:font-normal">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!activityCount && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={activityColumns.length}>
                  <Empty className="min-h-40">
                    <EmptyHeader>
                      <EmptyTitle>{globalFilter ? "No matching activity" : "No account activity yet"}</EmptyTitle>
                      <EmptyDescription>
                        {globalFilter
                          ? "Try searching for another asset or activity."
                          : "Your account activity will appear here."}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-transparent py-3">
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Showing {firstRow}–{lastRow} of {activityCount} activities
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="activity-page-size">Rows per page</Label>
            <Select value={`${pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger id="activity-page-size" size="sm" className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Pagination className="mx-0 w-auto" aria-label="Account activity pagination">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#crypto-activity"
                  size="sm"
                  aria-disabled={!table.getCanPreviousPage()}
                  tabIndex={table.getCanPreviousPage() ? 0 : -1}
                  className={cn(!table.getCanPreviousPage() && "pointer-events-none opacity-50")}
                  onClick={(event) => {
                    event.preventDefault();
                    if (table.getCanPreviousPage()) table.previousPage();
                  }}
                />
              </PaginationItem>
              {table.getPageOptions().map((pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    href="#crypto-activity"
                    size="icon-sm"
                    aria-label={`Go to page ${pageIndex + 1}`}
                    isActive={pagination.pageIndex === pageIndex}
                    onClick={(event) => {
                      event.preventDefault();
                      table.setPageIndex(pageIndex);
                    }}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#crypto-activity"
                  size="sm"
                  aria-disabled={!table.getCanNextPage()}
                  tabIndex={table.getCanNextPage() ? 0 : -1}
                  className={cn(!table.getCanNextPage() && "pointer-events-none opacity-50")}
                  onClick={(event) => {
                    event.preventDefault();
                    if (table.getCanNextPage()) table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardFooter>
    </Card>
  );
}
