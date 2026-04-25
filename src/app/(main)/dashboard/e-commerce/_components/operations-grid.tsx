import type { ComponentType } from "react";

import { AlertCircle, CheckCircle2, CircleDotDashed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { funnelStages, type InventoryRisk, inventoryRisks } from "./data";

const riskStyles = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
} satisfies Record<InventoryRisk["risk"], string>;

const riskIcons = {
  High: AlertCircle,
  Medium: CircleDotDashed,
  Low: CheckCircle2,
} satisfies Record<InventoryRisk["risk"], ComponentType<{ className?: string }>>;

export function OperationsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <CheckoutFunnelCard />
      <InventoryRiskCard />
    </div>
  );
}

function CheckoutFunnelCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Checkout funnel</CardTitle>
        <CardDescription>Session flow from product discovery to paid orders.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funnelStages.map((stage) => (
          <div key={stage.stage} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-medium text-sm">{stage.stage}</div>
                <div className="text-muted-foreground text-xs tabular-nums">{stage.count.toLocaleString("en-US")}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="outline" className="font-medium tabular-nums">
                  {stage.change}
                </Badge>
                <span className="w-12 text-right text-muted-foreground text-sm tabular-nums">{stage.rate}%</span>
              </div>
            </div>
            <Progress value={stage.rate} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InventoryRiskCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Inventory watch</CardTitle>
        <CardDescription>Fast-moving SKUs and replenishment pressure.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted/15">
              <TableRow>
                <TableHead className="h-10 px-3">SKU</TableHead>
                <TableHead className="h-10 px-3">Product</TableHead>
                <TableHead className="h-10 px-3 text-right">Days</TableHead>
                <TableHead className="h-10 px-3 text-right">Sell-through</TableHead>
                <TableHead className="h-10 px-3">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryRisks.map((item) => {
                const Icon = riskIcons[item.risk];

                return (
                  <TableRow key={item.sku}>
                    <TableCell className="px-3 font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="min-w-48 px-3">
                      <div className="font-medium text-sm">{item.product}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.channel} - {item.stock} units
                      </div>
                    </TableCell>
                    <TableCell className="px-3 text-right font-medium tabular-nums">{item.daysLeft}</TableCell>
                    <TableCell className="px-3 text-right tabular-nums">{item.sellThrough}%</TableCell>
                    <TableCell className="px-3">
                      <Badge variant="secondary" className={cn("font-medium", riskStyles[item.risk])}>
                        <Icon />
                        {item.risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
