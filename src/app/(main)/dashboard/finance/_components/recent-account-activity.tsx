import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn, formatCurrency } from "@/lib/utils";

import { accounts } from "./accounts";

type ActivityEntry = {
  accountId: string;
  description: string;
  date: string;
  amount: number;
};

const activity: ActivityEntry[] = [
  { accountId: "revolut-premium", description: "Tesco Express", date: "Today · 14:32", amount: -42.15 },
  { accountId: "revolut-premium", description: "Apple Pay top-up", date: "Yesterday · 09:11", amount: 250 },
  { accountId: "hsbc-checking", description: "Standing order · Rent", date: "May 16 · 09:00", amount: -1180 },
  { accountId: "binance-btc", description: "Spot buy · BTC", date: "May 15 · 22:48", amount: -1500 },
  { accountId: "investment-brokerage", description: "Dividend · VWRL", date: "May 14 · 16:00", amount: 86.4 },
];

export function RecentAccountActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3">
          {activity.map((entry) => {
            const account = accounts.find((candidate) => candidate.id === entry.accountId);
            if (!account) return null;
            const positive = entry.amount >= 0;
            return (
              <Item key={`${entry.accountId}-${entry.description}`} variant="outline" size="xs">
                <ItemMedia>
                  <div aria-hidden="true" className="grid size-8 place-items-center rounded-md border bg-background">
                    <SimpleIcon icon={account.icon} aria-hidden="true" className="size-4" />
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{entry.description}</ItemTitle>
                  <ItemDescription>
                    {account.name} · {entry.date}
                  </ItemDescription>
                </ItemContent>
                <span
                  className={cn(
                    "font-medium text-sm tabular-nums",
                    positive ? "text-green-600 dark:text-green-400" : "text-foreground",
                  )}
                >
                  {positive ? "+" : ""}
                  {formatCurrency(entry.amount)}
                </span>
              </Item>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
