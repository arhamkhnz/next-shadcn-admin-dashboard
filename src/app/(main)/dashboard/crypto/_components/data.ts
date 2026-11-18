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
