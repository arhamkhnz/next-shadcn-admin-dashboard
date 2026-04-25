import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";

import { type MerchandiseRow, merchandiseRows } from "./data";

const statusStyles = {
  Hero: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Scale: "bg-primary/10 text-primary",
  Protect: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Markdown: "bg-destructive/10 text-destructive",
} satisfies Record<MerchandiseRow["status"], string>;

export function MerchandiseMovementTable() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Merchandise movement</CardTitle>
        <CardDescription>Top SKUs by sales velocity, margin, returns, and stock cover.</CardDescription>
        <CardAction>
          <Badge variant="outline" className="font-medium">
            5 priority SKUs
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted/15">
              <TableRow>
                <TableHead className="h-11 px-3">Product</TableHead>
                <TableHead className="h-11 px-3">Category</TableHead>
                <TableHead className="h-11 px-3 text-right">Units</TableHead>
                <TableHead className="h-11 px-3 text-right">Net sales</TableHead>
                <TableHead className="h-11 px-3 text-right">Margin</TableHead>
                <TableHead className="h-11 px-3 text-right">Returns</TableHead>
                <TableHead className="h-11 px-3 text-right">Stock</TableHead>
                <TableHead className="h-11 px-3">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchandiseRows.map((row) => (
                <TableRow key={row.sku}>
                  <TableCell className="min-w-64 px-3">
                    <div className="font-medium text-sm">{row.product}</div>
                    <div className="font-mono text-muted-foreground text-xs">{row.sku}</div>
                  </TableCell>
                  <TableCell className="px-3 text-muted-foreground">{row.category}</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{row.units.toLocaleString("en-US")}</TableCell>
                  <TableCell className="px-3 text-right font-medium tabular-nums">
                    {formatCurrency(row.netSales, { noDecimals: true })}
                  </TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{row.margin}%</TableCell>
                  <TableCell className="px-3 text-right tabular-nums">
                    <span className="inline-flex items-center justify-end gap-1">
                      {row.returns > 6 ? (
                        <ArrowUpRight className="size-3 text-destructive" />
                      ) : (
                        <ArrowDownRight className="size-3 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {row.returns}%
                    </span>
                  </TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{row.stock}</TableCell>
                  <TableCell className="px-3">
                    <Badge variant="secondary" className={cn("font-medium", statusStyles[row.status])}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
