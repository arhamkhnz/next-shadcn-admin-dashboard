export type MetricFormat = "currency" | "number" | "percent";
export type TrendTone = "positive" | "warning" | "negative";

export type KpiMetric = {
  key: "net-sales" | "orders" | "conversion" | "aov" | "margin" | "stockout-risk";
  label: string;
  value: number;
  format: MetricFormat;
  delta: string;
  tone: TrendTone;
  helper: string;
};

export const kpiMetrics: KpiMetric[] = [
  {
    key: "net-sales",
    label: "Net sales",
    value: 248_900,
    format: "currency",
    delta: "+12.4%",
    tone: "positive",
    helper: "$27.6k ahead of plan",
  },
  {
    key: "orders",
    label: "Orders",
    value: 3918,
    format: "number",
    delta: "+8.1%",
    tone: "positive",
    helper: "86 awaiting pick",
  },
  {
    key: "conversion",
    label: "Conversion",
    value: 4.8,
    format: "percent",
    delta: "+0.7pp",
    tone: "positive",
    helper: "Cart recovery lifted",
  },
  {
    key: "aov",
    label: "AOV",
    value: 63.53,
    format: "currency",
    delta: "-2.3%",
    tone: "warning",
    helper: "Bundle mix is softer",
  },
  {
    key: "margin",
    label: "Gross margin",
    value: 48.6,
    format: "percent",
    delta: "+1.9pp",
    tone: "positive",
    helper: "Promo leakage contained",
  },
  {
    key: "stockout-risk",
    label: "Stockout risk",
    value: 9.4,
    format: "percent",
    delta: "+3 SKUs",
    tone: "negative",
    helper: "Replenishment needed",
  },
];

export type TradingPoint = {
  date: string;
  netSales: number;
  targetSales: number;
  orders: number;
};

export const tradingPulseData: TradingPoint[] = [
  { date: "Apr 1", netSales: 11_900, targetSales: 11_100, orders: 188 },
  { date: "Apr 2", netSales: 13_200, targetSales: 11_600, orders: 208 },
  { date: "Apr 3", netSales: 10_900, targetSales: 11_900, orders: 172 },
  { date: "Apr 4", netSales: 14_000, targetSales: 12_300, orders: 220 },
  { date: "Apr 5", netSales: 17_800, targetSales: 12_900, orders: 280 },
  { date: "Apr 6", netSales: 16_300, targetSales: 13_400, orders: 257 },
  { date: "Apr 7", netSales: 18_800, targetSales: 13_800, orders: 296 },
  { date: "Apr 8", netSales: 15_300, targetSales: 14_200, orders: 241 },
  { date: "Apr 9", netSales: 19_700, targetSales: 14_700, orders: 310 },
  { date: "Apr 10", netSales: 21_100, targetSales: 15_100, orders: 332 },
  { date: "Apr 11", netSales: 19_300, targetSales: 15_600, orders: 304 },
  { date: "Apr 12", netSales: 23_000, targetSales: 16_000, orders: 362 },
  { date: "Apr 13", netSales: 22_100, targetSales: 16_500, orders: 348 },
  { date: "Apr 14", netSales: 25_500, targetSales: 16_900, orders: 400 },
];

export type ChannelMix = {
  channel: string;
  revenue: number;
  share: number;
  delta: string;
};

export const channelMix: ChannelMix[] = [
  { channel: "Direct", revenue: 109_400, share: 44, delta: "+14.2%" },
  { channel: "Marketplace", revenue: 77_200, share: 31, delta: "+6.8%" },
  { channel: "Social", revenue: 38_600, share: 16, delta: "+21.5%" },
  { channel: "Retail media", revenue: 23_700, share: 9, delta: "-3.4%" },
];

export type FunnelStage = {
  stage: string;
  count: number;
  rate: number;
  change: string;
};

export const funnelStages: FunnelStage[] = [
  { stage: "Sessions", count: 81_540, rate: 100, change: "+10.1%" },
  { stage: "Product views", count: 52_180, rate: 64, change: "+8.7%" },
  { stage: "Add to cart", count: 12_980, rate: 15.9, change: "+4.3%" },
  { stage: "Checkout", count: 6120, rate: 7.5, change: "+2.1%" },
  { stage: "Orders", count: 3918, rate: 4.8, change: "+0.7pp" },
];

export type InventoryRisk = {
  sku: string;
  product: string;
  channel: string;
  daysLeft: number;
  stock: number;
  sellThrough: number;
  risk: "High" | "Medium" | "Low";
};

export const inventoryRisks: InventoryRisk[] = [
  {
    sku: "WT-240",
    product: "Wool Trail Overshirt",
    channel: "Direct",
    daysLeft: 3,
    stock: 84,
    sellThrough: 86,
    risk: "High",
  },
  {
    sku: "SN-112",
    product: "Studio Nylon Tote",
    channel: "Marketplace",
    daysLeft: 5,
    stock: 126,
    sellThrough: 72,
    risk: "High",
  },
  {
    sku: "KN-501",
    product: "Knit Rib Set",
    channel: "Social",
    daysLeft: 9,
    stock: 210,
    sellThrough: 58,
    risk: "Medium",
  },
  {
    sku: "CS-019",
    product: "Core Shell Jacket",
    channel: "Direct",
    daysLeft: 16,
    stock: 328,
    sellThrough: 41,
    risk: "Low",
  },
];

export type MerchandiseRow = {
  sku: string;
  product: string;
  category: string;
  units: number;
  netSales: number;
  margin: number;
  returns: number;
  stock: number;
  status: "Hero" | "Scale" | "Protect" | "Markdown";
};

export const merchandiseRows: MerchandiseRow[] = [
  {
    sku: "WT-240",
    product: "Wool Trail Overshirt",
    category: "Outerwear",
    units: 842,
    netSales: 67_360,
    margin: 51.4,
    returns: 3.1,
    stock: 84,
    status: "Protect",
  },
  {
    sku: "SN-112",
    product: "Studio Nylon Tote",
    category: "Accessories",
    units: 1268,
    netSales: 50_720,
    margin: 56.8,
    returns: 2.7,
    stock: 126,
    status: "Hero",
  },
  {
    sku: "KN-501",
    product: "Knit Rib Set",
    category: "Sets",
    units: 613,
    netSales: 42_910,
    margin: 49.2,
    returns: 5.8,
    stock: 210,
    status: "Scale",
  },
  {
    sku: "CT-070",
    product: "Canvas Court Sneaker",
    category: "Footwear",
    units: 487,
    netSales: 38_473,
    margin: 44.1,
    returns: 7.4,
    stock: 392,
    status: "Markdown",
  },
  {
    sku: "CS-019",
    product: "Core Shell Jacket",
    category: "Outerwear",
    units: 322,
    netSales: 35_098,
    margin: 47.6,
    returns: 4.4,
    stock: 328,
    status: "Scale",
  },
];
