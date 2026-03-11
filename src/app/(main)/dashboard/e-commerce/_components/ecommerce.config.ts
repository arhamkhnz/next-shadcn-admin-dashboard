import { addDays, differenceInCalendarDays, endOfDay, format, startOfDay, subDays } from "date-fns";

export type TimeRange = "7d" | "30d" | "90d";
export type ComparisonMode = "previous-period" | "target-plan";
export type MetricFormat = "currency" | "number" | "percent" | "rate";
export type MetricDeltaFormat = "relative" | "points" | "absolute";
export type TrendIntent = "up" | "down";
export type AlertUrgency = "stable" | "watch" | "critical";
export type MerchandiseStatus = "Replenish" | "Tight" | "Review returns" | "Push bundles" | "Healthy" | "Aging";

export type TradingPoint = {
  date: Date;
  dayLabel: string;
  isoDate: string;
  netSales: number;
  targetSales: number;
  orders: number;
  sessions: number;
  productViews: number;
  addToCart: number;
  checkoutStarted: number;
  purchases: number;
  grossMarginRate: number;
  lateShipmentRate: number;
  returnRate: number;
};

export type CommerceMetric = {
  key: string;
  label: string;
  value: number;
  baseline: number;
  format: MetricFormat;
  deltaFormat: MetricDeltaFormat;
  comparisonLabel: string;
  context: string;
  intent: TrendIntent;
};

export type TradeTapeItem = {
  key: string;
  label: string;
  value: string;
  detail: string;
  urgency: AlertUrgency;
};

export type FunnelStage = {
  key: string;
  label: string;
  count: number;
  shareOfStart: number;
  passThroughRate: number;
  dropOffRate: number;
};

export type OpsAlert = {
  key: string;
  label: string;
  detail: string;
  metricLabel: string;
  thresholdLabel: string;
  progress: number;
  urgency: AlertUrgency;
  recommendation: string;
};

export type MerchandiseRow = {
  sku: string;
  category: string;
  revenue: number;
  units: number;
  marginRate: number;
  conversionRate: number;
  stockCoverDays: number;
  status: MerchandiseStatus;
  recommendation: string;
  impactScore: number;
};

export type DecisionItem = {
  key: string;
  title: string;
  summary: string;
  impactLabel: string;
  urgency: AlertUrgency;
  owner: string;
  nextStep: string;
};

export type StoreStatus = {
  label: string;
  detail: string;
  urgency: AlertUrgency;
};

export type EcommerceSnapshot = {
  metrics: CommerceMetric[];
  tradeTape: TradeTapeItem[];
  tradingSeries: TradingPoint[];
  decisionQueue: DecisionItem[];
  funnelStages: FunnelStage[];
  opsAlerts: OpsAlert[];
  merchandiseRows: MerchandiseRow[];
  anomaly: {
    label: string;
    title: string;
    detail: string;
  };
  summary: {
    targetAttainmentRate: number;
    orderPaceRate: number;
    lateShipmentRate: number;
    returnRate: number;
    lowCoverSkuCount: number;
    agingInventoryValue: number;
  };
  leakNote: {
    title: string;
    detail: string;
  };
  storeStatus: StoreStatus;
};

type ProductSeed = {
  sku: string;
  category: string;
  revenueShare: number;
  unitsShare: number;
  marginRate: number;
  conversionRate: number;
  stockCoverDays: number;
  demandLift: number;
  returnRate: number;
  status: MerchandiseStatus;
  recommendation: string;
};

const TODAY = startOfDay(new Date());
const SERIES_START = subDays(TODAY, 89);

export const TIME_RANGE_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
];

