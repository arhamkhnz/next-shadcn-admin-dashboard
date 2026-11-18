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

export const portfolioBalanceUsd =
  cryptoAssets.reduce((totalCents, asset) => totalCents + Math.round(asset.valueUsd * 100), 0) / 100;

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
];

export const chartColors = {
  up: "var(--color-teal-600)",
  down: "var(--color-red-500)",
  averageBuy: "var(--color-amber-600)",
} as const;

export const chartRanges = ["1D", "7D", "1M", "3M", "1Y"] as const;
export type ChartRange = (typeof chartRanges)[number];

export const marketTrades = [
  { symbol: "BTC", time: 1795004435000, price: 75700.3, amount: 0.0297, color: chartColors.up },
  { symbol: "ETH", time: 1795004434500, price: 2234.19, amount: 1.0071, color: chartColors.down },
  { symbol: "SOL", time: 1795004434000, price: 89.34, amount: 25.1847, color: chartColors.up },
  { symbol: "LTC", time: 1795004433500, price: 52.68, amount: 42.7107, color: chartColors.down },
  { symbol: "XRP", time: 1795004433000, price: 1.2038, amount: 1869.0812, color: chartColors.up },
  { symbol: "TON", time: 1795004432500, price: 1.707, amount: 1318.1019, color: chartColors.down },
];

export type OrderBookLevel = { price: number; amount: number; totalUsd: number; depthPercent: number };

