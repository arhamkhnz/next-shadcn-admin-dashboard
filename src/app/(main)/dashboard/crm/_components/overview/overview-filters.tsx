"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { format } from "date-fns";

import type { Company } from "../../companies/_components/companies-data/schema";
import { useCompanyStore } from "../../companies/_components/companies-data/use-company-store";
import type { Contact } from "../../contacts/_components/contacts-data/schema";
import { useContactStore } from "../../contacts/_components/contacts-data/use-contact-store";
import type { Deal } from "../../deals/_components/deals-data/schema";
import { useDealStore } from "../../deals/_components/deals-data/use-deal-store";
import type { Lead } from "../../leads/_components/leads-data/schema";
import { useLeadStore } from "../../leads/_components/leads-data/use-lead-store";
import {
  type DateRangeValue,
  getReportWindow,
  type ReportWindow,
  reportToday,
} from "../../reports/_components/report-data/report-dates";
import {
  computeSalesOverviewMetrics,
  dealsClosedInWindow,
  filterActivitiesByAttributes,
  filterDealsByAttributes,
  filterLeadsByAttributes,
  type ReportAttributeFilters,
} from "../../reports/_components/report-data/report-selectors";
import type { Activity } from "../activities/activity-schema";
import { useActivityStore } from "../activities/use-activity-store";
import { salesOwners } from "../crm-data/sales-team";
import type { RelatedRecordNames } from "./overview-selectors";

export const OVERVIEW_OWNER_ALL = "all";

export const overviewRangePresetValues = [
  "today",
  "last-7-days",
  "last-30-days",
  "this-month",
  "this-quarter",
  "custom",
] as const;

export type OverviewRangePreset = (typeof overviewRangePresetValues)[number];

export const overviewRangePresetOptions: readonly { value: OverviewRangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "this-month", label: "This month" },
  { value: "this-quarter", label: "This quarter" },
  { value: "custom", label: "Custom range" },
];

const DEFAULT_PRESET: OverviewRangePreset = "this-month";

interface OverviewFiltersContextValue {
  preset: OverviewRangePreset;
  setPreset: (preset: OverviewRangePreset) => void;
  customRange: DateRangeValue | undefined;
  setCustomRange: (range: DateRangeValue | undefined) => void;
  ownerFilter: string;
  setOwnerFilter: (owner: string) => void;
  ownerId: string | null;
  window: ReportWindow;
  windowLabel: string;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  activeLeads: Lead[];
  openDeals: Deal[];
  closedDealsCurrent: Deal[];
  scopedActivities: Activity[];
  contacts: Contact[];
  companies: Company[];
  currentMetrics: ReturnType<typeof computeSalesOverviewMetrics>;
  previousMetrics: ReturnType<typeof computeSalesOverviewMetrics>;
  names: RelatedRecordNames;
}

const OverviewFiltersContext = createContext<OverviewFiltersContextValue | null>(null);

function matchesOwner(ownerId: string | null | undefined, filter: string | null): boolean {
  if (filter === null) return true;
  return ownerId === filter;
}

