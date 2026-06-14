import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

import { type AccountType, accounts, getAllocationByType, totalBalance } from "./accounts";

const sliceClasses: Record<string, string> = {
  bank: "bg-chart-1",
  savings: "bg-chart-2",
  investment: "bg-chart-3",
  crypto: "bg-chart-4",
  reserve: "bg-chart-5",
};

const LIQUID_TYPES: AccountType[] = ["bank", "savings"];

export function AllocationByType() {
  const slices = getAllocationByType();

  const liquidTotal = accounts
    .filter((account) => LIQUID_TYPES.includes(account.type))
    .reduce((sum, account) => sum + account.balance, 0);
  const lockedTotal = totalBalance - liquidTotal;
  const liquidPct = totalBalance === 0 ? 0 : liquidTotal / totalBalance;
  const lockedPct = totalBalance === 0 ? 0 : lockedTotal / totalBalance;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Allocation by type</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl tabular-nums leading-none tracking-tight">
            {formatCurrency(totalBalance, { noDecimals: true })}
          </span>
          <span className="text-muted-foreground text-xs">Total</span>
        </div>

        <div
          role="img"
          aria-label={`Allocation: ${slices
            .map((slice) => `${Math.round(slice.percentage * 100)}% ${slice.label.toLowerCase()}`)
            .join(", ")}`}
          className="flex h-2 w-full overflow-hidden rounded-md"
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

        <ul className="flex flex-col gap-2">
          {slices.map((slice) => (
            <li key={slice.type} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", sliceClasses[slice.type] ?? "bg-muted")} />
                <span>{slice.label}</span>
              </span>
              <span className="flex items-baseline gap-2">
                <span className="tabular-nums">{formatCurrency(slice.amount, { noDecimals: true })}</span>
                <span className="text-muted-foreground tabular-nums">{Math.round(slice.percentage * 100)}%</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-auto text-muted-foreground text-xs tabular-nums">
          Liquid {Math.round(liquidPct * 100)}% <span className="text-muted-foreground/60">·</span> Locked{" "}
          {Math.round(lockedPct * 100)}%
        </p>
      </CardContent>
    </Card>
  );
}
