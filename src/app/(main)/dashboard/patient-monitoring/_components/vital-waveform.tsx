import { useMemo } from "react";

import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import type { PatientRecord } from "./data";
import {
  COMPACT_WAVEFORM_TICK_INTERVAL_MS,
  DETAIL_WAVEFORM_TICK_INTERVAL_MS,
  useWaveformTick,
} from "./use-realtime-tick";
import { arterialTemplate, ecgTemplates, plethTemplate, respirationTemplate } from "./waveform-data";

export type WaveformKind = "arterial" | "ecg" | "pleth" | "respiration";
export type EcgLead = "II" | "V5";

interface VitalWaveformProps {
  compact?: boolean;
  kind: WaveformKind;
  lead?: EcgLead;
  patient: PatientRecord;
}

interface SignalPoint {
  sample: number;
  value: number;
}

const SAMPLE_STEP_SECONDS = 0.025;

const waveformChartConfig = {
  signal: {
    label: "Signal",
    color: "currentColor",
  },
} satisfies ChartConfig;

const waveformClasses: Record<WaveformKind, string> = {
  arterial: "text-red-500 dark:text-red-400",
  ecg: "text-lime-500 dark:text-lime-400",
  pleth: "text-cyan-500 dark:text-cyan-400",
  respiration: "text-amber-500 dark:text-amber-400",
};

function repeatTemplate(samples: readonly number[], cyclePosition: number, cyclesPerTemplate = 1) {
  const positionInTemplate = ((cyclePosition % cyclesPerTemplate) + cyclesPerTemplate) % cyclesPerTemplate;
  const exactIndex = (positionInTemplate / cyclesPerTemplate) * samples.length;
  const currentIndex = Math.floor(exactIndex) % samples.length;
  const nextIndex = (currentIndex + 1) % samples.length;
  const progress = exactIndex - Math.floor(exactIndex);
  const currentValue = samples[currentIndex] ?? 0;
  const nextValue = samples[nextIndex] ?? currentValue;

  return currentValue + (nextValue - currentValue) * progress;
}

function getSignalValue(patient: PatientRecord, kind: WaveformKind, time: number, lead: EcgLead) {
  const { amplitude, phase, rhythm } = patient.signalProfile;

  if (kind === "respiration") {
    const breathPosition = time * (patient.respirationRate / 60) + phase;
    return repeatTemplate(respirationTemplate, breathPosition);
  }

  const beatPosition = time * (patient.heartRate / 60) + phase;

  if (kind === "pleth") {
    const perfusionScale = 0.72 + (patient.spo2 - 92) * 0.035;
    return repeatTemplate(plethTemplate, beatPosition) * perfusionScale - 0.08;
  }

  if (kind === "arterial") {
    const [systolic = 120, diastolic = 70] = patient.arterialPressure.split("/").map(Number);
    return diastolic + repeatTemplate(arterialTemplate, beatPosition) * (systolic - diastolic);
  }

  const template = ecgTemplates[rhythm];
  const leadScale = lead === "V5" ? 1.08 : 1;
  return repeatTemplate(template.samples, beatPosition, template.beats) * amplitude * leadScale;
}

function getSignalDomain(patient: PatientRecord, kind: WaveformKind): [number, number] {
  if (kind === "arterial") {
    const [systolic = 120, diastolic = 70] = patient.arterialPressure.split("/").map(Number);
    return [diastolic - 8, systolic + 8];
  }

  if (kind === "pleth") {
    return [-0.2, 1.15];
  }

  if (kind === "respiration") {
    return [-1.15, 1.15];
  }

  return [-1.35, 1.35];
}

function createSignalWindow(
  patient: PatientRecord,
  kind: WaveformKind,
  lead: EcgLead,
  sampleCount: number,
  endTime: number,
) {
  return Array.from({ length: sampleCount }, (_, index): SignalPoint => {
    const time = endTime - (sampleCount - index - 1) * SAMPLE_STEP_SECONDS;

    return {
      sample: index,
      value: getSignalValue(patient, kind, time, lead),
    };
  });
}

export function VitalWaveform({ patient, kind, lead = "II", compact = false }: VitalWaveformProps) {
  const tick = useWaveformTick(compact);
  const tickInterval = compact ? COMPACT_WAVEFORM_TICK_INTERVAL_MS : DETAIL_WAVEFORM_TICK_INTERVAL_MS;
  const sampleCount = compact ? 160 : 400;
  const data = useMemo(
    () => createSignalWindow(patient, kind, lead, sampleCount, (tick * tickInterval) / 1000),
    [kind, lead, patient, sampleCount, tick, tickInterval],
  );

  return (
    <ChartContainer
      aria-label={`${patient.bed} ${lead} ${kind} waveform`}
      className={cn("aspect-auto w-full", compact ? "h-9" : "h-16", waveformClasses[kind])}
      config={waveformChartConfig}
      initialDimension={compact ? { width: 280, height: 36 } : { width: 800, height: 64 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
        <CartesianGrid horizontal vertical stroke="var(--border)" strokeOpacity={0.45} />
        <YAxis allowDataOverflow domain={getSignalDomain(patient, kind)} hide />
        <Line
          dataKey="value"
          dot={false}
          isAnimationActive={false}
          stroke="var(--color-signal)"
          strokeWidth={compact ? 1.25 : 1.5}
          type={kind === "ecg" ? "linear" : "monotoneX"}
        />
      </LineChart>
    </ChartContainer>
  );
}
