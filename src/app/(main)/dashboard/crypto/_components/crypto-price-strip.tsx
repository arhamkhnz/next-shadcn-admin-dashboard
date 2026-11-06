import { siBitcoin, siEthereum, siLitecoin, siSolana, siTon, siXrp } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

const markets = [
  { symbol: "BTC", name: "Bitcoin", price: "75,700.30", icon: siBitcoin },
  { symbol: "ETH", name: "Ethereum", price: "2,234.19", icon: siEthereum },
  { symbol: "TON", name: "Toncoin", price: "1.707", icon: siTon },
  { symbol: "LTC", name: "Litecoin", price: "52.68", icon: siLitecoin },
  { symbol: "XRP", name: "XRP", price: "1.2038", icon: siXrp },
  { symbol: "SOL", name: "Solana", price: "89.34", icon: siSolana },
];

export function CryptoPriceStrip() {
  return (
    <section
      aria-label="Crypto price watchlist"
      title="Indicative price snapshot · November 6, 2026 · Not live"
      className="min-w-0"
    >
      <div className="overflow-x-auto pb-1">
        <ItemGroup className="flex-row gap-2" aria-label="Market prices">
          {markets.map((market) => (
            <Item
              key={market.symbol}
              role="listitem"
              variant="outline"
              size="sm"
              className="min-w-44 flex-1 flex-nowrap"
            >
              <ItemMedia variant="icon" className="bg-muted size-9 rounded-full">
                <SimpleIcon icon={market.icon} aria-hidden="true" className="size-5" />
              </ItemMedia>
              <ItemContent className="whitespace-nowrap">
                <ItemTitle>{market.symbol}/USDT</ItemTitle>
                <ItemDescription className="tabular-nums">
                  <span className="sr-only">{market.name} price snapshot: </span>${market.price}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </section>
  );
}
