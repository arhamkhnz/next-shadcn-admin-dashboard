import { ArrowDownLeft } from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { formatCurrency } from "@/lib/utils";

import { accounts } from "./accounts";

type Inflow = {
  accountId: string;
  source: string;
  amount: number;
  expected: string;
};

const inflows: Inflow[] = [
  { accountId: "hsbc-checking", source: "Acme Corp · Salary", amount: 4560, expected: "May 25" },
  { accountId: "revolut-premium", source: "Upwork · Project payout", amount: 1412, expected: "May 28" },
  { accountId: "investment-brokerage", source: "VWRL · Quarterly dividend", amount: 86.4, expected: "Jun 12" },
];

const total = inflows.reduce((sum, inflow) => sum + inflow.amount, 0);

export function UpcomingInflows() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Upcoming inflows</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="flex items-baseline text-3xl tabular-nums leading-none tracking-tight">
            <span className="font-normal">{formatCurrency(total, { noDecimals: true })}</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-none">
            <span className="font-medium text-foreground">{inflows.length}</span> deposits expected this cycle
          </p>
        </div>
        <Badge className="w-max gap-1.5 rounded-md border border-border bg-muted/70 px-2 py-1.5 text-muted-foreground text-sm">
          <ArrowDownLeft aria-hidden="true" className="size-4 text-green-600 dark:text-green-400" />
          Net positive cash flow forecast
        </Badge>

        <div className="flex flex-col gap-3">
          {inflows.map((inflow) => {
            const account = accounts.find((candidate) => candidate.id === inflow.accountId);
            if (!account) return null;
            return (
              <Item key={`${inflow.accountId}-${inflow.source}`} variant="outline" size="xs">
                <ItemMedia>
                  <div aria-hidden="true" className="grid size-9 place-items-center rounded-md border bg-background">
                    <SimpleIcon icon={account.icon} aria-hidden="true" />
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{inflow.source}</ItemTitle>
                  <ItemDescription>
                    {inflow.expected} · {account.name}
                  </ItemDescription>
                </ItemContent>
                <span className="font-medium text-green-600 text-sm tabular-nums dark:text-green-400">
                  +{formatCurrency(inflow.amount, { noDecimals: true })}
                </span>
              </Item>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
