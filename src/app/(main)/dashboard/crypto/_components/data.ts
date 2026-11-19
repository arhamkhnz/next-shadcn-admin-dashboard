import { siBitcoin, siEthereum, siLitecoin, siSolana, siTon, siXrp } from "simple-icons";

export const cryptoAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.8,
    priceUsd: 75700.3,
    valueUsd: 60560.24,
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
    valueUsd: 22341.9,
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
    valueUsd: 8934,
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
    valueUsd: 1317,
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
    valueUsd: 2407.6,
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
    valueUsd: 853.5,
    averageBuyPrice: 1.65,
    icon: siTon,
    iconClassName: "fill-sky-500",
    iconBackgroundClassName: "bg-sky-500/10",
  },
] as const;

export type CryptoAsset = (typeof cryptoAssets)[number];

export const exchangeFeePercent = 0.1;

export const portfolioBalanceUsd =
  cryptoAssets.reduce((totalCents, asset) => totalCents + Math.round(asset.valueUsd * 100), 0) / 100;

export const exchangeAllocations = [
  {
    key: "binance",
    name: "Binance",
    valueUsd: 43386.41,
    fill: "var(--color-blue-500)",
    textColor: "var(--color-white)",
  },
  {
    key: "coinbase",
    name: "Coinbase",
    valueUsd: 28924.27,
    fill: "var(--color-violet-400)",
    textColor: "var(--color-neutral-950)",
  },
  {
    key: "kraken",
    name: "Kraken",
    valueUsd: 14462.14,
    fill: "var(--color-amber-400)",
    textColor: "var(--color-neutral-950)",
  },
  {
    key: "okx",
    name: "OKX",
    valueUsd: 9641.42,
    fill: "var(--color-slate-300)",
    textColor: "var(--color-neutral-950)",
  },
];

export const displayCurrencies = ["USD", "EUR", "GBP", "INR"] as const;

export type AccountActivity = {
  id: string;
  symbol: CryptoAsset["symbol"];
  type: "Buy" | "Sell" | "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
  status: "Completed" | "Pending";
  time: string;
};

