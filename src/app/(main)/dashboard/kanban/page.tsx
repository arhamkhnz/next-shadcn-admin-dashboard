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
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowUpDown,
  Bot,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  FileText,
  Gauge,
  Kanban,
  List,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  UsersRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency } from "@/lib/utils";

const columns = [
  { id: "lead", title: "Lead", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "qualified", title: "Qualified", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "proposal", title: "Proposal", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "negotiation", title: "Negotiation", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  {
    id: "won",
    title: "Won",
    accent: "text-emerald-700 dark:text-emerald-300",
    countTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
] as const;

type ColumnId = (typeof columns)[number]["id"];

type DealTag =
  | "Analytics"
  | "Automation"
  | "Branding"
  | "Consulting"
  | "CRM"
  | "Design"
  | "Dev"
  | "E-commerce"
  | "Enterprise"
  | "Growth"
  | "Integration"
  | "IT"
  | "Marketing"
  | "Mobile"
  | "Platform"
  | "Software"
  | "Web";

type Deal = {
  id: string;
  company: string;
  description: string;
  amount: number;
  date: string;
  tags: DealTag[];
  comments: number;
  files: number;
  logo: string;
  logoTone: string;
  assignee: string;
  assigneeTone: string;
  won?: boolean;
};

type BoardState = Record<ColumnId, Deal[]>;

const columnIds = columns.map((column) => column.id) as ColumnId[];

const tagTones: Record<DealTag, string> = {
  Analytics: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  Automation: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Branding: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Consulting: "bg-red-500/10 text-red-700 dark:text-red-300",
  CRM: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Design: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Dev: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "E-commerce": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Enterprise: "bg-red-500/10 text-red-700 dark:text-red-300",
  Growth: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Integration: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  IT: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Marketing: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  Mobile: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Platform: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Software: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Web: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
};

const initialBoard: BoardState = {
  lead: [
    {
      id: "orion-labs",
      company: "Orion Labs",
      description: "Website redesign",
      amount: 24_000,
      date: "May 16",
      tags: ["Web", "Design"],
      comments: 2,
      files: 1,
      logo: "O",
      logoTone: "bg-indigo-950 text-white dark:bg-indigo-400 dark:text-indigo-950",
      assignee: "AM",
      assigneeTone: "bg-amber-100 text-amber-950 dark:bg-amber-300",
    },
    {
      id: "pioneer-foods",
      company: "Pioneer Foods",
      description: "E-commerce platform",
      amount: 18_500,
      date: "May 20",
      tags: ["E-commerce", "Dev"],
      comments: 1,
      files: 1,
      logo: "P",
      logoTone: "bg-green-500 text-white",
      assignee: "DR",
      assigneeTone: "bg-orange-100 text-orange-950 dark:bg-orange-300",
    },
    {
      id: "summit-realty",
      company: "Summit Realty",
      description: "CRM implementation",
      amount: 15_000,
      date: "May 28",
      tags: ["CRM", "Consulting"],
      comments: 0,
      files: 2,
      logo: "S",
      logoTone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
      assignee: "JL",
      assigneeTone: "bg-yellow-100 text-yellow-950 dark:bg-yellow-300",
    },
  ],
  qualified: [
    {
      id: "bluewave-solutions",
      company: "Bluewave Solutions",
      description: "Marketing automation setup",
      amount: 32_000,
      date: "May 22",
      tags: ["Marketing", "Automation"],
      comments: 2,
      files: 3,
      logo: "B",
      logoTone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      assignee: "NK",
      assigneeTone: "bg-stone-200 text-stone-950 dark:bg-stone-300",
    },
    {
      id: "nova-tech",
      company: "Nova Tech",
      description: "Mobile app development",
      amount: 45_000,
      date: "May 30",
      tags: ["Mobile", "Dev"],
      comments: 1,
      files: 2,
      logo: "N",
      logoTone: "bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950",
      assignee: "AM",
      assigneeTone: "bg-amber-100 text-amber-950 dark:bg-amber-300",
    },
    {
      id: "brightly",
      company: "Brightly",
      description: "Brand identity design",
      amount: 9_500,
      date: "Jun 2",
      tags: ["Design", "Branding"],
      comments: 0,
      files: 1,
      logo: "B",
      logoTone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      assignee: "DR",
      assigneeTone: "bg-orange-100 text-orange-950 dark:bg-orange-300",
    },
    {
      id: "greenfield-inc",
      company: "Greenfield Inc.",
      description: "IT infrastructure upgrade",
      amount: 70_000,
      date: "Jun 5",
      tags: ["IT", "Consulting"],
      comments: 1,
      files: 4,
      logo: "G",
      logoTone: "bg-green-500/10 text-green-700 dark:text-green-300",
      assignee: "NK",
      assigneeTone: "bg-stone-200 text-stone-950 dark:bg-stone-300",
    },
  ],
  proposal: [
    {
      id: "techsphere",
      company: "TechSphere",
      description: "Custom software solution",
      amount: 75_000,
      date: "Jun 10",
      tags: ["Software", "Dev"],
      comments: 2,
      files: 3,
      logo: "T",
      logoTone: "bg-blue-600 text-white",
      assignee: "AM",
      assigneeTone: "bg-amber-100 text-amber-950 dark:bg-amber-300",
    },
    {
      id: "lumen-corp",
      company: "Lumen Corp",
      description: "Data analytics platform",
      amount: 50_000,
      date: "Jun 12",
      tags: ["Analytics", "Platform"],
      comments: 1,
      files: 2,
      logo: "L",
      logoTone: "bg-indigo-600 text-white",
      assignee: "NK",
      assigneeTone: "bg-stone-200 text-stone-950 dark:bg-stone-300",
    },
    {
      id: "wellness-co",
      company: "Wellness Co.",
      description: "Customer portal development",
      amount: 50_000,
      date: "Jun 15",
      tags: ["Web", "Dev"],
      comments: 0,
      files: 1,
      logo: "W",
      logoTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      assignee: "JL",
      assigneeTone: "bg-yellow-100 text-yellow-950 dark:bg-yellow-300",
    },
  ],
  negotiation: [
    {
      id: "apex-industries",
      company: "Apex Industries",
      description: "Manufacturing CRM",
      amount: 60_000,
      date: "Jun 20",
      tags: ["CRM", "Enterprise"],
      comments: 2,
      files: 4,
      logo: "A",
      logoTone: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      assignee: "NK",
      assigneeTone: "bg-stone-200 text-stone-950 dark:bg-stone-300",
    },
    {
      id: "velocity-partners",
      company: "Velocity Partners",
      description: "Lead generation campaign",
      amount: 50_000,
      date: "Jun 18",
      tags: ["Marketing", "Growth"],
      comments: 1,
      files: 2,
      logo: "V",
      logoTone: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
      assignee: "JL",
      assigneeTone: "bg-yellow-100 text-yellow-950 dark:bg-yellow-300",
    },
  ],
  won: [
    {
      id: "horizon-ltd",
      company: "Horizon Ltd.",
      description: "Website & branding package",
      amount: 45_000,
      date: "May 2",
      tags: ["Web", "Branding"],
      comments: 0,
      files: 0,
      logo: "H",
      logoTone: "bg-sky-600 text-white",
      assignee: "NK",
      assigneeTone: "bg-stone-200 text-stone-950 dark:bg-stone-300",
      won: true,
    },
    {
      id: "cloudsync",
      company: "CloudSync",
      description: "SaaS integration project",
      amount: 80_000,
      date: "Apr 28",
      tags: ["Integration", "Dev"],
      comments: 0,
      files: 0,
      logo: "C",
      logoTone: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      assignee: "AM",
      assigneeTone: "bg-amber-100 text-amber-950 dark:bg-amber-300",
      won: true,
    },
    {
      id: "finedge",
      company: "FinEdge",
      description: "Financial dashboard",
      amount: 80_000,
      date: "Apr 15",
      tags: ["Analytics", "Platform"],
      comments: 0,
      files: 0,
      logo: "F",
      logoTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      assignee: "DR",
      assigneeTone: "bg-orange-100 text-orange-950 dark:bg-orange-300",
      won: true,
    },
  ],
};

function isColumnId(id: string): id is ColumnId {
  return columnIds.includes(id as ColumnId);
}

function findColumnId(board: BoardState, id: string): ColumnId | undefined {
  if (isColumnId(id)) {
    return id;
  }

  return columnIds.find((columnId) => board[columnId].some((deal) => deal.id === id));
}

function findDeal(board: BoardState, id: string) {
  for (const columnId of columnIds) {
    const deal = board[columnId].find((item) => item.id === id);

    if (deal) {
      return deal;
    }
  }

  return undefined;
}

function getColumnTotal(deals: Deal[]) {
  return deals.reduce((total, deal) => total + deal.amount, 0);
}

export default function Page() {
  const [board, setBoard] = React.useState<BoardState>(initialBoard);
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveDeal(findDeal(board, String(event.active.id)) ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColumnId = findColumnId(currentBoard, activeId);
      const overColumnId = findColumnId(currentBoard, overId);

      if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
        return currentBoard;
      }

      const activeItems = currentBoard[activeColumnId];
      const overItems = currentBoard[overColumnId];
      const activeIndex = activeItems.findIndex((deal) => deal.id === activeId);
      const overIndex = overItems.findIndex((deal) => deal.id === overId);

      if (activeIndex === -1) {
        return currentBoard;
      }

      const nextIndex = overIndex >= 0 ? overIndex : overItems.length;
      const activeItem = activeItems[activeIndex];

      return {
        ...currentBoard,
        [activeColumnId]: activeItems.filter((deal) => deal.id !== activeId),
        [overColumnId]: [...overItems.slice(0, nextIndex), activeItem, ...overItems.slice(nextIndex)],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveDeal(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColumnId = findColumnId(currentBoard, activeId);
      const overColumnId = findColumnId(currentBoard, overId);

      if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId) {
        return currentBoard;
      }

      const columnDeals = currentBoard[activeColumnId];
      const activeIndex = columnDeals.findIndex((deal) => deal.id === activeId);
      const overIndex = columnDeals.findIndex((deal) => deal.id === overId);

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return currentBoard;
      }

      return {
        ...currentBoard,
        [activeColumnId]: arrayMove(columnDeals, activeIndex, overIndex),
      };
    });
  }

  return (
    <div
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-[680px] flex-col overflow-hidden bg-muted/25"
    >
      <div className="border-b bg-background">
        <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <Tabs defaultValue="board" className="min-w-0">
            <TabsList variant="line" className="h-10 gap-5 bg-transparent p-0">
              <TabsTrigger
                value="board"
                className="gap-2 px-0 data-active:text-blue-600 data-active:after:bg-blue-600 dark:data-active:text-blue-400 dark:data-active:after:bg-blue-400"
              >
                <Kanban />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2 px-0">
                <List />
                List
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2 px-0">
                <Table2 />
                Table
              </TabsTrigger>
              <TabsTrigger value="forecast" className="gap-2 px-0">
                <Gauge />
                Forecast
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="relative sm:w-48">
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
              <Input type="search" placeholder="Search deals" className="h-9 pl-8" />
            </div>
            <Button variant="outline" size="lg" className="h-9 justify-start">
              <SlidersHorizontal data-icon="inline-start" />
              Filter
            </Button>
            <Button variant="outline" size="lg" className="h-9 justify-start">
              <ArrowUpDown data-icon="inline-start" />
              Sort
            </Button>
            <Button variant="outline" size="lg" className="h-9 justify-start">
              <UsersRound data-icon="inline-start" />
              Group
            </Button>
            <Button variant="outline" size="lg" className="h-9 justify-start">
              <Bot data-icon="inline-start" />
              Automate
            </Button>
            <div className="flex">
              <Button size="lg" className="h-9 rounded-r-none bg-blue-600 px-3 text-white hover:bg-blue-700">
                <Plus data-icon="inline-start" />
                Add deal
              </Button>
              <Button
                size="icon-lg"
                aria-label="Open add deal menu"
                className="h-9 rounded-l-none border-l border-white/20 bg-blue-600 text-white hover:bg-blue-700"
              >
                <ChevronDown />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDeal(null)}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 lg:p-5">
          <div className="grid h-full min-w-[1420px] grid-cols-5 gap-4">
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} deals={board[column.id]} />
            ))}
          </div>
        </div>
        <DragOverlay dropAnimation={null}>{activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ column, deals }: { column: (typeof columns)[number]; deals: Deal[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-0 flex-col rounded-xl border bg-background/70 transition-colors",
        isOver && "bg-muted/70",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={cn("truncate font-semibold text-base", column.accent)}>{column.title}</h2>
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full font-medium text-xs",
                column.countTone,
              )}
            >
              {deals.length}
            </span>
          </div>
          <p className="mt-2 font-medium text-muted-foreground text-sm">
            {formatCurrency(getColumnTotal(deals), { noDecimals: true })}
          </p>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Button variant="ghost" size="icon-sm" aria-label={`Add deal to ${column.title}`}>
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`${column.title} column actions`}>
            <MoreHorizontal />
          </Button>
        </div>
      </div>

      <SortableContext items={deals.map((deal) => deal.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3">
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
          <Button
            variant="outline"
            className="h-12 shrink-0 border-dashed bg-background/40 text-muted-foreground hover:bg-muted/70"
          >
            <Plus data-icon="inline-start" />
            Add deal
          </Button>
        </div>
      </SortableContext>
    </section>
  );
}

function SortableDealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: {
      type: "deal",
      deal,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-30")}
      {...attributes}
      {...listeners}
    >
      <DealCard deal={deal} />
    </div>
  );
}

function DealCard({ deal, isOverlay = false }: { deal: Deal; isOverlay?: boolean }) {
  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-4 text-card-foreground shadow-xs",
        isOverlay && "w-[272px] rotate-1 shadow-lg",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg border border-foreground/10 font-semibold text-sm",
            deal.logoTone,
          )}
        >
          {deal.logo}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-sm leading-5">{deal.company}</h3>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-5">{deal.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm">
        <span className="font-semibold text-base">{formatCurrency(deal.amount, { noDecimals: true })}</span>
        <span className="h-4 w-px bg-border" />
        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="size-4" />
          <span className="truncate">{deal.date}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {deal.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn("rounded-md border-transparent px-2 font-medium", tagTones[tag])}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center border-t pt-3">
        {deal.won ? (
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 text-sm dark:text-emerald-300">
            <CircleCheck className="size-4" />
            Won
          </div>
        ) : (
          <div className="flex items-center gap-5 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="size-4" />
              {deal.comments}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="size-4" />
              {deal.files}
            </span>
          </div>
        )}
        <Avatar size="sm" className="ml-auto">
          <AvatarFallback className={cn("font-semibold text-[10px]", deal.assigneeTone)}>
            {deal.assignee}
          </AvatarFallback>
        </Avatar>
      </div>
    </article>
  );
}
