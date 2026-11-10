"use client";

import { type Dispatch, type SetStateAction, useCallback, useMemo } from "react";

import { useTable } from "@tanstack/react-table";
import { cn } from "cn";
import { CalendarDays, ChevronLeft, ChevronRight, CircleCheck, Flame, ListTodo, Tags, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dataTableFeatures } from "@/lib/data-table-features";

import { columnIds } from "./data";
import { createTaskTableColumns } from "./kanban-table-columns";
import { SortableTaskTableRow } from "./kanban-table-dnd";
import type { BoardState, Column, ColumnId } from "./types";

const headerIcons: Record<string, typeof ListTodo> = {
  title: ListTodo,
  status: CircleCheck,
  priority: Flame,
  team: Tags,
  owner: User,
  dueDate: CalendarDays,
};

export function KanbanTable({
  board,
  columns,
  setBoard,
  order,
}: {
  board: BoardState;
  columns: readonly Column[];
  setBoard: Dispatch<SetStateAction<BoardState>>;
  order: string[];
}) {
  const changeStatus = useCallback(
    (taskId: string, status: ColumnId) => {
      setBoard((current) => {
        const source = columnIds.find((id) => current[id].some((task) => task.id === taskId));
        if (!source || source === status) {
          return current;
        }

        const task = current[source].find((item) => item.id === taskId);
        if (!task) {
          return current;
        }

        return {
          ...current,
          [source]: current[source].filter((item) => item.id !== taskId),
          [status]: [...current[status], task],
        };
      });
    },
    [setBoard],
  );
  const tableColumns = useMemo(() => createTaskTableColumns(columns, changeStatus), [columns, changeStatus]);
  const data = useMemo(() => {
    const positions = new Map(order.map((id, index) => [id, index]));
    return columns
      .flatMap((column) => board[column.id].map((task) => ({ ...task, status: column })))
      .sort((a, b) => (positions.get(a.id) ?? order.length) - (positions.get(b.id) ?? order.length));
  }, [board, columns, order]);
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: tableColumns,
    getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    enableSorting: false,
    autoResetPageIndex: false,
  });
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <div className="flex min-h-0 flex-1 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto">
      <Table aria-label="Kanban tasks" className="min-w-280 table-fixed border-separate border-spacing-0">
        <TableHeader className="bg-background sticky top-0 z-10">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const Icon = headerIcons[header.column.id];

                return (
                  <TableHead
                    key={header.id}
                    scope="col"
                    style={{ width: header.getSize() }}
                    className={cn(
                      "border-border/50 bg-background h-10 border-r border-b px-6 font-normal last:border-r-0",
                      header.column.id === "drag" && "px-0",
                    )}
                  >
                    {!header.isPlaceholder && (
                      <span className="text-muted-foreground flex items-center gap-2">
                        {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
                        <table.FlexRender header={header} />
                      </span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <SortableTaskTableRow key={row.id} row={row} table={table} index={row.index} />
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={tableColumns.length}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No tasks yet</EmptyTitle>
                    <EmptyDescription>Tasks from your board appear here.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <footer className="text-muted-foreground flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-3 border-t px-6 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="tabular-nums" aria-live="polite">
            {data.length ? pageIndex * pageSize + 1 : 0}–{Math.min((pageIndex + 1) * pageSize, data.length)} of{" "}
            {data.length} tasks
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="kanban-page-size">Rows per page</label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger id="kanban-page-size" size="sm" className="w-16">
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
        <div className="flex items-center gap-2">
          <span className="mr-2 text-xs tabular-nums">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </footer>
    </div>
  );
}