export const accountActivities: AccountActivity[] = [
  {
    id: "TX-104",
    symbol: "BTC",
    type: "Deposit",
    amount: 0.1,
    time: "2026-11-18T12:10:00Z",
    status: "Completed",
  },
  {
    id: "TX-103",
    symbol: "ETH",
    type: "Withdrawal",
    amount: 0.5,
    time: "2026-11-18T11:30:00Z",
    status: "Pending",
  },
  {
    id: "ORD-116",
    symbol: "SOL",
    type: "Buy",
    amount: 12,
    status: "Completed",
    time: "2026-11-18T10:05:00Z",
  },
  {
    id: "TX-114",
    symbol: "SOL",
    type: "Deposit",
    amount: 15,
    time: "2026-11-18T09:50:00Z",
    status: "Pending",
  },
  {
    id: "TX-113",
    symbol: "XRP",
    type: "Transfer",
    amount: 250,
    time: "2026-11-17T18:05:00Z",
    status: "Completed",
  },
  {
    id: "TX-102",
    symbol: "SOL",
    type: "Transfer",
    amount: 10,
    time: "2026-11-17T16:45:00Z",
    status: "Completed",
  },
  {
    id: "ORD-105",
    symbol: "BTC",
    type: "Buy",
    amount: 0.1,
    status: "Completed",
    time: "2026-11-17T15:10:00Z",
  },
  {
    id: "ORD-115",
    symbol: "LTC",
    type: "Sell",
    amount: 5,
    status: "Completed",
    time: "2026-11-17T13:20:00Z",
  },
  {
    id: "TX-112",
    symbol: "LTC",
    type: "Withdrawal",
    amount: 2.5,
    time: "2026-11-16T18:20:00Z",
    status: "Completed",
  },
  {
    id: "ORD-103",
    symbol: "ETH",
    type: "Buy",
    amount: 3,
    status: "Completed",
    time: "2026-11-16T14:40:00Z",
  },
  {
    id: "TX-101",
    symbol: "TON",
    type: "Deposit",
    amount: 100,
    time: "2026-11-16T10:15:00Z",
    status: "Completed",
  },
  {
    id: "ORD-114",
    symbol: "XRP",
    type: "Buy",
    amount: 400,
    status: "Completed",
    time: "2026-11-16T08:45:00Z",
  },
  {
    id: "ORD-113",
    symbol: "TON",
    type: "Sell",
    amount: 75,
    status: "Completed",
    time: "2026-11-15T17:30:00Z",
  },
  {
    id: "TX-111",
    symbol: "ETH",
    type: "Deposit",
    amount: 1.25,
    time: "2026-11-15T14:10:00Z",
    status: "Completed",
  },
  {
    id: "TX-110",
    symbol: "BTC",
    type: "Transfer",
    amount: 0.015,
    time: "2026-11-14T16:35:00Z",
    status: "Completed",
  },
  {
    id: "ORD-112",
    symbol: "ETH",
    type: "Sell",
    amount: 0.75,
    status: "Completed",
    time: "2026-11-14T11:15:00Z",
  },
  {
    id: "TX-109",
    symbol: "TON",
    type: "Withdrawal",
    amount: 50,
    time: "2026-11-13T13:45:00Z",
    status: "Completed",
  },
  {
    id: "ORD-111",
    symbol: "BTC",
    type: "Buy",
    amount: 0.025,
    status: "Completed",
    time: "2026-11-13T09:40:00Z",
  },
  {
    id: "ORD-110",
    symbol: "SOL",
    type: "Sell",
    amount: 8,
    status: "Completed",
    time: "2026-11-12T15:55:00Z",
  },
  {
    id: "TX-108",
    symbol: "SOL",
    type: "Transfer",
    amount: 5,
    time: "2026-11-12T10:30:00Z",
    status: "Completed",
  },
  {
    id: "ORD-109",
    symbol: "LTC",
    type: "Buy",
    amount: 10,
    status: "Completed",
    time: "2026-11-11T12:25:00Z",
  },
  {
    id: "TX-107",
    symbol: "XRP",
    type: "Deposit",
    amount: 600,
    time: "2026-11-11T08:15:00Z",
    status: "Completed",
  },
  {
    id: "TX-106",
    symbol: "LTC",
    type: "Deposit",
    amount: 7.5,
    time: "2026-11-10T15:40:00Z",
    status: "Completed",
  },
  {
    id: "TX-105",
    symbol: "TON",
    type: "Transfer",
    amount: 125,
    time: "2026-11-09T11:20:00Z",
    status: "Completed",
  },
  {
    id: "ORD-108",
    symbol: "ETH",
    type: "Buy",
    amount: 1.25,
    status: "Completed",
    time: "2026-11-08T14:10:00Z",
  },
  {
    id: "TX-099",
    symbol: "BTC",
    type: "Withdrawal",
    amount: 0.035,
    status: "Completed",
    time: "2026-11-06T10:45:00Z",
  },
  {
    id: "ORD-107",
    symbol: "TON",
    type: "Sell",
    amount: 80,
    status: "Completed",
    time: "2026-11-03T16:30:00Z",
  },
  {
    id: "TX-098",
    symbol: "SOL",
    type: "Deposit",
    amount: 25,
    status: "Completed",
    time: "2026-10-28T09:20:00Z",
  },
  {
    id: "ORD-106",
    symbol: "XRP",
    type: "Buy",
    amount: 450,
    status: "Completed",
    time: "2026-10-19T13:15:00Z",
  },
  {
    id: "TX-097",
    symbol: "ETH",
    type: "Transfer",
    amount: 0.75,
    status: "Completed",
    time: "2026-10-07T11:05:00Z",
  },
  {
    id: "ORD-105",
    symbol: "BTC",
    type: "Sell",
    amount: 0.06,
    status: "Completed",
    time: "2026-09-24T15:40:00Z",
  },
  {
    id: "TX-096",
    symbol: "LTC",
    type: "Deposit",
    amount: 12.5,
    status: "Completed",
    time: "2026-09-09T08:30:00Z",
  },
  {
    id: "ORD-104",
    symbol: "SOL",
    type: "Buy",
    amount: 18,
    status: "Completed",
    time: "2026-08-27T12:55:00Z",
  },
  {
    id: "TX-095",
    symbol: "TON",
    type: "Withdrawal",
    amount: 60,
    status: "Completed",
    time: "2026-08-14T17:10:00Z",
  },
  {
    id: "TX-094",
    symbol: "XRP",
    type: "Transfer",
    amount: 300,
    status: "Completed",
    time: "2026-07-30T10:25:00Z",
  },
  {
    id: "ORD-103",
    symbol: "ETH",
    type: "Sell",
    amount: 0.8,
    status: "Completed",
    time: "2026-07-12T14:35:00Z",
  },
  {
    id: "TX-093",
    symbol: "BTC",
    type: "Deposit",
    amount: 0.12,
    status: "Completed",
    time: "2026-06-23T09:50:00Z",
  },
  {
    id: "ORD-102",
    symbol: "LTC",
    type: "Buy",
    amount: 6,
    status: "Completed",
    time: "2026-06-05T16:20:00Z",
  },
  {
    id: "TX-092",
    symbol: "SOL",
    type: "Withdrawal",
    amount: 7.5,
    status: "Completed",
    time: "2026-05-25T11:40:00Z",
  },
  {
    id: "ORD-101",
    symbol: "TON",
    type: "Buy",
    amount: 150,
    status: "Completed",
    time: "2026-05-08T13:05:00Z",
  },
  {
    id: "TX-091",
    symbol: "ETH",
    type: "Deposit",
    amount: 2,
    status: "Completed",
    time: "2026-04-21T08:45:00Z",
  },
  {
    id: "ORD-100",
    symbol: "XRP",
    type: "Sell",
    amount: 200,
    status: "Completed",
    time: "2026-04-03T15:15:00Z",
  },
  {
    id: "TX-090",
    symbol: "BTC",
    type: "Transfer",
    amount: 0.045,
    status: "Completed",
    time: "2026-03-18T12:30:00Z",
  },
  {
    id: "ORD-099",
    symbol: "SOL",
    type: "Buy",
    amount: 30,
    status: "Completed",
    time: "2026-03-02T10:10:00Z",
  },
  {
    id: "TX-089",
    symbol: "LTC",
    type: "Withdrawal",
    amount: 4,
    status: "Completed",
    time: "2026-02-16T14:50:00Z",
  },
  {
    id: "ORD-098",
    symbol: "ETH",
    type: "Buy",
    amount: 1.5,
    status: "Completed",
    time: "2026-01-27T09:35:00Z",
  },
  {
    id: "TX-088",
    symbol: "TON",
    type: "Deposit",
    amount: 200,
    status: "Completed",
    time: "2025-12-18T11:55:00Z",
  },
  {
    id: "ORD-097",
    symbol: "BTC",
    type: "Buy",
    amount: 0.08,
    status: "Completed",
    time: "2025-12-04T16:05:00Z",
  },
];

