"use client";

import { useCallback, useMemo, useState } from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { PackagePlus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataTableFeatures } from "@/lib/data-table-features";

import { categories, products as initialProducts, type Product, statuses } from "./data";
import { ProductForm } from "./product-form";
import { createProductsColumns } from "./products-columns";
import { ProductsTable } from "./products-table";

export function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({ search: false });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [editor, setEditor] = useState<{ product: Product | null } | null>(null);

  const editProduct = useCallback((product: Product) => setEditor({ product }), []);
  const duplicateProduct = useCallback((product: Product) => {
    const id = crypto.randomUUID();
    setProducts((current) => [
      {
        ...product,
        id,
        name: `${product.name} (copy)`,
        sku: `COPY-${id.replaceAll("-", "")}`,
        status: "Draft",
        sold: 0,
      },
      ...current,
    ]);
    setColumnFilters([]);
    setSorting([]);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
    toast.success("Product duplicated as a draft.");
  }, []);
  const columns = useMemo(() => createProductsColumns(editProduct, duplicateProduct), [editProduct, duplicateProduct]);

  const table = useTable({
    features: dataTableFeatures,
    data: products,
    columns,
    state: { rowSelection, sorting, columnFilters, columnVisibility, pagination },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((current) => ({ ...current, pageIndex: 0 }));
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  const search = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const status = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";
  const category = (table.getColumn("category")?.getFilterValue() as string | undefined) ?? "All";

  function filterColumn(id: string, value: string) {
    table.getColumn(id)?.setFilterValue(!value || (id !== "search" && value === "All") ? undefined : value);
    table.setPageIndex(0);
  }

  function resetFilters() {
    table.resetColumnFilters();
    table.setPageIndex(0);
  }

  return (
    <section
      data-content-padding="false"
      aria-label="Products list"
      className="flex h-[calc(100svh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col"
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 px-4 pt-5 pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-medium text-3xl tracking-tight">
            Products <span className="text-muted-foreground text-xl">[{products.length}]</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your catalog, inventory, pricing, and product availability.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditor({ product: null })}>
          <PackagePlus data-icon="inline-start" />
          Add product
        </Button>
      </header>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-3">
        <InputGroup className="w-full sm:w-64">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search products"
            placeholder="Search products…"
            value={search}
            onChange={(event) => filterColumn("search", event.target.value)}
          />
        </InputGroup>
        <div className="flex flex-wrap items-center gap-2">
          {(search || status !== "All" || category !== "All") && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          )}
          <Select value={status} onValueChange={(value) => filterColumn("status", value)}>
            <SelectTrigger size="sm" aria-label="Filter product status" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="All">All statuses</SelectItem>
                {statuses.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(value) => filterColumn("category", value)}>
            <SelectTrigger size="sm" aria-label="Filter product category" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="All">All categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ProductsTable table={table} onReset={resetFilters} />

      {editor && (
        <ProductForm
          product={editor.product}
          products={products}
          onClose={() => setEditor(null)}
          onSave={(product) => {
            setProducts((current) =>
              current.some((p) => p.id === product.id)
                ? current.map((p) => (p.id === product.id ? product : p))
                : [product, ...current],
            );
            setEditor(null);
            resetFilters();
            table.resetSorting();
            toast.success("Product saved in this demo session.");
          }}
        />
      )}
    </section>
  );
}
