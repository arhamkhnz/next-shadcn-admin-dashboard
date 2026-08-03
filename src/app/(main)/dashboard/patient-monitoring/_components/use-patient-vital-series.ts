import { useMemo } from "react";

import type { CardiacRhythm, PatientRecord } from "./data";
import {
  COMPACT_WAVEFORM_TICK_INTERVAL_MS,
  DETAIL_WAVEFORM_TICK_INTERVAL_MS,
  useTrendTick,
  useWaveformTick,
} from "./use-realtime-tick";
import type { SignalPoint, WaveformKind } from "./vital-waveform";
import {
  arterialTemplate,
  ecgTemplates,
  normalizedTrendTemplate,
  plethTemplate,
  respirationTemplate,
} from "./waveform-data";

export type EcgLead = "II" | "V5";
export type TrendKind = "heart-rate" | "map" | "spo2";

export interface TrendPoint {
  value: number;
}

interface TrendDefinition {
  baseline: "arterialMap" | "heartRate" | "spo2";
  domain: [number, number];
  getVariation: (patient: PatientRecord) => number;
  phaseOffset: number;
  ticks: number[];
}

interface PatientTrendSeriesOptions {
  kind: TrendKind;
  patient: PatientRecord;
}

interface PatientWaveformSeriesOptions {
  compact?: boolean;
  kind: WaveformKind;
  lead?: EcgLead;
  patient: PatientRecord;
}

const SAMPLE_STEP_SECONDS = 0.025;
const TREND_POINT_COUNT = 90;

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

const trendDefinitions = {
  "heart-rate": {
    baseline: "heartRate",
    domain: [50, 150],
    getVariation: (patient) => heartRateVariations[patient.signalProfile.rhythm],
    phaseOffset: 0,
    ticks: [50, 100, 150],
  },
  map: {
    baseline: "arterialMap",
    domain: [50, 150],
    getVariation: () => 4,
    phaseOffset: 10,
    ticks: [50, 100, 150],
  },
  spo2: {
    baseline: "spo2",
    domain: [80, 100],
    getVariation: () => 0.65,
    phaseOffset: 20,
    ticks: [80, 90, 100],
  },
} satisfies Record<TrendKind, TrendDefinition>;

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
    return repeatTemplate(respirationTemplate, time * (patient.respirationRate / 60) + phase);
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
    return { value: getSignalValue(patient, kind, time, lead) };
  });
}

function getTrendValue(patient: PatientRecord, definition: TrendDefinition, sample: number) {
  const patientOffset = Math.round(patient.signalProfile.phase * normalizedTrendTemplate.length);
  const position = sample + patientOffset + definition.phaseOffset;
  const index =
    ((position % normalizedTrendTemplate.length) + normalizedTrendTemplate.length) % normalizedTrendTemplate.length;
  const templateValue = normalizedTrendTemplate[index] ?? 0;
  const value = patient[definition.baseline] + templateValue * definition.getVariation(patient);
  const [minimum, maximum] = definition.domain;

  return Math.min(Math.max(value, minimum), maximum);
}

function createTrendWindow(patient: PatientRecord, definition: TrendDefinition, endSample: number) {
  return Array.from({ length: TREND_POINT_COUNT }, (_, index): TrendPoint => {
    const sample = endSample - (TREND_POINT_COUNT - index - 1);
    return { value: getTrendValue(patient, definition, sample) };
  });
}

export function usePatientTrendSeries({ kind, patient }: PatientTrendSeriesOptions) {
  const tick = useTrendTick();
  const definition = trendDefinitions[kind];
  const data = useMemo(() => createTrendWindow(patient, definition, tick), [definition, patient, tick]);

  return {
    ariaLabel: `${patient.bed} ${kind} trend`,
    data,
    domain: definition.domain,
    ticks: definition.ticks,
  };
}

export function usePatientWaveformSeries({
  compact = false,
  kind,
  lead = "II",
  patient,
}: PatientWaveformSeriesOptions) {
  const tick = useWaveformTick(compact);
  const tickInterval = compact ? COMPACT_WAVEFORM_TICK_INTERVAL_MS : DETAIL_WAVEFORM_TICK_INTERVAL_MS;
  const sampleCount = compact ? 160 : 400;
  const data = useMemo(
    () => createSignalWindow(patient, kind, lead, sampleCount, (tick * tickInterval) / 1000),
    [kind, lead, patient, sampleCount, tick, tickInterval],
  );

  return {
    ariaLabel: `${patient.bed} ${lead} ${kind} waveform`,
    data,
    domain: getSignalDomain(patient, kind),
  };
}
