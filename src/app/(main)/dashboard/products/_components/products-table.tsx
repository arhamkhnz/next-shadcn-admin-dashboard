"use client";

import type { ReactTable } from "@tanstack/react-table";
import { cn } from "cn";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  DollarSign,
  Hash,
  Package,
  ShoppingBag,
  Tags,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { Product } from "./data";

const headerIcons: Record<string, typeof Package> = {
  name: Package,
  sku: Hash,
  category: Tags,
  status: CircleCheck,
  stock: Boxes,
  price: DollarSign,
  sold: ShoppingBag,
};

export function ProductsTable({
  table,
  onReset,
}: {
  table: ReactTable<DataTableFeatures, Product>;
  onReset: () => void;
}) {
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getFilteredRowModel().rows.length;
  const selected = table.getSelectedRowModel().rows.length;
  const pageCount = Math.max(1, table.getPageCount());
  const pageStart = Math.max(0, Math.min(pageIndex - 2, pageCount - 5));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);

  return (
    <div className="flex min-h-0 flex-1 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto">
      <Table aria-label="Products" className="border-border/60 min-w-280 border-separate border-spacing-0 border-b">
        <TableHeader className="bg-background sticky top-0 z-10">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="border-border/60 hover:bg-transparent">
              {group.headers.map((header) => {
                const Icon = headerIcons[header.column.id];
                const right = header.column.id === "price" || header.column.id === "sold";
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                    className={cn(
                      "border-border/50 bg-background h-10 border-t border-r border-b px-4.5 font-[450] last:border-r-0",
                      header.column.id === "select" && "px-0 text-center",
                      header.column.id === "actions" && "px-2.5",
                    )}
                  >
                    {!header.isPlaceholder && (
                      <div
                        className={cn(
                          "text-muted-foreground flex w-full items-center gap-2",
                          right && "justify-end",
                          header.column.id === "select" && "justify-center",
                        )}
                      >
                        {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
                        <table.FlexRender header={header} />
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={table.state.rowSelection[row.id] ? "selected" : undefined}
              className="border-border/60 hover:bg-muted/30 last:*:border-b-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                    minWidth: cell.column.columnDef.minSize,
                    maxWidth: cell.column.columnDef.maxSize,
                  }}
                  className={cn(
                    "border-border/50 h-12 border-r border-b px-4.5 py-2 last:border-r-0",
                    cell.column.id === "select" && "px-0 text-center",
                    cell.column.id === "actions" && "px-2.5",
                    (cell.column.id === "price" || cell.column.id === "sold") && "text-right",
                  )}
                >
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!table.getRowModel().rows.length && (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No products found</EmptyTitle>
                    <EmptyDescription>Try another search or clear your filters.</EmptyDescription>
                  </EmptyHeader>
                  <Button variant="outline" size="sm" onClick={onReset}>
                    Clear filters
                  </Button>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <footer className="bg-background flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-3 border-t px-4 py-2 text-sm">
        <div className="text-muted-foreground flex flex-wrap items-center gap-4">
          <span className="tabular-nums" aria-live="polite">
            {total ? pageIndex * pageSize + 1 : 0} – {Math.min((pageIndex + 1) * pageSize, total)} of {total} products
            {selected > 0 && ` · ${selected} selected`}
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="products-page-size">Rows per page</label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger id="products-page-size" size="sm" className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <nav aria-label="Product pages" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>
          {pages.map((page) => (
            <Button
              key={page}
              variant={page === pageIndex ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label={`Page ${page + 1}`}
              aria-current={page === pageIndex ? "page" : undefined}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
        </nav>
      </footer>
    </div>
  );
}
