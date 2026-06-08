"use client";
"use no memo";

import { useMemo } from "react";

import { flexRender, type Table as TableType } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

import type { Role } from "./data";

type RoleTableRow = ReturnType<TableType<Role>["getRowModel"]>["rows"][number];

function groupRowsByRoleGroup(rows: RoleTableRow[]) {
  return rows.reduce(
    (groups, row) => {
      const label = row.original.group;
      const group = groups.find((item) => item.label === label);

      if (group) {
        group.rows.push(row);
      } else {
        groups.push({ label, rows: [row] });
      }

      return groups;
    },
    [] as Array<{ label: string; rows: RoleTableRow[] }>,
  );
}

export function RolesTable({ table }: { table: TableType<Role> }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageRows = table.getRowModel().rows;
  const filteredRows = table.getFilteredRowModel().rows;

  const groupedRows = useMemo(() => groupRowsByRoleGroup(pageRows), [pageRows]);
  const filteredGroups = useMemo(() => groupRowsByRoleGroup(filteredRows), [filteredRows]);
  const totalGroupCounts = useMemo(
    () => new Map(filteredGroups.map((group) => [group.label, group.rows.length])),
    [filteredGroups],
  );

  const start = filteredRows.length === 0 ? 0 : pageIndex * pageSize + 1;
  const end = filteredRows.length === 0 ? 0 : start + pageRows.length - 1;
  const colCount = table.getVisibleLeafColumns().length;

  return (
    <>
      <Table className="w-full table-fixed border-collapse" style={{ minWidth: table.getTotalSize() }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-y hover:bg-transparent [&>:not(:last-child)]:border-r">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="h-10 px-4 text-center font-medium text-foreground text-sm first:text-left"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {groupedRows.length ? (
            groupedRows.map((group) => (
              <TableBodyGroup
                key={group.label}
                group={group}
                totalCount={totalGroupCounts.get(group.label) ?? 0}
                colCount={colCount}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colCount} className="h-24 text-center text-muted-foreground">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center border-border/70 border-t p-4">
        <div className="text-muted-foreground text-sm">
          Showing {start} to {end} of {filteredRows.length} roles
        </div>

        <div className="mx-auto">
          <Pagination className="mx-0 w-auto justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size="sm"
                  href="#"
                  text=""
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  size="sm"
                  href="#"
                  isActive
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  size="sm"
                  href="#"
                  text=""
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Rows per page</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(v) => {
              table.setPageSize(Number(v));
            }}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" side="top">
              <SelectGroup>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

function TableBodyGroup({
  group,
  totalCount,
  colCount,
}: {
  group: { label: string; rows: RoleTableRow[] };
  totalCount: number;
  colCount: number;
}) {
  return (
    <>
      <TableRow className="h-10 bg-muted">
        <TableCell className="px-4 text-foreground/60 text-sm" colSpan={colCount}>
          {group.label}{" "}
          <Badge variant="outline" className="ml-2 rounded-sm bg-transparent text-muted-foreground text-xs">
            {group.rows.length} of {totalCount}
          </Badge>
        </TableCell>
      </TableRow>
      {group.rows.map((row) => (
        <TableRow key={row.id} className="h-12 hover:bg-muted/20">
          {row.getVisibleCells().map((cell, index) => (
            <TableCell
              key={cell.id}
              style={{ width: cell.column.getSize() }}
              className={cn(
                "border-r px-4 align-middle",
                index === row.getVisibleCells().length - 1 && "border-r-0",
                index === 0 ? "text-left" : "text-center",
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
