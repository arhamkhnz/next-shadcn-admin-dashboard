"use client";

import { CalendarDays, Users } from "lucide-react";

import { DateRangePicker } from "@/components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { currentSalesOwnerId, getOwnerName, salesOwners } from "./crm-data/sales-team";
import { useCrmFilters } from "./crm-filters";

const periodOptions = [
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "last-6-months", label: "Last 6 months" },
  { value: "last-12-months", label: "Last 12 months" },
  { value: "custom", label: "Custom range" },
] as const;

export function CrmFilterBar() {
  const { period, setPeriod, customRange, setCustomRange, ownerFilter, setOwnerFilter } = useCrmFilters();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={ownerFilter} onValueChange={setOwnerFilter}>
        <SelectTrigger size="sm" className="min-w-40">
          <Users data-icon="inline-start" />
          <SelectValue placeholder="All owners" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Sales owner</SelectLabel>
            <SelectItem value="all">All owners</SelectItem>
            <SelectItem value="me">My deals ({getOwnerName(currentSalesOwnerId)})</SelectItem>
          </SelectGroup>
          <SelectGroup>
            {salesOwners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger size="sm" className="min-w-44">
          <CalendarDays data-icon="inline-start" />
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {period === "custom" ? (
        <DateRangePicker
          value={customRange}
          onChange={(value) => setCustomRange(value?.from && value.to ? { from: value.from, to: value.to } : undefined)}
        />
      ) : null}
    </div>
  );
}
