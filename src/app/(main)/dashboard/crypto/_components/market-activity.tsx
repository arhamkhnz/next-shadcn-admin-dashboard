"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type CryptoAsset, cryptoAssets, getRecentTrades } from "./data";
import { OrderBook } from "./order-book";

const amountFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const priceFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

export function MarketActivity() {
  const [symbol, setSymbol] = useState<CryptoAsset["symbol"]>("BTC");
  const asset = cryptoAssets.find((item) => item.symbol === symbol) ?? cryptoAssets[0];

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-8">
        <OrderBook asset={asset} onAssetChange={setSymbol} />
      </div>
      <Card size="sm" className="min-w-0 pb-0 lg:col-span-4">
        <CardHeader>
          <CardTitle>Market trades</CardTitle>
          <CardDescription className="leading-none">All markets</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table className="text-xs tabular-nums" aria-label="Market trades across all markets">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 px-(--card-spacing)">Market</TableHead>
                <TableHead className="h-8 px-(--card-spacing)">Price (USD)</TableHead>
                <TableHead className="h-8 px-(--card-spacing) text-right">Amount</TableHead>
                <TableHead className="h-8 px-(--card-spacing) text-right">Time (UTC)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getRecentTrades().map((trade) => (
                <TableRow key={`${trade.symbol}-${trade.time}`} className="border-0">
                  <TableCell className="px-(--card-spacing) py-3 font-medium">{trade.symbol}</TableCell>
                  <TableCell className="px-(--card-spacing) py-3" style={{ color: trade.color }}>
                    {priceFormatter.format(trade.price)}
                  </TableCell>
                  <TableCell className="px-(--card-spacing) py-3 text-right">
                    {amountFormatter.format(trade.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-(--card-spacing) py-3 text-right">
                    {timeFormatter.format(trade.time)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
