"use client";

import { useMemo, useState } from "react";

import { type PaginationState, useTable } from "@tanstack/react-table";
import { cn } from "cn";
import { Search } from "lucide-react";

import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dataTableFeatures } from "@/lib/data-table-features";

import { activityColumns } from "./activity-columns";
import { accountActivities } from "./data";

const activityRanges = ["24h", "7D", "30D", "6M", "1Y"] as const;
type ActivityRange = (typeof activityRanges)[number];
const activityRangeDays: Record<ActivityRange, number> = { "24h": 1, "7D": 7, "30D": 30, "6M": 180, "1Y": 365 };

export function AccountActivityTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [range, setRange] = useState<ActivityRange>("1Y");
  const [rangeEnd] = useState(() => Date.now());
  const activities = useMemo(() => {
    const rangeStart = rangeEnd - activityRangeDays[range] * 24 * 60 * 60 * 1000;
    return accountActivities.filter((activity) => {
      const timestamp = new Date(activity.time).getTime();
      return timestamp >= rangeStart && timestamp <= rangeEnd;
    });
  }, [range, rangeEnd]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const table = useTable({
    features: dataTableFeatures,
    data: activities,
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
    <Card size="sm" id="crypto-activity" className="gap-4">
      <CardHeader>
        <CardTitle>Account activity</CardTitle>
        <CardAction className="flex max-w-full flex-wrap items-center gap-2 max-sm:col-start-1 max-sm:row-start-2 max-sm:justify-self-start">
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
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            spacing={0}
            value={range}
            aria-label="Account activity time range"
            onValueChange={(value) => {
              const selectedRange = activityRanges.find((item) => item === value);
              if (!selectedRange) return;
              setRange(selectedRange);
              table.setPageIndex(0);
            }}
          >
            {activityRanges.map((item) => (
              <ToggleGroupItem key={item} value={item} className="min-w-10">
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table
          className="min-w-180 [&_td]:h-11 [&_td]:px-4 [&_td]:py-2 [&_td:nth-child(4)]:pl-8 [&_th]:h-9 [&_th]:px-4 [&_th:nth-child(4)]:pl-8"
          aria-label="Account activity"
        >
          <TableHeader className="bg-muted/50 [&_th]:text-muted-foreground border-t [&_th]:font-mono [&_th]:font-normal [&_th]:uppercase">
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
                      <EmptyTitle>{globalFilter ? "No matching activity" : "No activity in this period"}</EmptyTitle>
                      <EmptyDescription>
                        {globalFilter
                          ? "Try searching for another asset or activity."
                          : "Choose a longer time range to see more activity."}
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
