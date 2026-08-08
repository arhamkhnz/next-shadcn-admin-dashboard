"use client";

import * as React from "react";

import { move } from "@dnd-kit/helpers";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import {
  ArrowUpDown,
  Bot,
  ChevronDown,
  Kanban as KanbanIcon,
  LayoutTemplate,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columnIds, columns } from "./data";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import type { BoardState, ColumnId, Task } from "./types";

interface KanbanProps {
  initialBoard: BoardState;
}

type TaskDragData = {
  type: "task";
  task: Task;
  columnId: ColumnId;
};

function isColumnId(value: unknown): value is ColumnId {
  return typeof value === "string" && columnIds.includes(value as ColumnId);
}

function isTaskDragData(value: unknown): value is TaskDragData {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "task" &&
    "task" in value &&
    typeof value.task === "object" &&
    value.task !== null &&
    "columnId" in value &&
    isColumnId(value.columnId)
  );
}

export function Kanban({ initialBoard }: KanbanProps) {
  const [board, setBoard] = React.useState<BoardState>(initialBoard);
  const [columnOrder, setColumnOrder] = React.useState<ColumnId[]>(columnIds);
  const boardBeforeDrag = React.useRef<BoardState>(initialBoard);
  const orderedColumns = columnOrder.flatMap((columnId) => columns.find((column) => column.id === columnId) ?? []);

  function handleDragStart(event: DragStartEvent) {
    const { source } = event.operation;

    if (source?.type === "task") {
      boardBeforeDrag.current = board;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (event.operation.source?.type === "task") {
      setBoard((currentBoard) => move(currentBoard, event));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { source } = event.operation;

    if (!source) {
      return;
    }

    if (event.canceled) {
      if (source.type === "task") {
        setBoard(boardBeforeDrag.current);
      }
      return;
    }

    if (source.type === "column") {
      setColumnOrder((currentOrder) => move(currentOrder, event));
    }
  }

  return (
    <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <Tabs defaultValue="board" className="min-w-0">
          <TabsList className="w-full *:data-[slot=tabs-trigger]:flex-1 sm:w-fit sm:*:data-[slot=tabs-trigger]:flex-none">
            <TabsTrigger value="board" className="gap-2">
              <KanbanIcon />
              Board
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List />
              List
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Table2 />
              Table
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center 2xl:justify-end">
          <InputGroup className="min-w-0 sm:w-64 2xl:w-48">
            <InputGroupInput type="search" placeholder="Search tasks" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button variant="outline" className="w-full sm:w-auto">
            <SlidersHorizontal data-icon="inline-start" />
            Filter
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowUpDown data-icon="inline-start" />
            Sort
          </Button>
          <ButtonGroup className="w-full sm:w-fit">
            <Button className="flex-1 sm:flex-none">
              <Plus data-icon="inline-start" />
              Add task
            </Button>
            <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open add task menu">
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Upload />
                  Import CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LayoutTemplate />
                  Add from template
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bot />
                  Create automation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </div>

      <DragDropProvider onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden bg-muted/25 px-4 pt-4 pb-0 [scrollbar-color:var(--border)_transparent] lg:px-5 lg:pt-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
          <div className="inline-grid h-full min-w-full grid-cols-[repeat(5,minmax(20rem,1fr))] gap-4">
            {orderedColumns.map((column, index) => (
              <KanbanColumn key={column.id} column={column} index={index} tasks={board[column.id]} />
            ))}
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {(source) => {
            if (source.type !== "task" || !isTaskDragData(source.data)) {
              return null;
            }

            const columnId = isSortable(source) && isColumnId(source.group) ? source.group : source.data.columnId;

            return <TaskCard task={source.data.task} columnId={columnId} isOverlay />;
          }}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}
