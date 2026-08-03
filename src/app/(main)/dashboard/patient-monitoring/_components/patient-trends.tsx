import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { getInnerVerticalGridCoordinates } from "./chart-grid";
import type { PatientRecord } from "./data";
import { type TrendKind, type TrendPoint, usePatientTrendSeries } from "./use-patient-vital-series";

interface PatientTrendsProps {
  patient: PatientRecord;
}

interface VitalTrendChartProps {
  ariaLabel: string;
  data: TrendPoint[];
  domain: [number, number];
  kind: TrendKind;
  ticks: number[];
}

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

function VitalTrendChart({ ariaLabel, data, domain, kind, ticks }: VitalTrendChartProps) {
  return (
    <ChartContainer
      aria-label={ariaLabel}
      className={cn("aspect-auto h-full min-h-12 w-full border-current border-r", trendClasses[kind])}
      config={trendChartConfig}
      initialDimension={{ width: 600, height: 48 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
        <CartesianGrid
          horizontal
          horizontalValues={ticks.slice(1, -1)}
          stroke="var(--border)"
          strokeOpacity={0.65}
          strokeWidth={0.75}
          vertical
          verticalCoordinatesGenerator={getInnerVerticalGridCoordinates}
        />
        <YAxis allowDataOverflow domain={domain} hide width={0} />
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
  const scale = [...series.ticks].reverse();
  const color = cn(
    kind === "heart-rate" && "text-lime-500 dark:text-lime-400",
    kind === "spo2" && "text-cyan-500 dark:text-cyan-400",
    kind === "map" && "text-red-500 dark:text-red-400",
  );

  return (
    <div className="grid min-h-12 grid-cols-[4rem_2rem_minmax(0,1fr)_2.5rem] items-stretch gap-1 border-border border-b">
      <div className="flex flex-col justify-start p-2">
        <div className={cn("font-medium text-xs", color)}>{label}</div>
        <div className="text-[10px] text-muted-foreground">{unit}</div>
      </div>
      <div className="flex h-full min-h-12 flex-col justify-between text-right text-[10px] text-muted-foreground tabular-nums">
        {scale.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <VitalTrendChart
        ariaLabel={series.ariaLabel}
        data={series.data}
        domain={series.domain}
        kind={kind}
        ticks={series.ticks}
      />
      <div className={cn("self-end pr-1 text-right font-medium text-sm tabular-nums", color)}>{value}</div>
    </div>
  );
}

export function PatientTrends({ patient }: PatientTrendsProps) {
  return (
    <div className="grid h-full min-h-36 xl:grid-cols-[minmax(0,1fr)_13.5rem]">
      <div className="min-w-0 border-border xl:border-r">
        <TrendStrip kind="heart-rate" label="HR" patient={patient} unit="bpm" value={patient.heartRate} />
        <TrendStrip kind="spo2" label="SpO₂" patient={patient} unit="%" value={patient.spo2} />
        <TrendStrip kind="map" label="MAP" patient={patient} unit="mmHg" value={patient.arterialMap} />
        <div className="grid grid-cols-[4rem_2rem_minmax(0,1fr)_2.5rem] gap-1 py-0.5">
          <div className="col-span-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
            <span>21:00</span>
            <span>22:00</span>
            <span>23:00</span>
            <span>00:00</span>
            <span>01:00</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="mb-2 font-medium text-xs">Recent events</div>
        <div className="flex flex-col gap-2">
          {patient.recentEvents.map((event) => (
            <div className="grid grid-cols-[3rem_1fr] text-[11px]" key={`${event.time}-${event.label}`}>
              <span className="text-muted-foreground tabular-nums">{event.time}</span>
              <span>{event.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
