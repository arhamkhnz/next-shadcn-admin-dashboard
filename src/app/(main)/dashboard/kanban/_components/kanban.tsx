"use client";

import * as React from "react";

import { useSearchParams } from "next/navigation";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columnIds, columns } from "./data";
import { KanbanColumn } from "./kanban-column";
import { KanbanList } from "./kanban-list";
import { KanbanListDnd } from "./kanban-list-dnd";
import { KanbanTable } from "./kanban-table";
import { KanbanTableDnd } from "./kanban-table-dnd";
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
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view");
  const view = requestedView === "list" || requestedView === "table" ? requestedView : "board";
  const [board, setBoard] = React.useState<BoardState>(initialBoard);
  const [tableOrder, setTableOrder] = React.useState(() =>
    columnIds.flatMap((id) => initialBoard[id].map((task) => task.id)),
  );
  const [columnOrder, setColumnOrder] = React.useState<ColumnId[]>(columnIds);
  const boardBeforeDrag = React.useRef<BoardState>(initialBoard);
  const orderedColumns = columnOrder.flatMap((columnId) => columns.find((column) => column.id === columnId) ?? []);

  function changeView(value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", value);
    window.history.pushState(null, "", url);
  }

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
    <Tabs
      value={view}
      onValueChange={changeView}
      className="h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 gap-0 overflow-hidden"
    >
      <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
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

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center 2xl:justify-end">
          <InputGroup className="min-w-0 sm:w-64 2xl:w-48">
            <InputGroupInput type="text" aria-label="Search tasks" placeholder="Search tasks" />
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

      <TabsContent value="board" className="min-h-0 min-w-0 flex-col data-[state=active]:flex">
        <DragDropProvider onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="bg-muted/25 [&::-webkit-scrollbar-thumb]:bg-border min-h-0 min-w-0 flex-1 scrollbar-thin [scrollbar-color:var(--border)_transparent] overflow-x-auto overflow-y-hidden px-4 pt-4 pb-0 lg:px-5 lg:pt-5 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
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
      </TabsContent>
      <TabsContent value="list" className="relative min-h-0 overflow-y-auto overscroll-y-contain">
        <KanbanListDnd board={board} setBoard={setBoard}>
          <KanbanList board={board} columns={orderedColumns} />
        </KanbanListDnd>
      </TabsContent>
      <TabsContent value="table" className="min-h-0 min-w-0 flex-col data-[state=active]:flex">
        <KanbanTableDnd order={tableOrder} setOrder={setTableOrder}>
          <KanbanTable board={board} columns={orderedColumns} setBoard={setBoard} order={tableOrder} />
        </KanbanTableDnd>
      </TabsContent>
    </Tabs>
  );
}