export const orderBooks: Record<CryptoAsset["symbol"], { bids: OrderBookLevel[]; asks: OrderBookLevel[] }> = {
  BTC: {
    bids: [
      { price: 75692.73, amount: 0.1189, totalUsd: 8999.87, depthPercent: 10.13 },
      { price: 75685.16, amount: 0.2299, totalUsd: 26399.88, depthPercent: 29.72 },
      { price: 75677.59, amount: 0.1664, totalUsd: 38992.63, depthPercent: 43.9 },
      { price: 75670.02, amount: 0.103, totalUsd: 46786.65, depthPercent: 52.67 },
      { price: 75662.45, amount: 0.214, totalUsd: 62978.41, depthPercent: 70.9 },
      { price: 75654.88, amount: 0.1506, totalUsd: 74372.04, depthPercent: 83.73 },
    ],
    asks: [
      { price: 75707.87, amount: 0.1506, totalUsd: 11401.61, depthPercent: 12.84 },
      { price: 75715.44, amount: 0.2616, totalUsd: 31208.76, depthPercent: 35.13 },
      { price: 75723.01, amount: 0.1981, totalUsd: 46209.49, depthPercent: 52.02 },
      { price: 75730.58, amount: 0.1347, totalUsd: 56410.4, depthPercent: 63.51 },
      { price: 75738.15, amount: 0.2457, totalUsd: 75019.27, depthPercent: 84.45 },
      { price: 75745.72, amount: 0.1823, totalUsd: 88827.71, depthPercent: 100 },
    ],
  },
  ETH: {
    bids: [
      { price: 2233.97, amount: 4.0283, totalUsd: 8999.1, depthPercent: 10.13 },
      { price: 2233.75, amount: 7.7881, totalUsd: 26395.77, depthPercent: 29.71 },
      { price: 2233.53, amount: 5.6396, totalUsd: 38991.99, depthPercent: 43.89 },
      { price: 2233.31, amount: 3.4912, totalUsd: 46788.92, depthPercent: 52.67 },
      { price: 2233.09, amount: 7.251, totalUsd: 62981.05, depthPercent: 70.9 },
      { price: 2232.87, amount: 5.1025, totalUsd: 74374.27, depthPercent: 83.73 },
    ],
    asks: [
      { price: 2234.41, amount: 5.1025, totalUsd: 11401.08, depthPercent: 12.83 },
      { price: 2234.63, amount: 8.8623, totalUsd: 31205.04, depthPercent: 35.13 },
      { price: 2234.85, amount: 6.7138, totalUsd: 46209.37, depthPercent: 52.02 },
      { price: 2235.07, amount: 4.5654, totalUsd: 56413.36, depthPercent: 63.51 },
      { price: 2235.29, amount: 8.3252, totalUsd: 75022.6, depthPercent: 84.46 },
      { price: 2235.51, amount: 6.1767, totalUsd: 88830.67, depthPercent: 100 },
    ],
  },
  SOL: {
    bids: [
      { price: 89.33, amount: 100.7388, totalUsd: 8999, depthPercent: 10.13 },
      { price: 89.32, amount: 194.7616, totalUsd: 26395.1, depthPercent: 29.71 },
      { price: 89.31, amount: 141.0343, totalUsd: 38990.88, depthPercent: 43.89 },
      { price: 89.3, amount: 87.3069, totalUsd: 46787.38, depthPercent: 52.67 },
      { price: 89.29, amount: 181.3298, totalUsd: 62978.32, depthPercent: 70.89 },
      { price: 89.28, amount: 127.6024, totalUsd: 74370.66, depthPercent: 83.72 },
    ],
    asks: [
      { price: 89.35, amount: 127.6024, totalUsd: 11401.27, depthPercent: 12.83 },
      { price: 89.36, amount: 221.6253, totalUsd: 31205.71, depthPercent: 35.13 },
      { price: 89.37, amount: 167.8979, totalUsd: 46210.75, depthPercent: 52.02 },
      { price: 89.38, amount: 114.1706, totalUsd: 56415.31, depthPercent: 63.51 },
      { price: 89.39, amount: 208.1934, totalUsd: 75025.72, depthPercent: 84.46 },
      { price: 89.4, amount: 154.4661, totalUsd: 88834.99, depthPercent: 100 },
    ],
  },
  LTC: {
    bids: [
      { price: 52.67, amount: 170.8428, totalUsd: 8998.29, depthPercent: 10.13 },
      { price: 52.66, amount: 330.2961, totalUsd: 26391.68, depthPercent: 29.7 },
      { price: 52.65, amount: 239.18, totalUsd: 38984.51, depthPercent: 43.87 },
      { price: 52.64, amount: 148.0638, totalUsd: 46778.59, depthPercent: 52.64 },
      { price: 52.63, amount: 307.5171, totalUsd: 62963.21, depthPercent: 70.86 },
      { price: 52.62, amount: 216.4009, totalUsd: 74350.23, depthPercent: 83.67 },
    ],
    asks: [
      { price: 52.69, amount: 216.4009, totalUsd: 11402.16, depthPercent: 12.83 },
      { price: 52.7, amount: 375.8542, totalUsd: 31209.68, depthPercent: 35.12 },
      { price: 52.71, amount: 284.738, totalUsd: 46218.22, depthPercent: 52.01 },
      { price: 52.72, amount: 193.6219, totalUsd: 56425.97, depthPercent: 63.5 },
      { price: 52.73, amount: 353.0752, totalUsd: 75043.62, depthPercent: 84.45 },
      { price: 52.74, amount: 261.959, totalUsd: 88859.34, depthPercent: 100 },
    ],
  },
  XRP: {
    bids: [
      { price: 1.2037, amount: 7476.325, totalUsd: 8999.25, depthPercent: 10.13 },
      { price: 1.2036, amount: 14454.2283, totalUsd: 26396.36, depthPercent: 29.72 },
      { price: 1.2035, amount: 10466.855, totalUsd: 38993.22, depthPercent: 43.9 },
      { price: 1.2034, amount: 6479.4816, totalUsd: 46790.63, depthPercent: 52.68 },
      { price: 1.2033, amount: 13457.3849, totalUsd: 62983.9, depthPercent: 70.91 },
      { price: 1.2032, amount: 9470.0116, totalUsd: 74378.22, depthPercent: 83.73 },
    ],
    asks: [
      { price: 1.2039, amount: 9470.0116, totalUsd: 11400.95, depthPercent: 12.84 },
      { price: 1.204, amount: 16447.9149, totalUsd: 31204.24, depthPercent: 35.13 },
      { price: 1.2041, amount: 12460.5416, totalUsd: 46207.97, depthPercent: 52.02 },
      { price: 1.2042, amount: 8473.1683, totalUsd: 56411.36, depthPercent: 63.51 },
      { price: 1.2043, amount: 15451.0716, totalUsd: 75019.09, depthPercent: 84.46 },
      { price: 1.2044, amount: 11463.6983, totalUsd: 88825.97, depthPercent: 100 },
    ],
  },
  TON: {
    bids: [
      { price: 1.7068, amount: 5272.4077, totalUsd: 8998.95, depthPercent: 10.13 },
      { price: 1.7066, amount: 10193.3216, totalUsd: 26394.87, depthPercent: 29.71 },
      { price: 1.7064, amount: 7381.3708, totalUsd: 38990.44, depthPercent: 43.89 },
      { price: 1.7062, amount: 4569.42, totalUsd: 46786.78, depthPercent: 52.67 },
      { price: 1.706, amount: 9490.3339, totalUsd: 62977.29, depthPercent: 70.89 },
      { price: 1.7058, amount: 6678.3831, totalUsd: 74369.28, depthPercent: 83.71 },
    ],
    asks: [
      { price: 1.7072, amount: 6678.3831, totalUsd: 11401.34, depthPercent: 12.83 },
      { price: 1.7074, amount: 11599.297, totalUsd: 31205.98, depthPercent: 35.13 },
      { price: 1.7076, amount: 8787.3462, totalUsd: 46211.25, depthPercent: 52.02 },
      { price: 1.7078, amount: 5975.3954, totalUsd: 56416.03, depthPercent: 63.51 },
      { price: 1.708, amount: 10896.3093, totalUsd: 75026.92, depthPercent: 84.45 },
      { price: 1.7082, amount: 8084.3585, totalUsd: 88836.63, depthPercent: 100 },
    ],
  },
};

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