export const COMPARISON_OPTIONS: Array<{ value: ComparisonMode; label: string }> = [
  { value: "previous-period", label: "Previous period" },
  { value: "target-plan", label: "Target pace" },
];

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    sku: "Meridian Knit Set",
    category: "Matching sets",
    revenueShare: 0.17,
    unitsShare: 0.12,
    marginRate: 0.66,
    conversionRate: 0.047,
    stockCoverDays: 8,
    demandLift: 0.22,
    returnRate: 0.059,
    status: "Replenish",
    recommendation: "Pull forward the next knit restock before weekend paid traffic ramps.",
  },
  {
    sku: "Harbour Denim Shirt",
    category: "Core denim",
    revenueShare: 0.15,
    unitsShare: 0.11,
    marginRate: 0.61,
    conversionRate: 0.042,
    stockCoverDays: 11,
    demandLift: 0.18,
    returnRate: 0.063,
    status: "Tight",
    recommendation: "Shift homepage inventory to the best-selling washes and cap broad discounts.",
  },
  {
    sku: "Solstice Rib Tank",
    category: "Seasonal basics",
    revenueShare: 0.13,
    unitsShare: 0.15,
    marginRate: 0.57,
    conversionRate: 0.039,
    stockCoverDays: 23,
    demandLift: 0.06,
    returnRate: 0.052,
    status: "Push bundles",
    recommendation: "Bundle with outerwear to lift AOV without pressuring margin.",
  },
  {
    sku: "Atlas Canvas Tote",
    category: "Accessories",
    revenueShare: 0.12,
    unitsShare: 0.1,
    marginRate: 0.71,
    conversionRate: 0.051,
    stockCoverDays: 28,
    demandLift: 0.12,
    returnRate: 0.031,
    status: "Healthy",
    recommendation: "Keep this attached to checkout cross-sell placements while CPC remains efficient.",
  },
  {
    sku: "Sable Lounge Pant",
    category: "Loungewear",
    revenueShare: 0.11,
    unitsShare: 0.09,
    marginRate: 0.54,
    conversionRate: 0.035,
    stockCoverDays: 32,
    demandLift: -0.05,
    returnRate: 0.089,
    status: "Review returns",
    recommendation: "Audit fit notes and imagery because return behavior is eroding contribution margin.",
  },
  {
    sku: "Nova Court Sneaker",
    category: "Footwear",
    revenueShare: 0.1,
    unitsShare: 0.07,
    marginRate: 0.58,
    conversionRate: 0.031,
    stockCoverDays: 41,
    demandLift: -0.12,
    returnRate: 0.064,
    status: "Aging",
    recommendation: "Use selective markdowns on slower sizes before inventory carrying cost compounds.",
  },
];

const PROMO_WINDOWS = new Set([13, 14, 15, 41, 42, 43, 66, 67, 68, 81, 82]);

export const TRADING_SERIES: TradingPoint[] = Array.from({ length: 90 }, (_, index) => {
  const date = addDays(SERIES_START, index);
  const weekdayCurve = [0.88, 0.94, 1.01, 1.06, 1.14, 1.28, 0.91][date.getDay()] ?? 1;
  const pulse = 1 + Math.sin(index / 4.6) * 0.06 + Math.cos(index / 9.4) * 0.03;
  const promoLift = PROMO_WINDOWS.has(index) ? 1.17 : 1;
  const sessions = Math.round((5_600 + index * 10) * weekdayCurve * pulse * promoLift);
  const productViews = Math.round(sessions * (0.55 + ((index + 2) % 5) * 0.012));
  const addToCart = Math.round(productViews * (0.104 + (index % 4) * 0.008));
  const checkoutStarted = Math.round(addToCart * (0.59 + ((index + 1) % 3) * 0.024));
  const purchases = Math.round(checkoutStarted * (0.69 + (index % 4) * 0.018));
  const aov = 82 + Math.sin(index / 5.7) * 5.2 + ((index % 6) - 2) * 1.35;
  const netSales = Math.round(purchases * aov);
  const targetSales = Math.round(
    netSales * (PROMO_WINDOWS.has(index) ? 1.06 : index % 8 === 0 ? 1.11 : 1.03 + ((index + 1) % 3) * 0.008),
  );
  const grossMarginRate = 0.57 + Math.sin(index / 11) * 0.026 - (PROMO_WINDOWS.has(index) ? 0.014 : 0);
  const lateShipmentRate = 0.023 + ((index + 2) % 13 === 0 ? 0.014 : 0) + Math.max(0, (5 - date.getDay()) * 0.001);
  const returnRate = 0.061 + (index % 17 === 0 ? 0.018 : 0) + Math.max(0, 0.006 - purchases / 50_000);

  return {
    date,
    dayLabel: format(date, "MMM d"),
    isoDate: format(date, "yyyy-MM-dd"),
    netSales,
    targetSales,
    orders: purchases,
    sessions,
    productViews,
    addToCart,
    checkoutStarted,
    purchases,
    grossMarginRate,
    lateShipmentRate,
    returnRate,
  };
});

