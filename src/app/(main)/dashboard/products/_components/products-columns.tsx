"use client";

import { type ColumnDef, Subscribe } from "@tanstack/react-table";
import { cn } from "cn";
import { Copy, MoreHorizontal, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { currency, number, type Product, type ProductStatus } from "./data";

const statusColors: Record<ProductStatus, string> = {
  Active: "bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
  Draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Archived: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function createProductsColumns(
  onEdit: (product: Product) => void,
  onDuplicate: (product: Product) => void,
): ColumnDef<DataTableFeatures, Product>[] {
  return [
    {
      id: "select",
      size: 56,
      minSize: 56,
      maxSize: 56,
      header: ({ table }) => (
        <Subscribe
          source={table.store}
          selector={() => ({
            checked:
              table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && ("indeterminate" as const)),
            disabled: !table.getRowModel().rows.length,
          })}
        >
          {({ checked, disabled }) => (
            <Checkbox
              className="mx-auto"
              aria-label="Select all products on this page"
              checked={checked}
              disabled={disabled}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
            />
          )}
        </Subscribe>
      ),
      cell: ({ row }) => (
        <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
          {(checked) => (
            <Checkbox
              className="mx-auto"
              aria-label={`Select ${row.original.name}`}
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(value === true)}
            />
          )}
        </Subscribe>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "search",
      accessorFn: (product) => `${product.name} ${product.sku} ${product.category}`,
      filterFn: "includesString",
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="hover:text-primary focus-visible:ring-ring max-w-72 truncate rounded-sm text-left outline-none focus-visible:ring-2"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.original.sku}</span>,
    },
    { accessorKey: "category", header: "Category", filterFn: "equalsString" },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge variant="secondary" className={cn("rounded-md", statusColors[row.original.status])}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "stock",
      header: "Inventory",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={cn("rounded-md tabular-nums", {
            "bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-400": row.original.stock === 0,
            "bg-orange-200 text-orange-800 dark:bg-orange-950 dark:text-orange-400":
              row.original.stock > 0 && row.original.stock <= 10,
            "bg-sky-200 text-sky-800 dark:bg-sky-950 dark:text-sky-400": row.original.stock > 10,
          })}
        >
          {row.original.stock === 0 && "Out of stock"}
          {row.original.stock > 0 && (
            <>
              {number.format(row.original.stock)} in stock
              {row.original.stock <= 10 && " · Low stock"}
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="tabular-nums">{currency.format(row.original.price)}</span>,
    },
    {
      accessorKey: "sold",
      header: "Units sold",
      cell: ({ row }) => <span className="tabular-nums">{number.format(row.original.sold)}</span>,
    },
    {
      id: "actions",
      size: 56,
      minSize: 56,
      maxSize: 56,
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.name}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => onEdit(row.original)}>
                  <Pencil />
                  Edit product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    onDuplicate(row.original);
                    row.table.resetColumnFilters();
                    row.table.setPageIndex(0);
                  }}
                >
                  <Copy />
                  Duplicate
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