export const chartColors = {
  up: "var(--color-teal-600)",
  down: "var(--color-red-500)",
  averageBuy: "var(--color-amber-600)",
} as const;

const pnlCurrentDate = new Date();
const pnlMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const monthlyPnl = [980, -420, 1560, 820, 1240, 2180, -620, 1890, 3180, -960, 2410, 1760].map(
  (value, index) => ({
    month: pnlMonthFormatter.format(
      new Date(Date.UTC(pnlCurrentDate.getUTCFullYear(), pnlCurrentDate.getUTCMonth() - 11 + index, 1)),
    ),
    value,
  }),
);

export const chartRanges = ["1D", "7D", "1M", "3M", "1Y"] as const;
export type ChartRange = (typeof chartRanges)[number];

export type MarketCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  fill: string;
};

const candleRanges: Record<ChartRange, { days: number; count: number }> = {
  "1D": { days: 1, count: 96 },
  "7D": { days: 7, count: 168 },
  "1M": { days: 30, count: 180 },
  "3M": { days: 90, count: 180 },
  "1Y": { days: 365, count: 365 },
};

export function generateMarketCandles(asset: CryptoAsset, range: ChartRange): MarketCandle[] {
  const { days, count } = candleRanges[range];
  const endTime = Date.UTC(2026, 10, 18);
  const interval = (days * 24 * 60 * 60 * 1000) / count;
  let seed = asset.symbol.charCodeAt(0) * 7919 + days;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  let previousClose = 1;
  const candles = Array.from({ length: count }, (_, index) => {
    const open = previousClose;
    const close = open * (1 + (random() - 0.48) * 0.035);
    previousClose = close;
    return {
      time: endTime - (count - 1 - index) * interval,
      open,
      close,
      high: Math.max(open, close) * (1 + random() * 0.012),
      low: Math.min(open, close) * (1 - random() * 0.012),
    };
  });
  const priceScale = asset.priceUsd / previousClose;

  return candles.map((candle) => ({
    ...candle,
    open: candle.open * priceScale,
    high: candle.high * priceScale,
    low: candle.low * priceScale,
    close: candle.close * priceScale,
    fill: candle.close >= candle.open ? chartColors.up : chartColors.down,
  }));
}
