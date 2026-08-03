import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

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

export function VitalWaveform({ ariaLabel, compact = false, data, domain, kind }: VitalWaveformProps) {
  return (
    <ChartContainer
      aria-label={ariaLabel}
      className={cn("aspect-auto w-full", compact ? "h-9" : "h-16", waveformClasses[kind])}
      config={waveformChartConfig}
      initialDimension={compact ? { width: 280, height: 36 } : { width: 800, height: 64 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
        <CartesianGrid horizontal vertical stroke="var(--border)" strokeOpacity={0.45} />
        <YAxis allowDataOverflow domain={domain} hide />
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