export function getPresetDateRange(range: TimeRange) {
  const days = range === "7d" ? 6 : range === "30d" ? 29 : 89;
  return {
    from: subDays(TODAY, days),
    to: TODAY,
  };
}

export function getTimeRangeFromDateRange(dateRange: { from: Date; to: Date }): TimeRange {
  const dayCount = differenceInCalendarDays(endOfDay(dateRange.to), startOfDay(dateRange.from)) + 1;
  if (dayCount <= 7) {
    return "7d";
  }
  if (dayCount <= 30) {
    return "30d";
  }
  return "90d";
}

export function getComparisonLabel(mode: ComparisonMode) {
  return COMPARISON_OPTIONS.find((option) => option.value === mode)?.label ?? "Previous period";
}

export function buildEcommerceSnapshot(input: {
  dateRange: { from: Date; to: Date };
  comparisonMode: ComparisonMode;
}): EcommerceSnapshot {
  const from = startOfDay(input.dateRange.from);
  const to = startOfDay(input.dateRange.to);
  const currentSeries = TRADING_SERIES.filter((point) => point.date >= from && point.date <= to);
  const rangeLength = Math.max(currentSeries.length, 1);
  const currentAggregate = aggregateSeries(currentSeries);
  const previousSeries = TRADING_SERIES.filter((point) => point.date < from).slice(-rangeLength);
  const previousAggregate = aggregateSeries(previousSeries);
  const targetBaseline = buildTargetBaseline(currentAggregate);
  const baseline = input.comparisonMode === "target-plan" ? targetBaseline : previousAggregate;
  const merchandiseRows = buildMerchandiseRows(currentAggregate.netSales, currentAggregate.orders, rangeLength);
  const targetAttainmentRate =
    currentAggregate.targetSales > 0 ? (currentAggregate.netSales / currentAggregate.targetSales) * 100 : 0;
  const revenueAtStockoutRisk = merchandiseRows
    .filter((row) => row.stockCoverDays <= 14)
    .reduce((total, row) => total + row.revenue * 0.42, 0);
  const lowCoverSkuCount = merchandiseRows.filter((row) => row.stockCoverDays <= 14).length;
  const agingInventoryValue = merchandiseRows
    .filter((row) => row.status === "Aging")
    .reduce((total, row) => total + row.revenue * 0.34, 0);

  const metrics: CommerceMetric[] = [
    {
      key: "net-sales",
      label: "Net Sales",
      value: currentAggregate.netSales,
      baseline: baseline.netSales,
      format: "currency",
      deltaFormat: "relative",
      comparisonLabel: getComparisonLabel(input.comparisonMode),
      context: `Target ${formatShortCurrency(currentAggregate.targetSales)} · pace ${formatPercent(targetAttainmentRate / 100, 0)}`,
      intent: "up",
    },
    {
      key: "orders",
      label: "Orders",
      value: currentAggregate.orders,
      baseline: baseline.orders,
      format: "number",
      deltaFormat: "relative",
      comparisonLabel: getComparisonLabel(input.comparisonMode),
      context: `Sessions ${formatCompactNumber(currentAggregate.sessions)} · purchases ${formatCompactNumber(currentAggregate.purchases)}`,
      intent: "up",
    },
    {
      key: "conversion",
      label: "Conversion",
      value: currentAggregate.sessions > 0 ? currentAggregate.purchases / currentAggregate.sessions : 0,
      baseline: baseline.sessions > 0 ? baseline.purchases / baseline.sessions : 0,
      format: "percent",
      deltaFormat: "points",
      comparisonLabel: getComparisonLabel(input.comparisonMode),
      context: `Checkout completion ${formatPercent(currentAggregate.checkoutCompletionRate, 1)}`,
      intent: "up",
    },
    {
      key: "aov",
      label: "AOV",
      value: currentAggregate.orders > 0 ? currentAggregate.netSales / currentAggregate.orders : 0,
      baseline: baseline.orders > 0 ? baseline.netSales / baseline.orders : 0,
      format: "currency",
      deltaFormat: "relative",
      comparisonLabel: getComparisonLabel(input.comparisonMode),
      context: `Basket depth ${currentAggregate.unitsPerOrder.toFixed(1)} items/order`,
      intent: "up",
    },
    {
      key: "margin",
      label: "Gross Margin",
      value: currentAggregate.grossMarginRate,
      baseline: baseline.grossMarginRate,
      format: "rate",
      deltaFormat: "points",
      comparisonLabel: getComparisonLabel(input.comparisonMode),
      context: `Returns ${formatPercent(currentAggregate.returnRate, 1)} · markdown drag limited`,
      intent: "up",
    },
    {
      key: "stockout-risk",
      label: "Stockout Risk",
      value: revenueAtStockoutRisk,
      baseline:
        input.comparisonMode === "target-plan" ? currentAggregate.netSales * 0.08 : previousAggregate.netSales * 0.12,
      format: "currency",
      deltaFormat: "relative",
      comparisonLabel: getComparisonLabel(input.comparisonMode),
      context: `${lowCoverSkuCount} low-cover SKUs · owner action required`,
      intent: "down",
    },
  ];

  const funnelStages = buildFunnelStages(currentAggregate);
  const biggestLeak = funnelStages
    .slice(1)
    .reduce(
      (largest, stage) => (stage.dropOffRate > largest.dropOffRate ? stage : largest),
      funnelStages[1] ?? funnelStages[0],
    );
  const leakTitle =
    biggestLeak?.key === "add-to-cart"
      ? "Merchandising leak at add to cart"
      : biggestLeak?.key === "checkout-started"
        ? "Checkout initiation is the biggest drop"
        : biggestLeak?.key === "purchases"
          ? "Purchase completion needs attention"
          : "Traffic is not turning into consideration fast enough";

  const opsAlerts = buildOpsAlerts({
    lowCoverSkuCount,
    agingInventoryValue,
    lateShipmentRate: currentAggregate.lateShipmentRate,
    returnRate: currentAggregate.returnRate,
    revenueAtStockoutRisk,
  });

  const decisionQueue = buildDecisionQueue({
    revenueAtStockoutRisk,
    merchandiseRows,
    biggestLeak,
    lateShipmentRate: currentAggregate.lateShipmentRate,
    targetAttainmentRate,
  });

  const anomalyPoint = currentSeries.reduce(
    (largest, point) => {
      const gap = Math.abs(point.netSales - point.targetSales);
      if (gap > largest.gap) {
        return { point, gap };
      }
      return largest;
    },
    { point: currentSeries[0] ?? TRADING_SERIES.at(-1) ?? TRADING_SERIES[0], gap: 0 },
  );

  const storeStatus = buildStoreStatus({
    targetAttainmentRate,
    lateShipmentRate: currentAggregate.lateShipmentRate,
    lowCoverSkuCount,
  });

  return {
    metrics,
    tradeTape: [
      {
        key: "pace",
        label: "Pace to target",
        value: formatPercent(targetAttainmentRate / 100, 0),
        detail:
          targetAttainmentRate >= 100 ? "Ahead of plan with margin intact" : "Short on pace against the current plan",
        urgency: targetAttainmentRate >= 100 ? "stable" : targetAttainmentRate >= 96 ? "watch" : "critical",
      },
      {
        key: "stock",
        label: "Low-cover pressure",
        value: `${lowCoverSkuCount} SKUs`,
        detail: `${formatShortCurrency(revenueAtStockoutRisk)} at risk if replenishment slips`,
        urgency: lowCoverSkuCount >= 2 ? "critical" : "watch",
      },
      {
        key: "returns",
        label: "Returns signal",
        value: formatPercent(currentAggregate.returnRate, 1),
        detail:
          currentAggregate.returnRate >= 0.075
            ? "Fit and expectation gaps need review"
            : "Return behavior is within healthy guardrails",
        urgency: currentAggregate.returnRate >= 0.075 ? "watch" : "stable",
      },
    ],
    tradingSeries: currentSeries,
    decisionQueue,
    funnelStages,
    opsAlerts,
    merchandiseRows,
    anomaly: {
      label: anomalyPoint.point.dayLabel,
      title: PROMO_WINDOWS.has(getSeriesIndex(anomalyPoint.point.date))
        ? "Campaign spike outran target"
        : "Demand slipped below planned pace",
      detail: `${anomalyPoint.point.dayLabel} moved ${formatShortCurrency(anomalyPoint.gap)} away from plan. Reconcile paid traffic and replenishment before the next push.`,
    },
    summary: {
      targetAttainmentRate,
      orderPaceRate: baseline.orders > 0 ? (currentAggregate.orders / baseline.orders) * 100 : 0,
      lateShipmentRate: currentAggregate.lateShipmentRate,
      returnRate: currentAggregate.returnRate,
      lowCoverSkuCount,
      agingInventoryValue,
    },
    leakNote: {
      title: leakTitle,
      detail: `${formatPercent(biggestLeak?.dropOffRate ?? 0, 1)} drop between ${describeLeakTransition(biggestLeak?.key)}. ${decisionQueue[1]?.nextStep ?? "Tighten the next conversion step before scaling spend."}`,
    },
    storeStatus,
  };
}

