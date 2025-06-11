import type { ColumnDef } from "@tanstack/react-table";

import { dragColumn } from "./drag-column";

export function withDndColumn<T>(columns: ColumnDef<T>[]): ColumnDef<T>[] {
  return [dragColumn as ColumnDef<T>, ...columns];
}
