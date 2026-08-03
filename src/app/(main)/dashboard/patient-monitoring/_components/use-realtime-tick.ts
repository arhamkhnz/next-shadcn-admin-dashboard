import { useSyncExternalStore } from "react";

import { createRealtimeTicker, MONITORING_SPEED } from "./realtime-utils";

export const COMPACT_WAVEFORM_TICK_INTERVAL_MS = 100;
export const DETAIL_WAVEFORM_TICK_INTERVAL_MS = 100;

const getInitialTick = () => 0;
const monitoringSpeed = Math.max(MONITORING_SPEED, 0);
const compactWaveformTicker = createRealtimeTicker(COMPACT_WAVEFORM_TICK_INTERVAL_MS);
const detailWaveformTicker = createRealtimeTicker(DETAIL_WAVEFORM_TICK_INTERVAL_MS);
const trendTicker = createRealtimeTicker(1000);

export function useWaveformTick(compact: boolean) {
  const ticker = compact ? compactWaveformTicker : detailWaveformTicker;
  return useSyncExternalStore(ticker.subscribe, ticker.getSnapshot, getInitialTick) * monitoringSpeed;
}

export function useTrendTick() {
  return Math.floor(
    useSyncExternalStore(trendTicker.subscribe, trendTicker.getSnapshot, getInitialTick) * monitoringSpeed,
  );
}
