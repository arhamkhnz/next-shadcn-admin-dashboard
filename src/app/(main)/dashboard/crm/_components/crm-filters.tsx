"use client";

import * as React from "react";

import { resolveOwnerFilter } from "./crm-data/metrics";
import { type CrmPeriodWindow, type DateRangeValue, getPeriodWindow, type PeriodValue } from "./crm-data/period";

interface CrmFiltersContextValue {
  window: CrmPeriodWindow;
  period: PeriodValue;
  setPeriod: (value: PeriodValue) => void;
  customRange: DateRangeValue | undefined;
  setCustomRange: (value: DateRangeValue | undefined) => void;
  ownerFilter: string;
  setOwnerFilter: (value: string) => void;
  ownerId: string | null;
}

const CrmFiltersContext = React.createContext<CrmFiltersContextValue | null>(null);

export function CrmFiltersProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = React.useState<PeriodValue>("last-30-days");
  const [customRange, setCustomRange] = React.useState<DateRangeValue | undefined>(undefined);
  const [ownerFilter, setOwnerFilter] = React.useState("all");

  const window = React.useMemo(() => getPeriodWindow(period, customRange), [period, customRange]);
  const ownerId = React.useMemo(() => resolveOwnerFilter(ownerFilter), [ownerFilter]);

  const value = React.useMemo<CrmFiltersContextValue>(
    () => ({ window, period, setPeriod, customRange, setCustomRange, ownerFilter, setOwnerFilter, ownerId }),
    [window, period, customRange, ownerFilter, ownerId],
  );

  return <CrmFiltersContext.Provider value={value}>{children}</CrmFiltersContext.Provider>;
}

export function useCrmFilters(): CrmFiltersContextValue {
  const context = React.useContext(CrmFiltersContext);
  if (!context) {
    throw new Error("useCrmFilters must be used within a CrmFiltersProvider");
  }
  return context;
}
