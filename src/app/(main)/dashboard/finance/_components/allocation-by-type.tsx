import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";

import { getAllocationByType, totalBalance } from "./accounts";

const sliceClasses: Record<string, string> = {
  bank: "bg-chart-1",
  savings: "bg-chart-2",
  investment: "bg-chart-3",
  crypto: "bg-chart-4",
  reserve: "bg-chart-5",
};

export function AllocationByType() {
  const slices = getAllocationByType();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Allocation by type</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl tabular-nums leading-none tracking-tight">
              {formatCurrency(totalBalance, { noDecimals: true })}
            </span>
            <span className="text-muted-foreground text-xs">Total</span>
          </div>
          <p className="text-muted-foreground text-xs">USD-normalized across all linked accounts</p>
        </div>

        <div
          role="img"
          aria-label={`Allocation: ${slices
            .map((slice) => `${Math.round(slice.percentage * 100)}% ${slice.label.toLowerCase()}`)
            .join(", ")}`}
          className="flex h-3 w-full overflow-hidden rounded-md"
        >
          {slices.map((slice) => (
            <div
              key={slice.type}
              aria-hidden="true"
              className={cn("h-full", sliceClasses[slice.type] ?? "bg-muted")}
              style={{ width: `${slice.percentage * 100}%` }}
              title={`${slice.label} · ${formatCurrency(slice.amount, { noDecimals: true })}`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {slices.map((slice, index) => (
            <div key={slice.type} className="flex flex-col gap-3">
              {index > 0 ? <Separator className="border-dashed bg-transparent" /> : null}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", sliceClasses[slice.type] ?? "bg-muted")} />
                  <span className="font-medium text-sm">{slice.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm tabular-nums">{formatCurrency(slice.amount, { noDecimals: true })}</span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {Math.round(slice.percentage * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
