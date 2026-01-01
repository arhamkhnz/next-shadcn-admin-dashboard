"use client";

import { SaudiRiyal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function NetWorth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <SaudiRiyal className="size-5" />
            </span>
            Net Worth
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">{formatCurrency(84250, { noDecimals: true })}</p>
            <span className="text-xs">+$3,680 MoM</span>
          </div>
          <p className="text-muted-foreground text-xs">This month</p>
        </div>

        <Separator />

        <p className="text-muted-foreground text-xs">Across all linked accounts</p>
      </CardContent>
    </Card>
  );
}
