"use client";

import { ChartLine } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AssetsBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <ChartLine className="size-5" />
            </span>
            Savings Rate
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="font-medium text-xl tabular-nums">32%</p>
          <p className="text-muted-foreground text-xs">This month</p>
        </div>

        <Separator />

        <p className="text-muted-foreground text-xs">After expenses</p>
      </CardContent>
    </Card>
  );
}
