import { siBitcoin, siEthereum, siLitecoin, siSolana, siTon, siXrp } from "simple-icons";

// Static demo holdings and quotes. Preserve sub-cent prices until valuing each holding.
const assets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.8,
    priceUsd: 75700.3,
    averageBuyPrice: 73000,
    icon: siBitcoin,
    iconClassName: "fill-orange-500",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 10,
    priceUsd: 2234.19,
    averageBuyPrice: 2150,
    icon: siEthereum,
    iconClassName: "fill-indigo-400",
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 100,
    priceUsd: 89.34,
    averageBuyPrice: 85,
    icon: siSolana,
    iconClassName: "fill-teal-500",
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    amount: 25,
    priceUsd: 52.68,
    averageBuyPrice: 50,
    icon: siLitecoin,
    iconClassName: "fill-blue-500",
  },
  {
    symbol: "XRP",
    name: "XRP",
    amount: 2000,
    priceUsd: 1.2038,
    averageBuyPrice: 1.16,
    icon: siXrp,
    iconClassName: "fill-foreground",
  },
  {
    symbol: "TON",
    name: "Toncoin",
    amount: 500,
    priceUsd: 1.707,
    averageBuyPrice: 1.65,
    icon: siTon,
    iconClassName: "fill-sky-500",
  },
] as const;

export const cryptoAssets = assets.map((asset) => ({
  ...asset,
  valueCents: Math.round(asset.amount * asset.priceUsd * 100),
}));

export type CryptoAsset = (typeof cryptoAssets)[number];
export const totalBalanceCents = cryptoAssets.reduce((total, asset) => total + asset.valueCents, 0);

export type CryptoOrder = {
  id: string;
  time: string;
  symbol: CryptoAsset["symbol"];
  type: "Limit" | "Market";
  side: "Buy" | "Sell";
  price: number;
  amount: number;
  filled: number;
  status: "Open" | "Partially filled" | "Filled" | "Cancelled";
};

export const cryptoOrders: CryptoOrder[] = [
  {
    id: "ORD-108",
    time: "2026-11-18T12:20:00Z",
    symbol: "BTC",
    type: "Limit",
    side: "Buy",
    price: 74500,
    amount: 0.05,
    filled: 0,
    status: "Open",
  },
  {
    id: "ORD-107",
    time: "2026-11-18T11:45:00Z",
    symbol: "ETH",
    type: "Limit",
    side: "Sell",
    price: 2300,
    amount: 2,
    filled: 0.5,
    status: "Partially filled",
  },
  {
    id: "ORD-106",
    time: "2026-11-18T10:30:00Z",
    symbol: "SOL",
    type: "Limit",
    side: "Buy",
    price: 86,
    amount: 20,
    filled: 0,
    status: "Open",
  },
  {
    id: "ORD-105",
    time: "2026-11-17T15:10:00Z",
    symbol: "BTC",
    type: "Market",
    side: "Buy",
    price: 73980,
    amount: 0.1,
    filled: 0.1,
    status: "Filled",
  },
  {
    id: "ORD-104",
    time: "2026-11-17T09:25:00Z",
    symbol: "XRP",
    type: "Limit",
    side: "Sell",
    price: 1.25,
    amount: 500,
    filled: 0,
    status: "Cancelled",
  },
  {
    id: "ORD-103",
    time: "2026-11-16T14:40:00Z",
    symbol: "ETH",
    type: "Market",
    side: "Buy",
    price: 2150,
    amount: 3,
    filled: 3,
    status: "Filled",
  },
];

export function isOpenOrder(order: CryptoOrder) {
  return order.status === "Open" || order.status === "Partially filled";
}

export const displayCurrencies = ["USD", "EUR", "GBP", "INR"] as const;

export const chartRanges = [
  { value: "1D", days: 1, count: 96 },
  { value: "7D", days: 7, count: 168 },
  { value: "1M", days: 30, count: 180 },
  { value: "3M", days: 90, count: 180 },
  { value: "1Y", days: 365, count: 365 },
] as const;

export type ChartRange = (typeof chartRanges)[number];

export type MarketCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  fill: string;
};

export const chartColors = {
  up: "var(--color-teal-600)",
  down: "var(--color-red-500)",
  averageBuy: "var(--color-amber-600)",
};

// Illustrative order-book levels, derived from the dashboard quote rather than a live exchange feed.
export function getOrderBook(asset: CryptoAsset) {
  const precision = asset.priceUsd < 10 ? 10000 : 100;
  const step = Math.max(1 / precision, Math.round(asset.priceUsd * 0.0001 * precision) / precision);
  const createSide = (direction: number) => {
    let totalUsd = 0;
    return Array.from({ length: 6 }, (_, index) => {
      const price = Math.round((asset.priceUsd + direction * step * (index + 1)) * precision) / precision;
      const amount = Number(
        ((12000 / asset.priceUsd) * (0.65 + ((index * 7 + (direction > 0 ? 3 : 1)) % 11) / 10)).toFixed(4),
      );
      totalUsd += price * amount;
      return { price, amount, totalUsd };
    });
  };
  const asks = createSide(1);
  const bids = createSide(-1);

  return {
    asks: asks.toReversed(),
    bids,
    spread: asks[0].price - bids[0].price,
    maxTotal: Math.max(...asks.map((level) => level.totalUsd), ...bids.map((level) => level.totalUsd)),
  };
}

// Deterministic illustration, not historical market data. Every range ends at the asset's quote.
export function getMarketCandles(asset: CryptoAsset, range: ChartRange): MarketCandle[] {
  const endTime = Date.UTC(2026, 10, 18);
  const interval = (range.days * 24 * 60 * 60 * 1000) / range.count;
  let seed = asset.symbol.charCodeAt(0) * 7919 + range.days;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  let previousClose = 1;
  const candles = Array.from({ length: range.count }, (_, index) => {
    const open = previousClose;
    const close = open * (1 + (random() - 0.48) * 0.035);
    previousClose = close;
    return {
      time: endTime - (range.count - 1 - index) * interval,
      open,
      close,
      high: Math.max(open, close) * (1 + random() * 0.012),
      low: Math.min(open, close) * (1 - random() * 0.012),
    };
  });
  const scale = asset.priceUsd / previousClose;

  return candles.map((candle) => ({
    ...candle,
    open: candle.open * scale,
    high: candle.high * scale,
    low: candle.low * scale,
    close: candle.close * scale,
    fill: candle.close >= candle.open ? chartColors.up : chartColors.down,
  }));
}
