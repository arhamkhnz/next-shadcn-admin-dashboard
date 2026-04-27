"use client";

import { HandCoins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SavingsRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <HandCoins className="size-5" />
            </span>
            Savings Rate
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">32%</p>
            <span className="text-xs">+3.5% MoM</span>
          </div>
          <p className="text-muted-foreground text-xs">This month · After expenses</p>
        </div>

        <Separator />

        <p className="text-muted-foreground text-xs">Above your average</p>
      </CardContent>
    </Card>
  );
}
