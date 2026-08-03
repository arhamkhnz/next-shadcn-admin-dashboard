import { useMemo } from "react";

import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import type { CardiacRhythm, PatientRecord } from "./data";
import { useTrendTick } from "./use-realtime-tick";
import { normalizedTrendTemplate } from "./waveform-data";

export type TrendKind = "heart-rate" | "map" | "spo2";

interface VitalTrendChartProps {
  kind: TrendKind;
  patient: PatientRecord;
}

interface TrendPoint {
  sample: number;
  value: number;
}

interface TrendDefinition {
  baseline: "arterialMap" | "heartRate" | "spo2";
  domain: [number, number];
  ticks: number[];
  variation: number;
}

const TREND_POINT_COUNT = 90;

const trendChartConfig = {
  value: {
    label: "Value",
    color: "currentColor",
  },
} satisfies ChartConfig;

const trendClasses: Record<TrendKind, string> = {
  "heart-rate": "text-lime-500 dark:text-lime-400",
  map: "text-red-500 dark:text-red-400",
  spo2: "text-cyan-500 dark:text-cyan-400",
};

const trendDefinitions = {
  "heart-rate": {
    baseline: "heartRate",
    domain: [50, 150],
    ticks: [50, 100, 150],
    variation: 1.4,
  },
  map: {
    baseline: "arterialMap",
    domain: [50, 150],
    ticks: [50, 100, 150],
    variation: 4,
  },
  spo2: {
    baseline: "spo2",
    domain: [80, 100],
    ticks: [80, 90, 100],
    variation: 0.65,
  },
} satisfies Record<TrendKind, TrendDefinition>;

const heartRateVariations: Record<CardiacRhythm, number> = {
  "atrial-fibrillation": 4.5,
  "low-voltage": 1.4,
  "occasional-pvc": 3,
  paced: 1,
  sinus: 1.4,
  "sinus-bradycardia": 1.2,
  "sinus-tachycardia": 2,
  "st-depression": 1.8,
};

function getTemplateValue(patient: PatientRecord, sample: number) {
  const phaseOffset = Math.round(patient.signalProfile.phase * normalizedTrendTemplate.length);
  const index =
    (((sample + phaseOffset) % normalizedTrendTemplate.length) + normalizedTrendTemplate.length) %
    normalizedTrendTemplate.length;
  return normalizedTrendTemplate[index] ?? 0;
}

function getTrendValue(patient: PatientRecord, kind: TrendKind, sample: number) {
  const definition = trendDefinitions[kind];
  const templateValue = getTemplateValue(patient, sample);
  const baseline = patient[definition.baseline];
  let variation = definition.variation;

  if (kind === "heart-rate") {
    variation = heartRateVariations[patient.signalProfile.rhythm];
  }

  const value = baseline + templateValue * variation;
  const [minimum, maximum] = definition.domain;

  return Math.min(Math.max(value, minimum), maximum);
}

function createTrendData(patient: PatientRecord, kind: TrendKind, endSample: number) {
  return Array.from({ length: TREND_POINT_COUNT }, (_, index): TrendPoint => {
    const sample = endSample - (TREND_POINT_COUNT - index - 1);

    return {
      sample,
      value: getTrendValue(patient, kind, sample),
    };
  });
}

export function VitalTrendChart({ kind, patient }: VitalTrendChartProps) {
  const tick = useTrendTick();
  const data = useMemo(() => createTrendData(patient, kind, tick), [kind, patient, tick]);
  const definition = trendDefinitions[kind];

  return (
    <ChartContainer
      aria-label={`${patient.bed} ${kind} trend`}
      className={cn("aspect-auto h-14 w-full", trendClasses[kind])}
      config={trendChartConfig}
      initialDimension={{ width: 600, height: 56 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 2, left: 0, right: 0, top: 2 }}>
        <CartesianGrid horizontal vertical stroke="var(--border)" strokeOpacity={0.55} />
        <YAxis
          allowDataOverflow
          axisLine={false}
          domain={definition.domain}
          tickLine={false}
          tickMargin={4}
          ticks={definition.ticks}
          width={28}
        />
        <Line
          dataKey="value"
          dot={false}
          isAnimationActive={false}
          stroke="var(--color-value)"
          strokeWidth={1.25}
          type="monotoneX"
        />
      </LineChart>
    </ChartContainer>
  );
}