type Aggregate = {
  netSales: number;
  targetSales: number;
  orders: number;
  sessions: number;
  productViews: number;
  addToCart: number;
  checkoutStarted: number;
  purchases: number;
  grossMarginRate: number;
  lateShipmentRate: number;
  returnRate: number;
  checkoutCompletionRate: number;
  unitsPerOrder: number;
};

function aggregateSeries(series: TradingPoint[]): Aggregate {
  const totals = series.reduce(
    (accumulator, point) => {
      accumulator.netSales += point.netSales;
      accumulator.targetSales += point.targetSales;
      accumulator.orders += point.orders;
      accumulator.sessions += point.sessions;
      accumulator.productViews += point.productViews;
      accumulator.addToCart += point.addToCart;
      accumulator.checkoutStarted += point.checkoutStarted;
      accumulator.purchases += point.purchases;
      accumulator.grossMarginNumerator += point.netSales * point.grossMarginRate;
      accumulator.lateShipmentNumerator += point.orders * point.lateShipmentRate;
      accumulator.returnNumerator += point.orders * point.returnRate;
      return accumulator;
    },
    {
      netSales: 0,
      targetSales: 0,
      orders: 0,
      sessions: 0,
      productViews: 0,
      addToCart: 0,
      checkoutStarted: 0,
      purchases: 0,
      grossMarginNumerator: 0,
      lateShipmentNumerator: 0,
      returnNumerator: 0,
    },
  );

  const orders = Math.max(totals.orders, 1);
  const checkoutStarted = Math.max(totals.checkoutStarted, 1);
  const _purchases = Math.max(totals.purchases, 1);

  return {
    netSales: totals.netSales,
    targetSales: totals.targetSales,
    orders: totals.orders,
    sessions: totals.sessions,
    productViews: totals.productViews,
    addToCart: totals.addToCart,
    checkoutStarted: totals.checkoutStarted,
    purchases: totals.purchases,
    grossMarginRate: totals.netSales > 0 ? totals.grossMarginNumerator / totals.netSales : 0,
    lateShipmentRate: totals.orders > 0 ? totals.lateShipmentNumerator / orders : 0,
    returnRate: totals.orders > 0 ? totals.returnNumerator / orders : 0,
    checkoutCompletionRate: totals.purchases / checkoutStarted,
    unitsPerOrder: 1.7 + (totals.purchases % 5) * 0.1,
  };
}

