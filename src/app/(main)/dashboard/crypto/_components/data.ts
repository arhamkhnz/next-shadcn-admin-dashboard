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
    iconBackgroundClassName: "bg-orange-500/10",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 10,
    priceUsd: 2234.19,
    averageBuyPrice: 2150,
    icon: siEthereum,
    iconClassName: "fill-indigo-400",
    iconBackgroundClassName: "bg-indigo-400/10",
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 100,
    priceUsd: 89.34,
    averageBuyPrice: 85,
    icon: siSolana,
    iconClassName: "fill-teal-500",
    iconBackgroundClassName: "bg-teal-500/10",
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    amount: 25,
    priceUsd: 52.68,
    averageBuyPrice: 50,
    icon: siLitecoin,
    iconClassName: "fill-blue-500",
    iconBackgroundClassName: "bg-blue-500/10",
  },
  {
    symbol: "XRP",
    name: "XRP",
    amount: 2000,
    priceUsd: 1.2038,
    averageBuyPrice: 1.16,
    icon: siXrp,
    iconClassName: "fill-foreground",
    iconBackgroundClassName: "bg-foreground/5",
  },
  {
    symbol: "TON",
    name: "Toncoin",
    amount: 500,
    priceUsd: 1.707,
    averageBuyPrice: 1.65,
    icon: siTon,
    iconClassName: "fill-sky-500",
    iconBackgroundClassName: "bg-sky-500/10",
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
    id: "ORD-116",
    time: "2026-11-18T10:05:00Z",
    symbol: "SOL",
    type: "Market",
    side: "Buy",
    price: 88.75,
    amount: 12,
    filled: 12,
    status: "Filled",
  },
  {
    id: "ORD-115",
    time: "2026-11-17T13:20:00Z",
    symbol: "LTC",
    type: "Limit",
    side: "Sell",
    price: 53.2,
    amount: 5,
    filled: 5,
    status: "Filled",
  },
  {
    id: "ORD-114",
    time: "2026-11-16T08:45:00Z",
    symbol: "XRP",
    type: "Market",
    side: "Buy",
    price: 1.18,
    amount: 400,
    filled: 400,
    status: "Filled",
  },
  {
    id: "ORD-113",
    time: "2026-11-15T17:30:00Z",
    symbol: "TON",
    type: "Limit",
    side: "Sell",
    price: 1.74,
    amount: 75,
    filled: 75,
    status: "Filled",
  },
  {
    id: "ORD-112",
    time: "2026-11-14T11:15:00Z",
    symbol: "ETH",
    type: "Market",
    side: "Sell",
    price: 2210.5,
    amount: 0.75,
    filled: 0.75,
    status: "Filled",
  },
  {
    id: "ORD-111",
    time: "2026-11-13T09:40:00Z",
    symbol: "BTC",
    type: "Limit",
    side: "Buy",
    price: 72850,
    amount: 0.025,
    filled: 0.025,
    status: "Filled",
  },
  {
    id: "ORD-110",
    time: "2026-11-12T15:55:00Z",
    symbol: "SOL",
    type: "Market",
    side: "Sell",
    price: 90.1,
    amount: 8,
    filled: 8,
    status: "Filled",
  },
  {
    id: "ORD-109",
    time: "2026-11-11T12:25:00Z",
    symbol: "LTC",
    type: "Limit",
    side: "Buy",
    price: 50.8,
    amount: 10,
    filled: 10,
    status: "Filled",
  },
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

