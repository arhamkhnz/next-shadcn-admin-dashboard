"use client";

import * as React from "react";

import type { Activity } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import { useActivityStore } from "@/app/(main)/dashboard/crm/_components/activities/use-activity-store";
import { useCompanyStore } from "@/app/(main)/dashboard/crm/companies/_components/companies-data/use-company-store";
import { useDealStore } from "@/app/(main)/dashboard/crm/deals/_components/deals-data/use-deal-store";
import { useLeadStore } from "@/app/(main)/dashboard/crm/leads/_components/leads-data/use-lead-store";

import {
  type DateRangeValue,
  getReportWindow,
  type ReportRangePreset,
  type ReportWindow,
  reportRangePresetValues,
} from "./report-data/report-dates";
import {
  activitiesScheduledInWindow,
  dealsClosedInWindow,
  filterActivitiesByAttributes,
  filterDealsByAttributes,
  filterLeadsByAttributes,
  leadsCreatedInWindow,
  type ReportAttributeFilters,
} from "./report-data/report-selectors";

export interface DrillDownRow {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string[];
  href?: string;
  badge?: { label: string; className: string };
}

export interface DrillDownState {
  title: string;
  description?: string;
  rows: DrillDownRow[];
}

interface ReportsContextValue {
  window: ReportWindow;
  preset: ReportRangePreset;
  setPreset: (preset: ReportRangePreset) => void;
  customRange: DateRangeValue | undefined;
  setCustomRange: (range: DateRangeValue | undefined) => void;
  ownerFilter: string;
  setOwnerFilter: (ownerId: string) => void;
  stageFilter: string;
  setStageFilter: (stage: string) => void;
  sourceFilter: string;
  setSourceFilter: (source: string) => void;
  companyFilter: string;
  setCompanyFilter: (companyId: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;

  filters: ReportAttributeFilters;
  companyNameById: ReadonlyMap<string, string>;

  openDeals: ReturnType<typeof filterDealsByAttributes>;
  allNonArchivedDeals: ReturnType<typeof filterDealsByAttributes>;
  closedDealsCurrent: ReturnType<typeof dealsClosedInWindow>;
  closedDealsPrevious: ReturnType<typeof dealsClosedInWindow>;
  activeLeads: ReturnType<typeof filterLeadsByAttributes>;
  archivedLeads: ReturnType<typeof filterLeadsByAttributes>;
  newLeadsCurrent: ReturnType<typeof leadsCreatedInWindow>;
  newLeadsPrevious: ReturnType<typeof leadsCreatedInWindow>;
  scopedActivitiesCurrent: Activity[];
  scopedActivitiesPrevious: Activity[];

  drillDown: DrillDownState | null;
  openDrillDown: (state: DrillDownState) => void;
  closeDrillDown: () => void;
}

const ReportsContext = React.createContext<ReportsContextValue | null>(null);

const DEFAULT_STATE = {
  ownerFilter: "all",
  stageFilter: "all",
  sourceFilter: "all",
  companyFilter: "all",
};

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const deals = useDealStore((state) => state.deals);
  const leads = useLeadStore((state) => state.leads);
  const activities = useActivityStore((state) => state.activities);
  const companies = useCompanyStore((state) => state.companies);

  const [preset, setPreset] = React.useState<ReportRangePreset>("last-30-days");
  const [customRange, setCustomRange] = React.useState<DateRangeValue | undefined>(undefined);
  const [ownerFilter, setOwnerFilter] = React.useState(DEFAULT_STATE.ownerFilter);
  const [stageFilter, setStageFilter] = React.useState(DEFAULT_STATE.stageFilter);
  const [sourceFilter, setSourceFilter] = React.useState(DEFAULT_STATE.sourceFilter);
  const [companyFilter, setCompanyFilter] = React.useState(DEFAULT_STATE.companyFilter);
  const [drillDown, setDrillDown] = React.useState<DrillDownState | null>(null);

  const window = React.useMemo(() => getReportWindow(preset, customRange), [preset, customRange]);

  const filters = React.useMemo<ReportAttributeFilters>(
    () => ({
      ownerId: ownerFilter === "all" ? null : ownerFilter,
      stage: stageFilter === "all" ? null : (stageFilter as ReportAttributeFilters["stage"]),
      source: sourceFilter === "all" ? null : (sourceFilter as ReportAttributeFilters["source"]),
      companyId: companyFilter === "all" ? null : companyFilter,
    }),
    [ownerFilter, stageFilter, sourceFilter, companyFilter],
  );

