"use client";

import { type Dispatch, type ReactNode, type SetStateAction, useRef } from "react";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { ReactTable, Row } from "@tanstack/react-table";
import { cn } from "cn";
import { GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { TaskTableRow } from "./kanban-table-columns";
import type { BoardState } from "./types";

export function KanbanTableDnd({
  board,
  setBoard,
  children,
}: {
  board: BoardState;
  setBoard: Dispatch<SetStateAction<BoardState>>;
  children: ReactNode;
}) {
  const beforeDrag = useRef(board);

  return (
    <DragDropProvider
      onDragStart={() => {
        beforeDrag.current = board;
      }}
      onDragOver={(event) => {
        setBoard((current) => move(current, event));
      }}
      onDragEnd={(event) => {
        if (event.canceled || !event.operation.target) {
          setBoard(beforeDrag.current);
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
}

export function SortableTaskTableRow({
  row,
  table,
  index,
}: {
  row: Row<DataTableFeatures, TaskTableRow>;
  table: ReactTable<DataTableFeatures, TaskTableRow>;
  index: number;
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: row.id,
    index,
    group: row.original.status.id,
    type: "table-task",
    accept: "table-task",
  });

  return (
    <TableRow ref={ref} className={cn("bg-background hover:bg-muted/40", isDragging && "opacity-40")}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            "h-12 border-border/50 border-r border-b px-6 py-2 last:border-r-0",
            cell.column.id === "drag" && "px-0 text-center",
          )}
        >
          {cell.column.id === "drag" ? (
            <Button
              ref={handleRef}
              variant="ghost"
              size="icon-sm"
              className="touch-none cursor-grab text-muted-foreground active:cursor-grabbing"
              aria-label={`Drag ${row.original.title}`}
            >
              <GripVertical />
            </Button>
          ) : (
            <table.FlexRender cell={cell} />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
