import { Wallet } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AccountActivityTable } from "./_components/account-activity";
import { displayCurrencies } from "./_components/data";
import { MarketTrades } from "./_components/market-trades";
import { OrderBook } from "./_components/order-book";
import { PortfolioHoldings } from "./_components/portfolio-holdings";
import { PriceChart } from "./_components/price-chart";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight">Crypto overview</h1>
          <p className="text-muted-foreground text-sm">Your portfolio, market prices, and recent activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="USD">
            <SelectTrigger size="sm" aria-label="Display currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                {displayCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency} disabled={currency !== "USD"}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="sm" type="button">
            <Wallet data-icon="inline-start" />
            Connect wallet
          </Button>
        </div>
      </div>
      <PortfolioHoldings />
      <PriceChart />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <OrderBook />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <MarketTrades />
        </div>
      </div>
      <AccountActivityTable />
    </div>
  );
}