export const cryptoTransactions: {
  id: string;
  symbol: CryptoAsset["symbol"];
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
  valueUsd: number;
  time: string;
  status: "Completed" | "Pending";
}[] = [
  {
    id: "TX-114",
    symbol: "SOL",
    type: "Deposit",
    amount: 15,
    valueUsd: 1340.1,
    time: "2026-11-18T09:50:00Z",
    status: "Pending",
  },
  {
    id: "TX-113",
    symbol: "XRP",
    type: "Transfer",
    amount: 250,
    valueUsd: 300.95,
    time: "2026-11-17T18:05:00Z",
    status: "Completed",
  },
  {
    id: "TX-112",
    symbol: "LTC",
    type: "Withdrawal",
    amount: 2.5,
    valueUsd: 131.7,
    time: "2026-11-16T18:20:00Z",
    status: "Completed",
  },
  {
    id: "TX-111",
    symbol: "ETH",
    type: "Deposit",
    amount: 1.25,
    valueUsd: 2792.74,
    time: "2026-11-15T14:10:00Z",
    status: "Completed",
  },
  {
    id: "TX-110",
    symbol: "BTC",
    type: "Transfer",
    amount: 0.015,
    valueUsd: 1135.5,
    time: "2026-11-14T16:35:00Z",
    status: "Completed",
  },
  {
    id: "TX-109",
    symbol: "TON",
    type: "Withdrawal",
    amount: 50,
    valueUsd: 85.35,
    time: "2026-11-13T13:45:00Z",
    status: "Completed",
  },
  {
    id: "TX-108",
    symbol: "SOL",
    type: "Transfer",
    amount: 5,
    valueUsd: 446.7,
    time: "2026-11-12T10:30:00Z",
    status: "Completed",
  },
  {
    id: "TX-107",
    symbol: "XRP",
    type: "Deposit",
    amount: 600,
    valueUsd: 722.28,
    time: "2026-11-11T08:15:00Z",
    status: "Completed",
  },
  {
    id: "TX-106",
    symbol: "LTC",
    type: "Deposit",
    amount: 7.5,
    valueUsd: 395.1,
    time: "2026-11-10T15:40:00Z",
    status: "Completed",
  },
  {
    id: "TX-105",
    symbol: "TON",
    type: "Transfer",
    amount: 125,
    valueUsd: 213.38,
    time: "2026-11-09T11:20:00Z",
    status: "Completed",
  },
  {
    id: "TX-104",
    symbol: "BTC",
    type: "Deposit",
    amount: 0.1,
    valueUsd: 7570.03,
    time: "2026-11-18T12:10:00Z",
    status: "Completed",
  },
  {
    id: "TX-103",
    symbol: "ETH",
    type: "Withdrawal",
    amount: 0.5,
    valueUsd: 1117.1,
    time: "2026-11-18T11:30:00Z",
    status: "Pending",
  },
  {
    id: "TX-102",
    symbol: "SOL",
    type: "Transfer",
    amount: 10,
    valueUsd: 893.4,
    time: "2026-11-17T16:45:00Z",
    status: "Completed",
  },
  {
    id: "TX-101",
    symbol: "TON",
    type: "Deposit",
    amount: 100,
    valueUsd: 170.7,
    time: "2026-11-16T10:15:00Z",
    status: "Completed",
  },
];

export const recentActivity = [
  ...cryptoOrders
    .filter((order) => order.status === "Filled")
    .map((order) => ({
      id: order.id,
      symbol: order.symbol,
      type: order.side,
      amount: order.filled,
      valueUsd: order.filled * order.price,
      status: "Completed" as const,
      time: order.time,
    })),
  ...cryptoTransactions,
].sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

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

// Illustrative public market executions, listed newest first. Color follows the previous execution price.
export function getRecentTrades() {
  return cryptoAssets
    .flatMap((asset, assetIndex) => {
      const precision = asset.priceUsd < 10 ? 10000 : 100;
      const trades = [0, -1, 2, 1, -2, -4, -3, -1, 0].map((offset, index) => ({
        symbol: asset.symbol,
        time: Date.UTC(2026, 10, 18, 12, 20, 35 - index * 4) - assetIndex * 500,
        price: Math.round(asset.priceUsd * (1 + offset * (assetIndex % 2 ? -1 : 1) * 0.0001) * precision) / precision,
        amount: Number(((9000 / asset.priceUsd) * (0.25 + ((index * 3) % 7) / 10)).toFixed(4)),
      }));

      return trades.slice(0, 8).map((trade, index) => ({
        ...trade,
        color: trade.price >= trades[index + 1].price ? chartColors.up : chartColors.down,
      }));
    })
    .sort((a, b) => b.time - a.time)
    .slice(0, 6);
}

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
