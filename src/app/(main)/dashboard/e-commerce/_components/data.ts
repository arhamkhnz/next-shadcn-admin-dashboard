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
