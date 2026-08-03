import { cn } from "@/lib/utils";

import type { PatientRecord } from "./data";
import { type EcgLead, usePatientWaveformSeries } from "./use-patient-vital-series";
import { VitalWaveform, type WaveformKind } from "./vital-waveform";

interface PatientDetailProps {
  hasActiveAlarm: boolean;
  patient: PatientRecord;
}

interface TraceRowProps {
  calibration?: string;
  kind: WaveformKind;
  label: string;
  lead?: EcgLead;
  patient: PatientRecord;
}

function TraceRow({ calibration, kind, label, lead, patient }: TraceRowProps) {
  const series = usePatientWaveformSeries({ kind, lead, patient });

  return (
    <div className="grid min-h-16 grid-cols-[6.5rem_minmax(0,1fr)] border-border border-b">
      <div className="flex flex-col gap-0.5 px-3 py-2">
        <span
          className={cn(
            "font-medium text-sm",
            kind === "ecg" && "text-lime-500 dark:text-lime-400",
            kind === "pleth" && "text-cyan-500 dark:text-cyan-400",
            kind === "respiration" && "text-amber-500 dark:text-amber-400",
            kind === "arterial" && "text-red-500 dark:text-red-400",
          )}
        >
          {label}
        </span>
        {calibration && <span className="text-[10px] text-muted-foreground">{calibration}</span>}
      </div>
      <VitalWaveform kind={kind} showGrid {...series} />
    </div>
  );
}

function NumericVital({
  color,
  label,
  limits,
  unit,
  value,
}: {
  color: string;
  label: string;
  limits: string;
  unit: string;
  value: number | string;
}) {
  return (
    <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center border-border border-b px-3 py-1">
      <div>
        <div className={cn("font-medium text-sm", color)}>{label}</div>
        <div className="text-[10px] text-muted-foreground">{limits}</div>
      </div>
      <div
        className={cn("flex items-baseline gap-0.5 text-right font-medium text-4xl tabular-nums leading-none", color)}
      >
        {value} <span className="text-xs">{unit}</span>
      </div>
    </div>
  );
}

export function PatientDetail({ hasActiveAlarm, patient }: PatientDetailProps) {
  return (
    <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_15.5rem]">
      <div className="min-w-0 border-border after:hidden xl:grid xl:grid-rows-6 xl:border-r xl:after:block xl:after:border-border xl:after:border-b">
        <TraceRow calibration="25 mm/s · 10 mm/mV" kind="ecg" label="ECG II" lead="II" patient={patient} />
        <TraceRow calibration="25 mm/s · 10 mm/mV" kind="ecg" label="ECG V5" lead="V5" patient={patient} />
        <TraceRow kind="pleth" label="Pleth" patient={patient} />
        <TraceRow calibration="10 mm/mV" kind="respiration" label="Resp" patient={patient} />
        <TraceRow calibration="mmHg" kind="arterial" label="ART" patient={patient} />
      </div>

      <dl className="xl:grid xl:grid-rows-6">
        <NumericVital
          color={hasActiveAlarm ? "text-amber-500 dark:text-amber-400" : "text-lime-500 dark:text-lime-400"}
          label="HR"
          limits="50–100"
          unit="bpm"
          value={patient.heartRate}
        />
        <NumericVital
          color="text-cyan-500 dark:text-cyan-400"
          label="SpO₂"
          limits="92–100"
          unit="%"
          value={patient.spo2}
        />
        <NumericVital
          color="text-amber-500 dark:text-amber-400"
          label="RR"
          limits="8–30"
          unit="/min"
          value={patient.respirationRate}
        />
        <NumericVital
          color="text-foreground"
          label="NIBP"
          limits="90–160"
          unit={`(${patient.map})`}
          value={patient.nibp}
        />
        <NumericVital
          color="text-red-500 dark:text-red-400"
          label="ART"
          limits="80–140"
          unit={`(${patient.arterialMap})`}
          value={patient.arterialPressure}
        />
        <NumericVital color="text-foreground" label="Temp" limits="36.0–38.0" unit="°C" value={patient.temperature} />
      </dl>
    </div>
  );
}
