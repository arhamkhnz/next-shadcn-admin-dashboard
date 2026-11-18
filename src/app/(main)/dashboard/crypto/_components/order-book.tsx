"use client";

import { useState } from "react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type CryptoAsset, chartColors, cryptoAssets, getOrderBook } from "./data";

const amountFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const totalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function OrderBook() {
  const [symbol, setSymbol] = useState<CryptoAsset["symbol"]>("BTC");
  const asset = cryptoAssets.find((item) => item.symbol === symbol) ?? cryptoAssets[0];
  const book = getOrderBook(asset);
  const asks = [...book.asks].reverse();
  const priceFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: asset.priceUsd < 10 ? 4 : 2,
    maximumFractionDigits: asset.priceUsd < 10 ? 4 : 2,
  });

  return (
    <Card size="sm" className="pb-0" aria-label={`${asset.symbol}/USD order book`}>
      <CardHeader>
        <CardTitle>Order book</CardTitle>
        <CardDescription className="leading-none">
          Last price <span className="text-foreground ml-1 tabular-nums">${priceFormatter.format(asset.priceUsd)}</span>
        </CardDescription>
        <CardAction>
          <Select value={symbol} onValueChange={(value) => setSymbol(value as CryptoAsset["symbol"])}>
            <SelectTrigger size="sm" aria-label="Order book pair">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                {cryptoAssets.map((item) => (
                  <SelectItem key={item.symbol} value={item.symbol}>
                    {item.symbol}/USD
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-4 px-0">
        <div className="relative grid grid-cols-1 gap-0 sm:grid-cols-2">
          <Separator orientation="vertical" className="absolute inset-y-0 left-1/2 hidden h-full sm:block" />
          {(["bids", "asks"] as const).map((side) => {
            const isBuy = side === "bids";
            const levels = isBuy ? book.bids : asks;
            const color = isBuy ? chartColors.up : chartColors.down;
            const direction = isBuy ? "left" : "right";

            return (
              <section
                key={side}
                className="flex min-w-0 flex-col gap-2"
                aria-label={isBuy ? "Buy orders" : "Sell orders"}
              >
                <Table
                  className="text-xs tabular-nums"
                  aria-label={isBuy ? "Buy orders, highest price first" : "Sell orders, lowest price first"}
                >
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-8 px-(--card-spacing) text-left text-xs" style={{ color }}>
                        {isBuy ? "Buy price" : "Sell price"} (USD)
                      </TableHead>
                      <TableHead className="text-muted-foreground h-8 px-(--card-spacing) text-right text-xs">
                        Size ({asset.symbol})
                      </TableHead>
                      <TableHead
                        className="text-muted-foreground h-8 px-(--card-spacing) text-right text-xs"
                        title="Cumulative value of orders up to this price"
                      >
                        Total (USD)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levels.map((level) => {
                      const width = (level.totalUsd / book.maxTotal) * 100;

                      return (
                        <TableRow
                          key={level.price}
                          className="border-0"
                          style={{
                            backgroundImage: `linear-gradient(to ${direction}, color-mix(in oklab, ${color} 14%, transparent) ${width}%, transparent 0)`,
                          }}
                        >
                          <TableCell className="px-(--card-spacing) py-3 text-left" style={{ color }}>
                            {priceFormatter.format(level.price)}
                          </TableCell>
                          <TableCell className="px-(--card-spacing) py-3 text-right">
                            {amountFormatter.format(level.amount)}
                          </TableCell>
                          <TableCell className="px-(--card-spacing) py-3 text-right">
                            {totalFormatter.format(level.totalUsd)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </section>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
