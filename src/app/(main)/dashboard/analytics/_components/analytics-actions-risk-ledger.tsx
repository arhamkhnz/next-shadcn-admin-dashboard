"use client";

import * as React from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";

type LedgerPriority = "Escalate" | "Coach" | "Reforecast" | null;

type LedgerRow = {
  id: number;
  account: string;
  dealId: string;
  stage: string;
  blocker: string;
  owner: string;
  idleDays: number;
  closeVariance: string;
  priority: LedgerPriority;
  nextAction: string;
  riskScore: number;
};

const LEDGER_ROWS: LedgerRow[] = [
  {
    id: 1,
    account: "Oscorp Labs",
    dealId: "OPP-489",
    stage: "Legal",
    blocker: "Close date overdue by 35 days",
    owner: "Leila Zhang",
    idleDays: 36,
    closeVariance: "35d overdue",
    priority: "Escalate",
    nextAction: "Join next customer call and reset close plan.",
    riskScore: 81,
  },
  {
    id: 2,
    account: "Hooli AI",
    dealId: "OPP-475",
    stage: "Qualification",
    blocker: "Close date overdue by 28 days",
    owner: "Omar Ali",
    idleDays: 33,
    closeVariance: "28d overdue",
    priority: "Coach",
    nextAction: "Review deal strategy and unblock stage exit.",
    riskScore: 76,
  },
  {
    id: 3,
    account: "Globex Systems",
    dealId: "OPP-447",
    stage: "Qualification",
    blocker: "Close date overdue by 37 days",
    owner: "Sofia Bautista",
    idleDays: 34,
    closeVariance: "37d overdue",
    priority: "Coach",
    nextAction: "Review deal strategy and unblock stage exit.",
    riskScore: 75,
  },
  {
    id: 4,
    account: "Umbrella Corp",
    dealId: "OPP-459",
    stage: "Legal",
    blocker: "Close date overdue by 24 days",
    owner: "Leila Zhang",
    idleDays: 29,
    closeVariance: "24d overdue",
    priority: "Coach",
    nextAction: "Review deal strategy and unblock stage exit.",
    riskScore: 72,
  },
  {
    id: 5,
    account: "Acme Industries",
    dealId: "OPP-421",
    stage: "Negotiation",
    blocker: "Close date overdue by 32 days",
    owner: "Leila Zhang",
    idleDays: 31,
    closeVariance: "32d overdue",
    priority: "Coach",
    nextAction: "Review deal strategy and unblock stage exit.",
    riskScore: 69,
  },
  {
    id: 6,
    account: "Wayne Devices",
    dealId: "OPP-471",
    stage: "Proposal",
    blocker: "Close date overdue by 22 days",
    owner: "Sofia Bautista",
    idleDays: 32,
    closeVariance: "22d overdue",
    priority: "Reforecast",
    nextAction: "Adjust forecast category and expected close.",
    riskScore: 56,
  },
  {
    id: 7,
    account: "Aperture Health",
    dealId: "OPP-497",
    stage: "Proposal",
    blocker: "Close date overdue by 20 days",
    owner: "Omar Ali",
    idleDays: 30,
    closeVariance: "20d overdue",
    priority: "Reforecast",
    nextAction: "Adjust forecast category and expected close.",
    riskScore: 50,
  },
  {
    id: 8,
    account: "Northwind Labs",
    dealId: "OPP-438",
    stage: "Proposal",
    blocker: "Close date overdue by 14 days",
    owner: "Julian Singh",
    idleDays: 23,
    closeVariance: "14d overdue",
    priority: null,
    nextAction: "No immediate intervention required.",
    riskScore: 42,
  },
  {
    id: 9,
    account: "Stark Logistics",
    dealId: "OPP-463",
    stage: "Negotiation",
    blocker: "Close date overdue by 10 days",
    owner: "Julian Singh",
    idleDays: 21,
    closeVariance: "10d overdue",
    priority: null,
    nextAction: "No immediate intervention required.",
    riskScore: 39,
  },
  {
    id: 10,
    account: "Soylent Foods",
    dealId: "OPP-482",
    stage: "Negotiation",
    blocker: "Close date overdue by 5 days",
    owner: "Julian Singh",
    idleDays: 24,
    closeVariance: "5d overdue",
    priority: null,
    nextAction: "No immediate intervention required.",
    riskScore: 31,
  },
];

const priorityTone: Record<Exclude<LedgerPriority, null>, string> = {
  Escalate: "border-destructive/35 bg-destructive/10 text-destructive",
  Coach: "border-primary/35 bg-primary/10 text-primary",
  Reforecast: "border-amber-500/35 bg-amber-500/10 text-amber-700",
};

const ledgerColumns: ColumnDef<LedgerRow>[] = [
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">{row.original.account}</p>
        <p className="text-muted-foreground text-xs">
          {row.original.dealId} · {row.original.stage}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "blocker",
    header: "Blocker",
    cell: ({ row }) => <div className="max-w-44 text-xs">{row.original.blocker}</div>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => <span className="text-xs">{row.original.owner}</span>,
  },
  {
    accessorKey: "idleDays",
    header: "Idle (days)",
    cell: ({ row }) => <span className="text-xs tabular-nums">{row.original.idleDays}d</span>,
  },
  {
    accessorKey: "closeVariance",
    header: "Close variance",
    cell: ({ row }) => <span className="text-xs tabular-nums">{row.original.closeVariance}</span>,
  },
  {
    accessorKey: "nextAction",
    header: "Next action",
    cell: ({ row }) => (
      <div className="flex max-w-64 flex-col gap-1">
        {row.original.priority ? (
          <Badge variant="outline" className={cn("text-[10px] uppercase", priorityTone[row.original.priority])}>
            {row.original.priority}
          </Badge>
        ) : null}
        <p className="text-xs">{row.original.nextAction}</p>
      </div>
    ),
  },
  {
    accessorKey: "riskScore",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 h-8 px-2 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Risk Ladder
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Badge
          variant="outline"
          className={cn(
            "min-w-12 justify-center font-medium tabular-nums",
            row.original.riskScore >= 80 && "border-destructive/35 bg-destructive/10 text-destructive",
            row.original.riskScore >= 65 &&
              row.original.riskScore < 80 &&
              "border-amber-500/35 bg-amber-500/10 text-amber-700",
          )}
        >
          {row.original.riskScore}
        </Badge>
      </div>
    ),
  },
];

export function ActionsRiskLedger() {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "riskScore", desc: true }]);

  const table = useReactTable({
    data: LEDGER_ROWS,
    columns: ledgerColumns,
    getRowId: (row) => String(row.id),
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Revenue Risk Ledger</CardTitle>
        <CardDescription>Accounts under pressure with blocker, next action, and owner responsibility.</CardDescription>
        <CardAction>
          <Badge variant="outline" className="font-medium tabular-nums">
            {LEDGER_ROWS.length} Accounts
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 text-sm sm:grid-cols-4 sm:divide-x sm:divide-border/60">
          <LedgerStat label="Critical accounts" value="1" detail="Risk Ladder >= 80 (current window)" />
          <LedgerStat label="Escalations due" value="1" detail="Next 7 days" />
          <LedgerStat label="Median inactivity" value="31d" detail="Current filter window" />
          <LedgerStat
            label="Overdue revenue"
            value={formatCurrency(1084000, { noDecimals: true })}
            detail="Close date already exceeded"
          />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function LedgerStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="flex flex-col gap-1 px-0 sm:px-3 last:sm:pr-0 first:sm:pl-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-base tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{detail}</p>
    </div>
  );
}
