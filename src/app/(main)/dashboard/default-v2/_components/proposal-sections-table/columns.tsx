"use client";
"use no memo";

import { useSortable } from "@dnd-kit/sortable";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  EllipsisVerticalIcon,
  GripVerticalIcon,
  LoaderIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

import type { ProposalSectionsRow } from "./schema";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function ProposalSectionDetailViewer({ item }: { item: ProposalSectionsRow }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.customer}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.customer}</DrawerTitle>
          <DrawerDescription>Account activity and ownership details for the current quarter</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <TrendingUpIcon />
                </div>
                <div className="text-muted-foreground">
                  Recent activity for this account over the last 6 months. Use this panel to review plan, owner, and
                  account scale before making updates.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" defaultValue={item.customer} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="plan">Plan</Label>
                <Select defaultValue={item.plan}>
                  <SelectTrigger id="plan" className="w-full">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Starter">Starter</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Trial">Trial</SelectItem>
                      <SelectItem value="At Risk">At Risk</SelectItem>
                      <SelectItem value="Upgraded">Upgraded</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="revenue">Revenue</Label>
                <Input id="revenue" defaultValue={item.revenue} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="accounts">Accounts</Label>
                <Input id="accounts" defaultValue={item.accounts} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="owner">Owner</Label>
              <Select defaultValue={item.owner}>
                <SelectTrigger id="owner" className="w-full">
                  <SelectValue placeholder="Select an owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem value="Maya Johnson">Maya Johnson</SelectItem>
                    <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                    <SelectItem value="Raj Patel">Raj Patel</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function createInlineSaveHandler(customer: string) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: `Saving ${customer}`,
      success: "Done",
      error: "Error",
    });
  };
}

export const proposalSectionsColumns: ColumnDef<ProposalSectionsRow>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <ProposalSectionDetailViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.plan}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status === "Active" || row.original.status === "Upgraded" ? (
          <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />
        ) : row.original.status === "At Risk" ? (
          <CircleAlertIcon className="fill-orange-500 stroke-primary-foreground dark:fill-orange-600" />
        ) : (
          <LoaderIcon />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "revenue",
    header: () => <div className="w-full text-right">Revenue</div>,
    cell: ({ row }) => (
      <form onSubmit={createInlineSaveHandler(row.original.customer)}>
        <Label htmlFor={`${row.original.id}-revenue`} className="sr-only">
          Revenue
        </Label>
        <Input
          id={`${row.original.id}-revenue`}
          defaultValue={row.original.revenue}
          className="h-8 w-24 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:focus-visible:bg-input/30 dark:hover:bg-input/30"
        />
      </form>
    ),
  },
  {
    accessorKey: "accounts",
    header: () => <div className="w-full text-right">Accounts</div>,
    cell: ({ row }) => (
      <form onSubmit={createInlineSaveHandler(row.original.customer)}>
        <Label htmlFor={`${row.original.id}-accounts`} className="sr-only">
          Accounts
        </Label>
        <Input
          id={`${row.original.id}-accounts`}
          defaultValue={row.original.accounts}
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:focus-visible:bg-input/30 dark:hover:bg-input/30"
        />
      </form>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const isAssigned = row.original.owner !== "Assign owner";

      if (isAssigned) {
        return row.original.owner;
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-owner`} className="sr-only">
            Owner
          </Label>
          <Select>
            <SelectTrigger
              id={`${row.original.id}-owner`}
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
            >
              <SelectValue placeholder="Assign owner" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                <SelectItem value="Maya Johnson">Maya Johnson</SelectItem>
                <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <EllipsisVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];

export function DraggableProposalSectionsRow({ row }: { row: Row<ProposalSectionsRow> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}
