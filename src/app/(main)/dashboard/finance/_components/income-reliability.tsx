"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function IncomeReliability() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Reliability</CardTitle>
        <CardDescription>How consistent your income has been recently.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-0.5">
          <p className="font-medium text-xl">High Reliability</p>
          <p className="text-muted-foreground text-xs">Based on last 6 months of income</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-lg">Fixed Income</p>
            <p className="text-muted-foreground text-xs">Recurring · Predictable</p>
          </div>
          <p className="font-medium text-lg">{formatCurrency(90000, { noDecimals: true })}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-lg">Variable Income</p>
            <p className="text-muted-foreground text-xs">Fluctuating sources</p>
          </div>
          <p className="font-medium text-lg">{formatCurrency(46500, { noDecimals: true })}</p>
        </div>
        <Separator />
        <p className="text-muted-foreground text-xs">
          Consistency trend: <span className="font-medium text-primary">Stable</span>
        </p>
      </CardContent>
    </Card>
  );
}
