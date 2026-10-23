"use client";

import { type Dispatch, type ReactNode, type SetStateAction, useRef } from "react";

import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";

import type { BoardState, ColumnId, Task } from "./types";

export function KanbanListDnd({
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

export function KanbanListDropGroup({ columnId, children }: { columnId: ColumnId; children: ReactNode }) {
  const { ref, isDropTarget } = useDroppable({
    id: columnId,
    type: "list-group",
    accept: "list-task",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div ref={ref} className={cn(isDropTarget && "ring-border ring-1 ring-inset")}>
      {children}
    </div>
  );
}

export function SortableListTask({
  task,
  columnId,
  index,
  children,
}: {
  task: Task;
  columnId: ColumnId;
  index: number;
  children: ReactNode;
}) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    group: columnId,
    type: "list-task",
    accept: "list-task",
  });

  return (
    <li
      ref={ref}
      aria-label={task.title}
      className={cn(
        "bg-background hover:bg-muted/40 focus-visible:ring-ring flex min-h-12 cursor-grab touch-none items-center gap-2.5 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-inset active:cursor-grabbing lg:px-5.5",
        isDragging && "opacity-40",
      )}
    >
      {children}
    </li>
  );
}
