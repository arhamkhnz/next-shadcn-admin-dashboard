import { ArrowDownToLine, ArrowRight, ArrowUpFromLine } from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cryptoAssets, portfolioBalanceUsd } from "./data";

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const amountFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 });
const formattedTotalBalance = currencyFormatter.format(portfolioBalanceUsd);
const [balanceWhole, balanceFraction] = formattedTotalBalance.split(".");

export function PortfolioHoldings() {
  return (
    <section aria-label="Portfolio holdings" className="min-w-0">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <Card size="sm" className="min-w-0 gap-4 sm:col-span-2 xl:col-span-3 xl:row-span-2">
          <CardHeader>
            <CardTitle className="leading-none group-data-[size=sm]/card:text-base">My portfolio</CardTitle>
            <CardDescription>{cryptoAssets.length} assets</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm leading-none">Total balance</p>
              <p className="text-3xl leading-none tracking-tight tabular-nums">
                <span className="sr-only">{formattedTotalBalance}</span>
                <span aria-hidden="true">
                  {balanceWhole}
                  <span className="text-muted-foreground text-2xl">.{balanceFraction}</span>
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" type="button">
                <ArrowDownToLine data-icon="inline-start" />
                Deposit
              </Button>
              <Button size="sm" variant="outline" type="button">
                <ArrowUpFromLine data-icon="inline-start" />
                Withdraw
              </Button>
              <Button size="sm" variant="outline" asChild className="col-span-2">
                <a href="#crypto-activity">
                  View activity
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        {cryptoAssets.map((holding) => (
          <Card size="sm" key={holding.symbol} className="min-w-0 xl:col-span-3">
            <CardHeader>
              <CardTitle>{holding.name}</CardTitle>
              <CardAction>
                <SimpleIcon icon={holding.icon} className={holding.iconClassName} aria-hidden="true" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              <p className="text-muted-foreground text-sm leading-none tabular-nums">
                {amountFormatter.format(holding.amount)} {holding.symbol}
              </p>
              <p className="text-2xl leading-none tracking-tight tabular-nums">
                {currencyFormatter.format(holding.valueUsd)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
