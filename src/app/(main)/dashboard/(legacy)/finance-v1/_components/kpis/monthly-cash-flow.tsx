"use client";

import { Calendar, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function MonthlyCashFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="bg-muted grid size-7 place-content-center rounded-sm">
              <Calendar className="size-5" />
            </span>
            Monthly Cash Flow
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <p className="text-xl font-medium tabular-nums">+{formatCurrency(2780, { noDecimals: true })}</p>
          <p className="text-muted-foreground text-xs">This month · Net</p>
        </div>

        <Separator />
        <p className="text-muted-foreground flex items-center text-xs">
          <TrendingUp className="size-4" />
          &nbsp;4.1% MoM
        </p>
      </CardContent>
    </Card>
  );
}
