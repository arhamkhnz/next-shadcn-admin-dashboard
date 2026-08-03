import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { PatientRecord } from "./data";
import { type EcgLead, usePatientTrendSeries, usePatientWaveformSeries } from "./use-patient-vital-series";
import { type TrendKind, VitalTrendChart } from "./vital-trend-chart";
import { VitalWaveform, type WaveformKind } from "./vital-waveform";

interface PatientDetailProps {
  acknowledged: boolean;
  onAcknowledge: (id: string) => void;
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
      <VitalWaveform kind={kind} {...series} />
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
      <div className={cn("text-right font-medium text-4xl tabular-nums leading-none", color)}>
        {value} <span className="text-xs">{unit}</span>
      </div>
    </div>
  );
}

function TrendStrip({
  kind,
  label,
  patient,
  unit,
  value,
}: {
  kind: TrendKind;
  label: string;
  patient: PatientRecord;
  unit: string;
  value: number;
}) {
  const series = usePatientTrendSeries({ kind, patient });
  const color = cn(
    kind === "heart-rate" && "text-lime-500 dark:text-lime-400",
    kind === "spo2" && "text-cyan-500 dark:text-cyan-400",
    kind === "map" && "text-red-500 dark:text-red-400",
  );

  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-2 border-border border-b py-1">
      <div className="px-2">
        <div className={cn("font-medium text-sm", color)}>{label}</div>
        <div className="text-[10px] text-muted-foreground">{unit}</div>
      </div>
      <VitalTrendChart kind={kind} {...series} />
      <div className={cn("pr-2 text-right font-medium text-base tabular-nums", color)}>{value}</div>
    </div>
  );
}

export function PatientDetail({ acknowledged, onAcknowledge, patient }: PatientDetailProps) {
  const hasActiveAlarm = patient.status === "alarm" && !acknowledged;

  return (
    <div className="flex min-w-0 flex-col border-border lg:border-l">
      <div className="flex min-h-11 items-center gap-4 bg-muted/50 px-3">
        <div className="flex items-center gap-3 font-medium">
          <Badge className="rounded-none" variant="outline">
            {patient.bed}
          </Badge>
          <span className="text-lg">{patient.name}</span>
        </div>
        <div className="text-muted-foreground text-sm">
          {patient.age} {patient.sex} · {patient.diagnosis}
        </div>
      </div>
      <Separator />

      {patient.alarm && (
        <Alert
          className={cn(
            "min-h-9 rounded-none border-x-0 border-t-0 pr-32",
            hasActiveAlarm ? "border-amber-500 bg-amber-400 text-amber-950" : "border-border bg-muted text-foreground",
          )}
          variant="default"
        >
          <AlertTitle>{patient.alarm}</AlertTitle>
          {patient.alarmDuration && (
            <AlertDescription className={cn(hasActiveAlarm && "text-amber-950")}>
              Active for {patient.alarmDuration}
            </AlertDescription>
          )}
          <AlertAction>
            <Button
              className="rounded-none"
              disabled={acknowledged}
              onClick={() => onAcknowledge(patient.id)}
              size="sm"
              variant="secondary"
            >
              {acknowledged ? "Acknowledged" : "Acknowledge"}
            </Button>
          </AlertAction>
        </Alert>
      )}

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

      <Tabs className="gap-0" defaultValue="trends">
        <TabsList
          className="w-full justify-start gap-0 border-b p-0 *:h-full *:max-w-32 *:rounded-none *:border-0 *:border-border *:border-r *:after:-bottom-px!"
          variant="line"
        >
          <TabsTrigger value="real-time">Real time</TabsTrigger>
          <TabsTrigger value="events">Event review</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="disclosure">Full disclosure</TabsTrigger>
        </TabsList>

        <TabsContent className="m-0" value="real-time">
          <div className="flex min-h-44 items-center justify-center text-muted-foreground text-sm">
            Real-time bedside view selected above.
          </div>
        </TabsContent>
        <TabsContent className="m-0" value="events">
          <div className="grid min-h-44 divide-y divide-border">
            {patient.recentEvents.map((event) => (
              <div className="grid grid-cols-[4rem_1fr] items-center px-4 py-3" key={`${event.time}-${event.label}`}>
                <span className="text-muted-foreground tabular-nums">{event.time}</span>
                <span>{event.label}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent className="m-0" value="trends">
          <div className="grid min-h-44 xl:grid-cols-[minmax(0,1fr)_15.5rem]">
            <div className="min-w-0 border-border xl:border-r">
              <TrendStrip kind="heart-rate" label="HR" patient={patient} unit="bpm" value={patient.heartRate} />
              <TrendStrip kind="spo2" label="SpO₂" patient={patient} unit="%" value={patient.spo2} />
              <TrendStrip kind="map" label="MAP" patient={patient} unit="mmHg" value={patient.arterialMap} />
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] gap-2 py-1">
                <div />
                <div className="flex justify-between pl-7 text-[10px] text-muted-foreground tabular-nums">
                  <span>21:00</span>
                  <span>22:00</span>
                  <span>23:00</span>
                  <span>00:00</span>
                  <span>01:00</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="mb-3 font-medium text-sm">Recent events</div>
              <div className="flex flex-col gap-3">
                {patient.recentEvents.map((event) => (
                  <div className="grid grid-cols-[3.5rem_1fr] text-xs" key={`${event.time}-${event.label}`}>
                    <span className="text-muted-foreground tabular-nums">{event.time}</span>
                    <span>{event.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="m-0" value="disclosure">
          <div className="flex min-h-44 items-center justify-center text-muted-foreground text-sm">
            Full disclosure data is available for 24 hours.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
