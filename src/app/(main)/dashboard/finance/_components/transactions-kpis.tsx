import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

import transactionsData from "./transactions-table/data.json";
import { type TransactionRow, transactionsSchema } from "./transactions-table/schema";

const transactions = transactionsSchema.parse(transactionsData);

function thisMonth(row: TransactionRow) {
  return row.date.startsWith("2026-05");
}

const monthRows = transactions.filter(thisMonth);
const inflow = monthRows.filter((row) => row.amount > 0).reduce((sum, row) => sum + row.amount, 0);
const outflow = monthRows.filter((row) => row.amount < 0).reduce((sum, row) => sum + row.amount, 0);
const net = inflow + outflow;

export function TransactionsKpis() {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 xl:grid-cols-12">
        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-4 xl:border-r xl:border-b-0">
          <CardHeader>
            <CardTitle className="font-normal">Inflow this month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl tabular-nums leading-none tracking-tight">
                {formatCurrency(inflow, { noDecimals: true })}
              </div>
              <p className="text-muted-foreground text-xs">
                {monthRows.filter((row) => row.amount > 0).length} credits
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-4 xl:border-r xl:border-b-0">
          <CardHeader>
            <CardTitle className="font-normal">Outflow this month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl tabular-nums leading-none tracking-tight">
                {formatCurrency(outflow, { noDecimals: true })}
              </div>
              <p className="text-muted-foreground text-xs">{monthRows.filter((row) => row.amount < 0).length} debits</p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Net this month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div
                className={cn(
                  "text-3xl tabular-nums leading-none tracking-tight",
                  net >= 0 ? "text-green-700 dark:text-green-300" : "text-destructive",
                )}
              >
                {net >= 0 ? "+" : ""}
                {formatCurrency(net, { noDecimals: true })}
              </div>
              <p className="text-muted-foreground text-xs">{monthRows.length} transactions to date</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