function buildTargetBaseline(current: Aggregate): Aggregate {
  return {
    netSales: current.targetSales,
    targetSales: current.targetSales,
    orders: Math.round(current.orders * 1.04),
    sessions: Math.round(current.sessions * 0.96),
    productViews: Math.round(current.productViews * 0.99),
    addToCart: Math.round(current.addToCart * 1.05),
    checkoutStarted: Math.round(current.checkoutStarted * 1.04),
    purchases: Math.round(current.purchases * 1.03),
    grossMarginRate: 0.6,
    lateShipmentRate: 0.024,
    returnRate: 0.057,
    checkoutCompletionRate: 0.74,
    unitsPerOrder: 1.8,
  };
}

function buildFunnelStages(aggregate: Aggregate): FunnelStage[] {
  const stages = [
    { key: "sessions", label: "Sessions", count: aggregate.sessions },
    { key: "product-views", label: "Product views", count: aggregate.productViews },
    { key: "add-to-cart", label: "Add to cart", count: aggregate.addToCart },
    { key: "checkout-started", label: "Checkout started", count: aggregate.checkoutStarted },
    { key: "purchases", label: "Purchases", count: aggregate.purchases },
  ];

  const initialCount = Math.max(stages[0]?.count ?? 1, 1);

  return stages.map((stage, index) => {
    const previousCount = Math.max(stages[index - 1]?.count ?? stage.count, 1);
    const passThroughRate = index === 0 ? 1 : stage.count / previousCount;
    return {
      ...stage,
      shareOfStart: stage.count / initialCount,
      passThroughRate,
      dropOffRate: index === 0 ? 0 : 1 - passThroughRate,
    };
  });
}

