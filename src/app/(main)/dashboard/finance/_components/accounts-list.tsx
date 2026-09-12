"use client";

import { ChevronRight } from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn, formatCurrency } from "@/lib/utils";

import { AccountSparkline } from "./account-sparkline";
import { accounts, accountTypeLabels, accountTypeOrder, getAccountsByType, totalBalance } from "./accounts";

type AccountsListProps = {
  onSelectAccount?: (accountId: string) => void;
};

function monthlyDeltaTone(delta: number) {
  if (delta === 0) return "text-muted-foreground";
  if (delta > 0) return "text-green-600 dark:text-green-400";
  return "text-destructive";
}

function formatMonthlyDelta(delta: number) {
  if (delta === 0) return "Flat this month";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatCurrency(delta, { noDecimals: true })} this month`;
}

export function AccountsList({ onSelectAccount }: AccountsListProps) {
  const groups = accountTypeOrder
    .map((type) => ({
      type,
      label: accountTypeLabels[type],
      accounts: getAccountsByType(type),
    }))
    .filter((group) => group.accounts.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-lg">All accounts</CardTitle>
        <CardDescription>Tap a row to see its transactions.</CardDescription>
        <CardAction className="hidden items-baseline gap-2 sm:flex">
          <span className="text-sm tabular-nums">{formatCurrency(totalBalance, { noDecimals: true })}</span>
          <span className="text-muted-foreground text-xs">across {accounts.length} accounts</span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {groups.map((group) => {
          const groupTotal = group.accounts.reduce((sum, account) => sum + account.balance, 0);
          return (
            <section key={group.type} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between px-0.5">
                <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  {group.label}
                </span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {formatCurrency(groupTotal, { noDecimals: true })}
                </span>
              </div>
              <ItemGroup>
                {group.accounts.map((account) => {
                  const positive = account.monthlyDelta >= 0;
                  const trimmedDetail =
                    account.type === "crypto" && account.cryptoBalance
                      ? `${account.cryptoBalance} · ${account.detail}`
                      : account.detail;
                  const deltaText = formatMonthlyDelta(account.monthlyDelta);
                  const deltaTone = monthlyDeltaTone(account.monthlyDelta);

                  return (
                    <Item key={account.id} variant="outline" size="default" asChild>
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => onSelectAccount?.(account.id)}
                        aria-label={`View transactions for ${account.name}`}
                      >
                        <ItemMedia className="self-center! translate-y-0!">
                          <div
                            aria-hidden="true"
                            className="grid size-9 shrink-0 place-items-center rounded-md bg-muted/60"
                          >
                            <SimpleIcon icon={account.icon} aria-hidden="true" className="size-4" />
                          </div>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="flex items-center gap-2">
                            <span>{account.name}</span>
                            <Badge variant="outline" className="rounded-full px-2 text-[10px] uppercase tracking-wider">
                              {accountTypeLabels[account.type]}
                            </Badge>
                          </ItemTitle>
                          <ItemDescription className="flex items-center gap-2 text-xs">
                            <span>{trimmedDetail}</span>
                            <span aria-hidden className="text-muted-foreground/60">
                              ·
                            </span>
                            <span className={cn(deltaTone)}>{deltaText}</span>
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions className="gap-3">
                          <div className="hidden flex-col items-end gap-1 sm:flex">
                            <span className="font-medium text-sm tabular-nums">
                              {formatCurrency(account.balance, { noDecimals: true })}
                            </span>
                            <AccountSparkline
                              data={account.trend}
                              positive={positive}
                              className="h-8 w-24"
                              label={`${account.name} balance trend, last 7 days`}
                            />
                          </div>
                          <ChevronRight aria-hidden="true" className="size-5 text-muted-foreground" />
                        </ItemActions>
                      </button>
                    </Item>
                  );
                })}
              </ItemGroup>
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}
