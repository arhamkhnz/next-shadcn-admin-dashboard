"use client";

import * as React from "react";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
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

import { DealCard } from "./deal-card";
import { KanbanColumn } from "./kanban-column";
import type { BoardState, ColumnId, Deal } from "./types";
import { columns } from "./types";
import { findColumnId, findDeal } from "./utils";

interface KanbanProps {
  initialBoard: BoardState;
}

export function Kanban({ initialBoard }: KanbanProps) {
  const [board, setBoard] = React.useState<BoardState>(initialBoard);
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null);
  const [activeColumnId, setActiveColumnId] = React.useState<ColumnId | null>(null);
  const boardBeforeDrag = React.useRef<BoardState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart(event: DragStartEvent) {
    boardBeforeDrag.current = board;
    const deal = findDeal(board, String(event.active.id));
    setActiveDeal(deal ?? null);
    setActiveColumnId(findColumnId(board, String(event.active.id)) ?? null);
  }

  function handleDragCancel() {
    if (boardBeforeDrag.current) {
      setBoard(boardBeforeDrag.current);
    }
    boardBeforeDrag.current = null;
    setActiveDeal(null);
    setActiveColumnId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColId = findColumnId(currentBoard, activeId);
      const overColId = findColumnId(currentBoard, overId);

      if (overColId) setActiveColumnId(overColId);

      if (!activeColId || !overColId || activeColId === overColId) return currentBoard;

      const activeItems = currentBoard[activeColId];
      const overItems = currentBoard[overColId];
      const activeIndex = activeItems.findIndex((deal) => deal.id === activeId);
      if (activeIndex === -1) return currentBoard;

      const overIndex = overItems.findIndex((deal) => deal.id === overId);
      const nextIndex = overIndex >= 0 ? overIndex : overItems.length;
      const activeItem = activeItems[activeIndex];

      return {
        ...currentBoard,
        [activeColId]: activeItems.filter((deal) => deal.id !== activeId),
        [overColId]: [...overItems.slice(0, nextIndex), activeItem, ...overItems.slice(nextIndex)],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const snapshot = boardBeforeDrag.current;
    boardBeforeDrag.current = null;
    setActiveDeal(null);
    setActiveColumnId(null);

    if (!over) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColumnId = findColumnId(currentBoard, activeId);
      const overColumnId = findColumnId(currentBoard, overId);
      if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId) return currentBoard;

      const columnDeals = currentBoard[activeColumnId];
      const activeIndex = columnDeals.findIndex((deal) => deal.id === activeId);
      const overIndex = columnDeals.findIndex((deal) => deal.id === overId);
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return currentBoard;

      return {
        ...currentBoard,
        [activeColumnId]: arrayMove(columnDeals, activeIndex, overIndex),
      };
    });
  }

  return (
    <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b px-6 py-3">
        <Tabs defaultValue="board">
          <TabsList>
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

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <InputGroup className="min-w-0 sm:w-48">
            <InputGroupInput type="search" placeholder="Search deals" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button variant="outline">
            <SlidersHorizontal data-icon="inline-start" />
            Filter
          </Button>
          <Button variant="outline">
            <ArrowUpDown data-icon="inline-start" />
            Sort
          </Button>
          <ButtonGroup>
            <Button>
              <Plus data-icon="inline-start" />
              Add deal
            </Button>
            <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open add deal menu">
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

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="h-full min-w-0 overflow-x-auto overflow-y-hidden p-4 lg:p-5">
            <div className="grid h-full min-w-[1420px] grid-cols-5 gap-4">
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column} deals={board[column.id]} />
              ))}
            </div>
          </div>
          <DragOverlay dropAnimation={null}>
            {activeDeal ? <DealCard deal={activeDeal} columnId={activeColumnId ?? undefined} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
