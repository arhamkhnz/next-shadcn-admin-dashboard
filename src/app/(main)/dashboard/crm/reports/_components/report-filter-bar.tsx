"use client";

import { Building2, CalendarDays, FilterX, Handshake, Target, Users } from "lucide-react";

import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { salesOwners } from "../../_components/crm-data/sales-team";
import { useCompanyStore } from "../../companies/_components/companies-data/use-company-store";
import { stageOptions } from "../../deals/_components/deals-data/data";
import { sourceOptions as leadSourceOptions } from "../../leads/_components/leads-data/data";
import { reportRangePresetOptions } from "./report-data/report-dates";
import { useReports } from "./reports-context";

export function ReportFilterBar() {
  const {
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
    resetFilters,
    hasActiveFilters,
  } = useReports();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={preset} onValueChange={(value) => setPreset(value as typeof preset)}>
          <SelectTrigger size="sm" className="min-w-40" aria-label="Report date range">
            <CalendarDays data-icon="inline-start" />
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Date range</SelectLabel>
              {reportRangePresetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {preset === "custom" ? (
          <DateRangePicker
            value={customRange}
            onChange={(value) =>
              setCustomRange(value?.from && value.to ? { from: value.from, to: value.to } : undefined)
            }
          />
        ) : null}

        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger size="sm" className="min-w-36" aria-label="Filter by owner">
            <Users data-icon="inline-start" />
            <SelectValue placeholder="All owners" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Owner</SelectLabel>
              <SelectItem value="all">All owners</SelectItem>
              {salesOwners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger size="sm" className="min-w-36" aria-label="Filter by pipeline stage">
            <Handshake data-icon="inline-start" />
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Pipeline stage</SelectLabel>
              <SelectItem value="all">All stages</SelectItem>
              {stageOptions.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger size="sm" className="min-w-36" aria-label="Filter by lead source">
            <Target data-icon="inline-start" />
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Lead source</SelectLabel>
              <SelectItem value="all">All sources</SelectItem>
              {leadSourceOptions.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <CompanyFilterSelect />

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-muted-foreground"
            onClick={resetFilters}
            aria-label="Reset all report filters"
          >
            <FilterX className="size-3.5" />
            Reset filters
          </Button>
        ) : null}
      </div>
      <p className="text-muted-foreground text-sm">
        Active period: <span className="font-medium text-foreground">{window.label}</span>
        <span className="mx-1.5">·</span>
        Comparisons use the prior period ({window.comparisonLabel.replace("vs ", "")}).
      </p>
    </div>
  );
}

function CompanyFilterSelect() {
  const { companyFilter, setCompanyFilter } = useReports();
  const companies = useCompanyStore((state) => state.companies);

  return (
    <Select value={companyFilter} onValueChange={setCompanyFilter}>
      <SelectTrigger size="sm" className="min-w-40" aria-label="Filter by company">
        <Building2 data-icon="inline-start" />
        <SelectValue placeholder="All companies" />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          <SelectLabel>Company</SelectLabel>
          <SelectItem value="all">All companies</SelectItem>
          {[...companies]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
