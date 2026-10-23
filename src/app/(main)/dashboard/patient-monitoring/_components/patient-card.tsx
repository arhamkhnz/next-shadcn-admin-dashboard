import { cn } from "cn";

import { Badge } from "@/components/ui/badge";

import type { PatientRecord } from "./data";
import { usePatientWaveformSeries } from "./use-patient-vital-series";
import { VitalWaveform } from "./vital-waveform";

interface PatientCardProps {
  active: boolean;
  acknowledged: boolean;
  onSelect: (id: string) => void;
  patient: PatientRecord;
}

export function PatientCard({ active, acknowledged, onSelect, patient }: PatientCardProps) {
  const hasActiveAlarm = patient.status === "alarm" && !acknowledged;
  const waveformSeries = usePatientWaveformSeries({ compact: true, kind: "ecg", patient });

  return (
    <button
      aria-label={`Open ${patient.bed}, ${patient.name}`}
      aria-pressed={active}
      className={cn(
        "bg-card text-card-foreground flex min-h-36 min-w-0 flex-col p-2 text-left",
        "hover:bg-muted/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        active && "ring-primary ring-2 ring-inset",
      )}
      onClick={() => onSelect(patient.id)}
      type="button"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <div className="truncate text-sm font-medium">
          <span className={cn(hasActiveAlarm && "text-amber-500 dark:text-amber-400")}>{patient.bed}</span>{" "}
          {patient.name}
        </div>
        {hasActiveAlarm && (
          <Badge
            className="h-auto shrink-0 rounded-none border-amber-500 text-[10px] text-amber-700 dark:border-amber-400 dark:text-amber-300"
            variant="outline"
          >
            HR HIGH {patient.heartRate}
          </Badge>
        )}
      </div>

      <div className="flex w-full flex-1 items-center">
        <VitalWaveform compact kind="ecg" showGrid={false} {...waveformSeries} />
      </div>

      <dl className="divide-border mt-auto grid grid-cols-2 divide-x tabular-nums">
        <div className="pr-2">
          <dt className="text-xs text-lime-500 dark:text-lime-400">HR</dt>
          <dd
            className={cn(
              "text-right text-3xl leading-none font-medium text-lime-500 dark:text-lime-400",
              hasActiveAlarm && "text-amber-500 dark:text-amber-400",
            )}
          >
            {patient.heartRate}
          </dd>
        </div>
        <div className="pl-2">
          <dt className="text-xs text-cyan-500 dark:text-cyan-400">SpO₂</dt>
          <dd className="text-right text-3xl leading-none font-medium text-cyan-500 dark:text-cyan-400">
            {patient.spo2}
          </dd>
        </div>
      </dl>
    </button>
  );
}
