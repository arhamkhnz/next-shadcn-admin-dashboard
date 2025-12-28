"use client";

import { ArrowUpRight, SaudiRiyal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <SaudiRiyal className="size-5" />
            </span>
            Recent Transactions
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">{formatCurrency(84250, { noDecimals: true })}</p>
            <Badge variant="outline">+$3,680</Badge>
          </div>
          <p className="text-muted-foreground text-xs">This month</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Assets</p>

            <p className="font-medium text-xl tabular-nums">{formatCurrency(112820, { noDecimals: true })}</p>
          </div>

          <div className="space-y-1">
            <p className="text-right text-muted-foreground text-xs">Best Month</p>

            <p className="font-medium text-xl tabular-nums">{formatCurrency(36500, { noDecimals: true })}</p>
          </div>
        </div>

        <Progress value={63} />

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">Net Saved</p>

          <div className="flex items-center gap-1">
            <p className="font-medium tabular-nums">{formatCurrency(2780, { noDecimals: true })}</p>
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
