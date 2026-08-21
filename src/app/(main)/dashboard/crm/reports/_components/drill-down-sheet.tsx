"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type DrillDownRow, useReports } from "./reports-context";

export function ReportDrillDownSheet() {
  const { drillDown, closeDrillDown } = useReports();

  return (
    <Sheet open={Boolean(drillDown)} onOpenChange={(open) => (open ? undefined : closeDrillDown())}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>{drillDown ? drillDown.title : "Details"}</SheetTitle>
          {drillDown?.description ? <SheetDescription>{drillDown.description}</SheetDescription> : null}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {drillDown && drillDown.rows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drillDown.rows.map((row) => (
                  <DrillRowItem key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-6 text-muted-foreground text-sm">No records found for this selection.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DrillRowItem({ row }: { row: DrillDownRow }) {
  const title = row.href ? (
    <Link href={row.href} className="font-medium underline-offset-4 hover:underline">
      {row.title}
    </Link>
  ) : (
    <span className="font-medium">{row.title}</span>
  );

  return (
    <TableRow>
      <TableCell className="max-w-48 align-top">
        <div className="flex flex-col gap-1">
          {title}
          {row.subtitle ? <span className="text-muted-foreground text-xs">{row.subtitle}</span> : null}
        </div>
      </TableCell>
      <TableCell className="align-top">
        <div className="flex flex-wrap items-center gap-1.5">
          {row.badge ? (
            <Badge variant="outline" className={row.badge.className}>
              {row.badge.label}
            </Badge>
          ) : null}
          {(row.meta ?? []).map((item) => (
            <span key={item} className="text-muted-foreground text-xs tabular-nums">
              {item}
            </span>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}