export function OverviewFiltersProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<OverviewRangePreset>(DEFAULT_PRESET);
  const [customRange, setCustomRange] = useState<DateRangeValue | undefined>(undefined);
  const [ownerFilter, setOwnerFilter] = useState<string>(OVERVIEW_OWNER_ALL);

  const leads = useLeadStore((state) => state.leads);
  const deals = useDealStore((state) => state.deals);
  const activities = useActivityStore((state) => state.activities);
  const companies = useCompanyStore((state) => state.companies);
  const contacts = useContactStore((state) => state.contacts);

  const ownerId = ownerFilter === OVERVIEW_OWNER_ALL ? null : ownerFilter;

  const window = useMemo<ReportWindow>(() => {
    if (preset === "today") {
      return getReportWindow("custom", { from: reportToday, to: reportToday });
    }
    if (preset === "custom") {
      return getReportWindow("custom", customRange ?? undefined);
    }
    return getReportWindow(preset);
  }, [preset, customRange]);

  const companyNameById = useMemo(() => new Map(companies.map((company) => [company.id, company.name])), [companies]);
  const contactNameById = useMemo(() => new Map(contacts.map((contact) => [contact.id, contact.name])), [contacts]);
  const leadNameById = useMemo(() => new Map(leads.map((lead) => [lead.id, lead.name])), [leads]);
  const dealNameById = useMemo(() => new Map(deals.map((deal) => [deal.id, deal.name])), [deals]);

  const names = useMemo<RelatedRecordNames>(
    () => ({
      companyNameById,
      contactNameById,
      leadNameById,
      dealNameById,
    }),
    [companyNameById, contactNameById, leadNameById, dealNameById],
  );

  const scoped = useMemo(() => {
    const attributeFilters: ReportAttributeFilters = { ownerId, stage: null, source: null, companyId: null };

    const scopedCompanies = companies.filter(
      (company) => !company.archivedAt && matchesOwner(company.ownerId, ownerId),
    );
    const scopedContacts = contacts.filter((contact) => !contact.archivedAt && matchesOwner(contact.ownerId, ownerId));
    const scopedDeals = filterDealsByAttributes(deals, attributeFilters);
    const openDeals = filterDealsByAttributes(deals, attributeFilters, { openOnly: true });
    const closedDealsCurrent = dealsClosedInWindow(scopedDeals, window.current);
    const closedDealsPrevious = dealsClosedInWindow(scopedDeals, window.previous);
    const activeLeads = filterLeadsByAttributes(leads, { filters: attributeFilters, companyNameById });
    const scopedActivities = filterActivitiesByAttributes(activities, attributeFilters);

    return {
      scopedCompanies,
      scopedContacts,
      openDeals,
      closedDealsCurrent,
      closedDealsPrevious,
      activeLeads,
      scopedActivities,
      currentMetrics: computeSalesOverviewMetrics(openDeals, closedDealsCurrent),
      previousMetrics: computeSalesOverviewMetrics([], closedDealsPrevious),
    };
  }, [activities, companies, contacts, deals, leads, ownerId, window, companyNameById]);

  const hasActiveFilters = preset !== DEFAULT_PRESET || ownerFilter !== OVERVIEW_OWNER_ALL || Boolean(customRange);

  const resetFilters = useCallback(() => {
    setPreset(DEFAULT_PRESET);
    setCustomRange(undefined);
    setOwnerFilter(OVERVIEW_OWNER_ALL);
  }, []);

  const windowLabel = `${format(window.current.start, "MMM d")} – ${format(window.current.end, "MMM d")}`;

  const value = useMemo<OverviewFiltersContextValue>(
    () => ({
      preset,
      setPreset,
      customRange,
      setCustomRange,
      ownerFilter,
      setOwnerFilter,
      ownerId,
      window,
      windowLabel,
      resetFilters,
      hasActiveFilters,
      contacts: scoped.scopedContacts,
      companies: scoped.scopedCompanies,
      activeLeads: scoped.activeLeads,
      openDeals: scoped.openDeals,
      closedDealsCurrent: scoped.closedDealsCurrent,
      scopedActivities: scoped.scopedActivities,
      currentMetrics: scoped.currentMetrics,
      previousMetrics: scoped.previousMetrics,
      names,
    }),
    [preset, customRange, ownerFilter, ownerId, window, windowLabel, hasActiveFilters, names, scoped, resetFilters],
  );

  return <OverviewFiltersContext.Provider value={value}>{children}</OverviewFiltersContext.Provider>;
}

export function useOverviewFilters(): OverviewFiltersContextValue {
  const context = useContext(OverviewFiltersContext);
  if (!context) {
    throw new Error("useOverviewFilters must be used within an OverviewFiltersProvider");
  }
  return context;
}

export { salesOwners as overviewOwnerOptions };