  const companyNameById = React.useMemo(
    () => new Map(companies.map((company) => [company.id, company.name])),
    [companies],
  );

  const openDeals = React.useMemo(() => filterDealsByAttributes(deals, filters, { openOnly: true }), [deals, filters]);
  const allNonArchivedDeals = React.useMemo(() => filterDealsByAttributes(deals, filters), [deals, filters]);

  const closedDealsCurrent = React.useMemo(
    () => dealsClosedInWindow(allNonArchivedDeals, window.current),
    [allNonArchivedDeals, window],
  );
  const closedDealsPrevious = React.useMemo(
    () => dealsClosedInWindow(allNonArchivedDeals, window.previous),
    [allNonArchivedDeals, window],
  );

  const activeLeads = React.useMemo(
    () => filterLeadsByAttributes(leads, { filters, companyNameById }),
    [leads, filters, companyNameById],
  );
  const archivedLeads = React.useMemo(
    () => filterLeadsByAttributes(leads, { filters, companyNameById }, { archived: true }),
    [leads, filters, companyNameById],
  );
  const newLeadsCurrent = React.useMemo(() => leadsCreatedInWindow(activeLeads, window.current), [activeLeads, window]);
  const newLeadsPrevious = React.useMemo(
    () => leadsCreatedInWindow(activeLeads, window.previous),
    [activeLeads, window],
  );

  const attributeFilteredActivities = React.useMemo(
    () => filterActivitiesByAttributes(activities, filters),
    [activities, filters],
  );
  const scopedActivitiesCurrent = React.useMemo(
    () => activitiesScheduledInWindow(attributeFilteredActivities, window.current),
    [attributeFilteredActivities, window],
  );
  const scopedActivitiesPrevious = React.useMemo(
    () => activitiesScheduledInWindow(attributeFilteredActivities, window.previous),
    [attributeFilteredActivities, window],
  );

  const hasActiveFilters =
    ownerFilter !== DEFAULT_STATE.ownerFilter ||
    stageFilter !== DEFAULT_STATE.stageFilter ||
    sourceFilter !== DEFAULT_STATE.sourceFilter ||
    companyFilter !== DEFAULT_STATE.companyFilter ||
    preset !== "last-30-days" ||
    customRange !== undefined;

  const resetFilters = React.useCallback(() => {
    setPreset("last-30-days");
    setCustomRange(undefined);
    setOwnerFilter(DEFAULT_STATE.ownerFilter);
    setStageFilter(DEFAULT_STATE.stageFilter);
    setSourceFilter(DEFAULT_STATE.sourceFilter);
    setCompanyFilter(DEFAULT_STATE.companyFilter);
  }, []);

  const openDrillDown = React.useCallback((state: DrillDownState) => {
    setDrillDown(state);
  }, []);

  const closeDrillDown = React.useCallback(() => {
    setDrillDown(null);
  }, []);

  const value = React.useMemo<ReportsContextValue>(
    () => ({
      window,
      preset,
      setPreset,
      customRange,
      setCustomRange,
      ownerFilter,
      setOwnerFilter,
      stageFilter,
      setStageFilter,
      sourceFilter,
      setSourceFilter,
      companyFilter,
      setCompanyFilter,
      resetFilters,
      hasActiveFilters,
      filters,
      companyNameById,
      openDeals,
      allNonArchivedDeals,
      closedDealsCurrent,
      closedDealsPrevious,
      activeLeads,
      archivedLeads,
      newLeadsCurrent,
      newLeadsPrevious,
      scopedActivitiesCurrent,
      scopedActivitiesPrevious,
      drillDown,
      openDrillDown,
      closeDrillDown,
    }),
    [
      window,
      preset,
      customRange,
      ownerFilter,
      stageFilter,
      sourceFilter,
      companyFilter,
      resetFilters,
      hasActiveFilters,
      filters,
      companyNameById,
      openDeals,
      allNonArchivedDeals,
      closedDealsCurrent,
      closedDealsPrevious,
      activeLeads,
      archivedLeads,
      newLeadsCurrent,
      newLeadsPrevious,
      scopedActivitiesCurrent,
      scopedActivitiesPrevious,
      drillDown,
      openDrillDown,
      closeDrillDown,
    ],
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports(): ReportsContextValue {
  const context = React.useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}

export { reportRangePresetValues };
