"use client";

import { type ComponentProps, useState } from "react";

import { cn } from "cn";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  DefaultZIndexes,
  ErrorBar,
  ReferenceLine,
  useYAxisScale,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
} from "recharts";

import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  type ChartRange,
  type CryptoAsset,
  chartColors,
  chartRanges,
  cryptoAssets,
  generateMarketCandles,
  type MarketCandle,
} from "./data";

const chartConfig = {
  price: { label: "Price" },
} satisfies ChartConfig;

const PRICE_MARKER_HEIGHT = 18;
const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
const tooltipPriceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const dayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const hourFormatter = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

const candleBody = (entry: MarketCandle): [number, number] => [
  Math.min(entry.open, entry.close),
  Math.max(entry.open, entry.close),
];
const candleWick = (entry: MarketCandle): [number, number] => {
  const bodyTop = Math.max(entry.open, entry.close);
  return [bodyTop - entry.low, entry.high - bodyTop];
};

function MarketTooltip({ active, payload }: Pick<ComponentProps<typeof ChartTooltipContent>, "active" | "payload">) {
  const candle: MarketCandle | undefined = payload?.[0]?.payload;
  if (!active || !candle) return null;

  return (
    <ChartTooltipContent
      active={active}
      className="min-w-44"
      hideIndicator
      payload={payload}
      labelFormatter={() => `${fullDateFormatter.format(candle.time)} UTC`}
      formatter={() => (
        <dl className="grid w-full gap-1.5">
          {(["open", "high", "low", "close"] as const).map((key) => (
            <div key={key} className="flex justify-between gap-5">
              <dt className="text-muted-foreground capitalize">{key}</dt>
              <dd className="font-medium tabular-nums">
                {(candle[key] >= 10 ? tooltipPriceFormatter : priceFormatter).format(candle[key])}
              </dd>
            </div>
          ))}
        </dl>
      )}
    />
  );
}

function PriceAxisTick({ x, y, payload, markerPrices }: YAxisTickContentProps & { markerPrices: number[] }) {
  const scale = useYAxisScale();
  if (typeof x !== "number" || typeof y !== "number" || typeof payload.value !== "number") return null;

  const overlapsMarker = markerPrices.some((price) => {
    const markerY = scale?.(price);
    return markerY !== undefined && Math.abs(markerY - y) < PRICE_MARKER_HEIGHT;
  });
  if (overlapsMarker) return null;

  return (
    <text x={x} y={y} textAnchor="start" dominantBaseline="central" className="fill-muted-foreground text-xs">
      {payload.value < 10 ? priceFormatter.format(payload.value) : `$${compactFormatter.format(payload.value)}`}
    </text>
  );
}

function ReferencePriceLabel({
  viewBox,
  price,
  color,
  label,
}: {
  viewBox?: { x?: number; y?: number; width?: number };
  price: number;
  color: string;
  label: string;
}) {
  if (viewBox?.x === undefined || viewBox.y === undefined || viewBox.width === undefined) return null;

  const x = viewBox.x + viewBox.width + 4;
  const y = viewBox.y;

  return (
    <g>
      <text
        x={viewBox.x + 6}
        y={y - 7}
        fill={color}
        fontSize={11}
        paintOrder="stroke"
        stroke="var(--background)"
        strokeWidth={3}
      >
        {label}
      </text>
      <rect x={x} y={y - PRICE_MARKER_HEIGHT / 2} width={72} height={PRICE_MARKER_HEIGHT} rx={2} fill={color} />
      <text
        x={x + 4}
        y={y}
        textAnchor="start"
        dominantBaseline="central"
        fill="var(--color-white)"
        className="text-xs tabular-nums"
      >
        {priceFormatter.format(price)}
      </text>
    </g>
  );
}

export function PriceChart() {
  const [assetSymbol, setAssetSymbol] = useState<CryptoAsset["symbol"]>("BTC");
  const [rangeValue, setRangeValue] = useState<ChartRange>("1D");
  const asset = cryptoAssets.find((item) => item.symbol === assetSymbol);
  if (!asset) return null;

  const data = generateMarketCandles(asset, rangeValue);
  const latestCandle = data[data.length - 1];
  if (!latestCandle) return null;

  const averageBuyPrice = asset.averageBuyPrice;
  const low = Math.min(averageBuyPrice, ...data.map((candle) => candle.low));
  const high = Math.max(averageBuyPrice, ...data.map((candle) => candle.high));
  const padding = (high - low) * 0.08;
  const tickFormatter = (time: number) => (rangeValue === "1D" ? hourFormatter : dayFormatter).format(time);
  const referencePrices = [
    { label: "Latest price", price: latestCandle.close, color: latestCandle.fill, dash: "3 3" },
    { label: "Average buy price", price: averageBuyPrice, color: chartColors.averageBuy, dash: "5 4" },
  ];
  const markerPrices = referencePrices.map((reference) => reference.price);

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader className="gap-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
          <div className="max-w-full overflow-x-auto">
            <ToggleGroup
              type="single"
              size="sm"
              variant="outline"
              spacing={0}
              value={asset.symbol}
              aria-label="Chart asset"
              onValueChange={(value) => {
                const selectedAsset = cryptoAssets.find((item) => item.symbol === value);
                if (selectedAsset) setAssetSymbol(selectedAsset.symbol);
              }}
            >
              {cryptoAssets.map((item) => (
                <ToggleGroupItem
                  key={item.symbol}
                  value={item.symbol}
                  aria-label={`${item.name}, USD pair`}
                  className="gap-1.5"
                >
                  <SimpleIcon icon={item.icon} className={cn("size-4", item.iconClassName)} aria-hidden="true" />
                  {item.symbol}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            spacing={0}
            value={rangeValue}
            aria-label="Chart time range"
            onValueChange={(value) => {
              const selectedRange = chartRanges.find((item) => item === value);
              if (selectedRange) setRangeValue(selectedRange);
            }}
          >
            {chartRanges.map((item) => (
              <ToggleGroupItem key={item} value={item} className="min-w-10">
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-muted-foreground text-xs">{asset.symbol}/USD</p>
          <p className="text-2xl leading-none tracking-tight tabular-nums">
            {priceFormatter.format(latestCandle.close)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full sm:h-80"
          aria-label={`${asset.name} price chart, ${rangeValue}. Illustrative data.`}
        >
          <ComposedChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={48}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[low - padding, high + padding]}
              orientation="right"
              width={88}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickSize={0}
              tickCount={5}
              tick={(props: YAxisTickContentProps) => <PriceAxisTick {...props} markerPrices={markerPrices} />}
            />
            {referencePrices.map((reference) => (
              <ReferenceLine
                key={reference.label}
                y={reference.price}
                stroke={reference.color}
                strokeWidth={1}
                strokeDasharray={reference.dash}
                label={<ReferencePriceLabel {...reference} />}
              />
            ))}
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
              content={({ active, payload }) => <MarketTooltip active={active} payload={payload} />}
            />
            <Bar dataKey={candleBody} name="Price" maxBarSize={12} minPointSize={1} isAnimationActive={false}>
              <ErrorBar
                dataKey={candleWick}
                width={0}
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                zIndex={DefaultZIndexes.bar - 1}
                isAnimationActive={false}
              />
            </Bar>
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