function buildOpsAlerts(input: {
  lowCoverSkuCount: number;
  agingInventoryValue: number;
  lateShipmentRate: number;
  returnRate: number;
  revenueAtStockoutRisk: number;
}): OpsAlert[] {
  return [
    {
      key: "stockout-risk",
      label: "Stock cover watch",
      detail: `${input.lowCoverSkuCount} best sellers inside 14 days of cover`,
      metricLabel: formatShortCurrency(input.revenueAtStockoutRisk),
      thresholdLabel: "Guardrail: <$40K risk",
      progress: Math.min((input.revenueAtStockoutRisk / 90_000) * 100, 100),
      urgency: input.revenueAtStockoutRisk > 55_000 ? "critical" : "watch",
      recommendation: "Hold broad promos on low-cover styles until replenishment ETA is locked.",
    },
    {
      key: "aging-inventory",
      label: "Aging inventory",
      detail: "Slow-moving footwear is tying up working capital",
      metricLabel: formatShortCurrency(input.agingInventoryValue),
      thresholdLabel: "Guardrail: <$25K aging",
      progress: Math.min((input.agingInventoryValue / 55_000) * 100, 100),
      urgency: input.agingInventoryValue > 28_000 ? "watch" : "stable",
      recommendation: "Use selective markdowns and bundle placements instead of a sitewide cut.",
    },
    {
      key: "late-shipments",
      label: "Fulfillment reliability",
      detail: "Late shipments are the main service-level risk",
      metricLabel: formatPercent(input.lateShipmentRate, 1),
      thresholdLabel: "Guardrail: <2.8%",
      progress: Math.min((input.lateShipmentRate / 0.05) * 100, 100),
      urgency: input.lateShipmentRate > 0.03 ? "watch" : "stable",
      recommendation: "Shift pick-wave priority to high-demand orders before the next promo drop.",
    },
    {
      key: "returns",
      label: "Returns hotspot",
      detail: "Loungewear fit issues are inflating return handling cost",
      metricLabel: formatPercent(input.returnRate, 1),
      thresholdLabel: "Guardrail: <6.5%",
      progress: Math.min((input.returnRate / 0.11) * 100, 100),
      urgency: input.returnRate > 0.075 ? "critical" : "watch",
      recommendation: "Update fit copy and stop amplifying the worst-returning SKU until content is fixed.",
    },
  ];
}

function buildMerchandiseRows(netSales: number, orders: number, rangeLength: number): MerchandiseRow[] {
  return PRODUCT_SEEDS.map((seed, _index) => {
    const revenue = Math.round(netSales * seed.revenueShare);
    const units = Math.max(1, Math.round(orders * seed.unitsShare));
    const stockCoverAdjustment = rangeLength <= 7 ? 0 : rangeLength <= 30 ? 1 : 3;
    const stockCoverDays = Math.max(6, Math.round(seed.stockCoverDays - seed.demandLift * 10 + stockCoverAdjustment));
    const impactScore = revenue * (seed.marginRate + Math.max(seed.demandLift, 0.04));

    return {
      sku: seed.sku,
      category: seed.category,
      revenue,
      units,
      marginRate: seed.marginRate,
      conversionRate: seed.conversionRate,
      stockCoverDays,
      status: seed.status,
      recommendation: seed.recommendation,
      impactScore,
    };
  }).sort((left, right) => right.impactScore - left.impactScore);
}

