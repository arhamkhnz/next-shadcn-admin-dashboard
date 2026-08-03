import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { getVerticalGridCoordinates } from "./chart-grid";

export type WaveformKind = "arterial" | "ecg" | "pleth" | "respiration";

export interface SignalPoint {
  value: number;
}

interface VitalWaveformProps {
  ariaLabel: string;
  compact?: boolean;
  data: SignalPoint[];
  domain: [number, number];
  kind: WaveformKind;
  showGrid: boolean;
}

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

export function VitalWaveform({ ariaLabel, compact = false, data, domain, kind, showGrid }: VitalWaveformProps) {
  const horizontalCenter = (domain[0] + domain[1]) / 2;

  return (
    <ChartContainer
      aria-label={ariaLabel}
      className={cn("aspect-auto w-full", compact ? "h-9" : "h-full min-h-16", waveformClasses[kind])}
      config={waveformChartConfig}
      initialDimension={compact ? { width: 280, height: 36 } : { width: 800, height: 64 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
        {showGrid && (
          <CartesianGrid
            horizontal
            horizontalValues={[horizontalCenter]}
            stroke="var(--border)"
            strokeOpacity={0.65}
            strokeWidth={0.75}
            vertical
            verticalCoordinatesGenerator={getVerticalGridCoordinates}
          />
        )}
        <YAxis allowDataOverflow domain={domain} hide width={0} />
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
