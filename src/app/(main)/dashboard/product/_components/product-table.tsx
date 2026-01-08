"use client";

import * as React from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { createProductColumns } from "./columns";
import type { Product } from "./schema";

interface ProductTableProps {
  data: Product[];
  onEdit: (id: string, data: Omit<Product, "id" | "image">) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ data: initialData, onEdit, onDelete }: ProductTableProps) {
  const data = React.useMemo(() => initialData, [initialData]);
  
  const handleEdit = React.useCallback(
    (id: string, editData: Omit<Product, "id" | "image">) => {
      onEdit(id, editData);
    },
    [onEdit]
  );

  const handleDelete = React.useCallback(
    (id: string) => {
      onDelete(id);
    },
    [onDelete]
  );

  const columns = React.useMemo(
    () => createProductColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  );
  
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-4" key={`table-${table.version}`}>
      <div className="overflow-hidden rounded-lg border">
        <DataTableNew table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}