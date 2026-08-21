"use client";

import { format } from "date-fns";
import { FilterX } from "lucide-react";

import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { reportToday } from "../../reports/_components/report-data/report-dates";
import { currentSalesOwnerId, salesOwners } from "../crm-data/sales-team";
import {
  OVERVIEW_OWNER_ALL,
  type OverviewRangePreset,
  overviewRangePresetOptions,
  overviewRangePresetValues,
  useOverviewFilters,
} from "./overview-filters";
import { QuickCreateMenu } from "./quick-create-menu";

export function OverviewHeader() {
  const {
    preset,
    setPreset,
    customRange,
    setCustomRange,
    ownerFilter,
    setOwnerFilter,
    windowLabel,
    hasActiveFilters,
    resetFilters,
  } = useOverviewFilters();

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">CRM Overview</h1>
          <p className="text-muted-foreground text-sm">
            Today is {format(reportToday, "EEEE, MMMM d, yyyy")} · Showing {windowLabel}
          </p>
        </div>
        <QuickCreateMenu />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={preset}
          onValueChange={(value) => setPreset(value as OverviewRangePreset)}
          aria-label="Filter by date range"
        >
          <SelectTrigger className="w-[170px]" aria-label="Date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {overviewRangePresetValues.map((value) => (
              <SelectItem key={value} value={value}>
                {overviewRangePresetOptions.find((option) => option.value === value)?.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {preset === "custom" ? (
          <DateRangePicker
            value={customRange ? { from: customRange.from, to: customRange.to } : undefined}
            onChange={(range) =>
              setCustomRange(range?.from && range.to ? { from: range.from, to: range.to } : undefined)
            }
          />
        ) : null}

        <Select value={ownerFilter} onValueChange={setOwnerFilter} aria-label="Filter by owner">
          <SelectTrigger className="w-[170px]" aria-label="Owner">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={OVERVIEW_OWNER_ALL}>All owners</SelectItem>
            {salesOwners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.id === currentSalesOwnerId ? `${owner.name} (me)` : owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={resetFilters} data-icon="inline-start">
            <FilterX data-icon="inline-start" />
            Reset filters
          </Button>
        ) : null}
      </div>
    </header>
  );
}
