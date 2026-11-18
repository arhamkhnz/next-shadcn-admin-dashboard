import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { siBitcoin, siEthereum, siLitecoin, siSolana, siTon, siXrp } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const holdings = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.8,
    priceCents: 7570030,
    icon: siBitcoin,
    iconClassName: "fill-orange-500",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 10,
    priceCents: 223419,
    icon: siEthereum,
    iconClassName: "fill-indigo-400",
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 100,
    priceCents: 8934,
    icon: siSolana,
    iconClassName: "fill-teal-500",
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    amount: 25,
    priceCents: 5268,
    icon: siLitecoin,
    iconClassName: "fill-blue-500",
  },
  {
    symbol: "XRP",
    name: "XRP",
    amount: 2000,
    priceCents: 120,
    icon: siXrp,
    iconClassName: "fill-foreground",
  },
  {
    symbol: "TON",
    name: "Toncoin",
    amount: 500,
    priceCents: 171,
    icon: siTon,
    iconClassName: "fill-sky-500",
  },
].map((holding) => ({ ...holding, valueCents: Math.round(holding.amount * holding.priceCents) }));

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const amountFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 });
const totalBalanceCents = holdings.reduce((total, holding) => total + holding.valueCents, 0);

export function HoldingsStrip() {
  return (
    <section aria-label="Portfolio holdings" className="min-w-0">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <Card size="sm" className="min-w-0 sm:col-span-2 xl:col-span-3 xl:row-span-2">
          <CardHeader>
            <CardTitle className="group-data-[size=sm]/card:text-base">My portfolio</CardTitle>
            <CardDescription>{holdings.length} assets · USD</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-6">
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              <p className="text-muted-foreground text-sm leading-none">Total balance</p>
              <p className="text-3xl leading-none tracking-tight tabular-nums">
                {currencyFormatter.format(totalBalanceCents / 100)}
              </p>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2">
            <Button size="sm" type="button">
              <ArrowDownToLine data-icon="inline-start" />
              Deposit
            </Button>
            <Button size="sm" variant="outline" type="button">
              <ArrowUpFromLine data-icon="inline-start" />
              Withdraw
            </Button>
          </CardFooter>
        </Card>
        {holdings.map((holding) => (
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
                {currencyFormatter.format(holding.valueCents / 100)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