function buildDecisionQueue(input: {
  revenueAtStockoutRisk: number;
  merchandiseRows: MerchandiseRow[];
  biggestLeak: FunnelStage | undefined;
  lateShipmentRate: number;
  targetAttainmentRate: number;
}): DecisionItem[] {
  const stockLead = input.merchandiseRows.find((row) => row.stockCoverDays <= 14) ?? input.merchandiseRows[0];
  const returnsLead = input.merchandiseRows.find((row) => row.status === "Review returns") ?? input.merchandiseRows[1];
  const slowdownLead = input.merchandiseRows.find((row) => row.status === "Aging") ?? input.merchandiseRows[2];

  return [
    {
      key: "replenishment",
      title: `Replenish ${stockLead.sku}`,
      summary: `${stockLead.stockCoverDays} days of cover left on a leading revenue driver.`,
      impactLabel: formatShortCurrency(input.revenueAtStockoutRisk),
      urgency: stockLead.stockCoverDays <= 10 ? "critical" : "watch",
      owner: "Inventory planning",
      nextStep: "Confirm inbound ETA and trim paid exposure on the affected size run until stock lands.",
    },
    {
      key: "conversion",
      title: "Tighten the biggest funnel leak",
      summary:
        input.biggestLeak?.key === "add-to-cart"
          ? "Traffic is seeing products but not starting the basket often enough."
          : input.biggestLeak?.key === "checkout-started"
            ? "Cart intent is present, but checkout starts are lagging."
            : "Shoppers are entering checkout but purchase completion is soft.",
      impactLabel: formatPercent(input.biggestLeak?.dropOffRate ?? 0, 1),
      urgency: input.targetAttainmentRate < 98 ? "critical" : "watch",
      owner: "Site merchandising",
      nextStep: "Review PDP messaging and friction points before increasing acquisition spend.",
    },
    {
      key: "service",
      title: `Stabilize ${returnsLead.sku}`,
      summary:
        input.lateShipmentRate > 0.03
          ? "Fulfillment drag is threatening repeat purchase confidence."
          : `${returnsLead.sku} is carrying the biggest post-purchase quality signal.`,
      impactLabel:
        input.lateShipmentRate > 0.03
          ? formatPercent(input.lateShipmentRate, 1)
          : formatShortCurrency(slowdownLead.revenue * 0.2),
      urgency: input.lateShipmentRate > 0.03 ? "watch" : "stable",
      owner: input.lateShipmentRate > 0.03 ? "Warehouse lead" : "CX + merchandising",
      nextStep:
        input.lateShipmentRate > 0.03
          ? "Re-sequence pick waves and elevate overdue high-value orders before the next send."
          : "Patch fit guidance and cut incremental exposure on the highest-returning style until content is corrected.",
    },
  ];
}

function buildStoreStatus(input: {
  targetAttainmentRate: number;
  lateShipmentRate: number;
  lowCoverSkuCount: number;
}): StoreStatus {
  if (input.targetAttainmentRate < 96 || input.lowCoverSkuCount >= 2) {
    return {
      label: "Actionable watchlist",
      detail: "Revenue is still recoverable, but inventory and pace need intervention today.",
      urgency: "critical",
    };
  }

  if (input.lateShipmentRate > 0.03) {
    return {
      label: "Steady, with ops drag",
      detail: "Demand is holding, but service levels need attention before the next campaign.",
      urgency: "watch",
    };
  }

  return {
    label: "Healthy trading day",
    detail: "Sales pace and service levels are both inside acceptable guardrails.",
    urgency: "stable",
  };
}

function describeLeakTransition(leakKey: string | undefined) {
  switch (leakKey) {
    case "product-views":
      return "sessions and product views";
    case "add-to-cart":
      return "product views and add to cart";
    case "checkout-started":
      return "add to cart and checkout starts";
    case "purchases":
      return "checkout starts and purchases";
    default:
      return "traffic and purchase";
  }
}

function getSeriesIndex(date: Date) {
  return differenceInCalendarDays(date, SERIES_START);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatShortCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits,
  }).format(value);
}
