"use client";

import * as React from "react";

import { Check, ChevronsUpDown, Download } from "lucide-react";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const riskViews = [
  {
    value: "risk-view",
    label: "Risk view",
    description: "Early warnings",
  },
  {
    value: "momentum",
    label: "Momentum",
    description: "Trend direction",
  },
  {
    value: "quality",
    label: "Quality",
    description: "Pipeline hygiene",
  },
];

const filterOptions = [
  { id: "enterprise", label: "Enterprise only" },
  { id: "stalled", label: "Stalled deals (>14 days)" },
  { id: "closed", label: "Closing date exceeded" },
  { id: "renewals", label: "Include renewals" },
];

export function AnalyticsOverview() {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <RiskViewSelect />
        <FiltersPopover />
      </div>
      <div className="flex gap-2">
        <DateRangePicker />
        <Button variant="secondary">
          <Download />
          Export
        </Button>
      </div>
    </div>
  );
}

function RiskViewSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("risk-view");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-50 justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            {riskViews.find((view) => view.value === value)?.label}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {riskViews.map((view) => (
                <CommandItem
                  key={view.value}
                  value={view.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{view.label}</span>
                    <span className="text-muted-foreground text-sm">{view.description}</span>
                  </div>
                  <Check className={cn("ml-auto", value === view.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FiltersPopover() {
  const [open, setOpen] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const handleFilterChange = (filterId: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, filterId]);
    } else {
      setSelectedFilters(selectedFilters.filter((id) => id !== filterId));
    }
  };

  const handleClear = () => {
    setSelectedFilters([]);
  };

  const activeFiltersLabels = selectedFilters
    .map((id) => filterOptions.find((f) => f.id === id)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" aria-expanded={open}>
            Filters
            <Badge variant="secondary">{selectedFilters.length}</Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              <span className="text-xs">Applies instantly</span>
            </div>
            <div className="space-y-3">
              {filterOptions.map((filter) => (
                <div key={filter.id} className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    id={filter.id}
                    checked={selectedFilters.includes(filter.id)}
                    onCheckedChange={(checked) => handleFilterChange(filter.id, checked as boolean)}
                  />
                  <Label htmlFor={filter.id} className="cursor-pointer font-normal text-sm">
                    {filter.label}
                  </Label>
                </div>
              ))}
            </div>
            <Separator />
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground text-sm">
        Showing:{" "}
        <span className="font-medium">
          {selectedFilters.length === 0
            ? "None"
            : selectedFilters.length === filterOptions.length
              ? "All"
              : activeFiltersLabels.join(" · ")}
        </span>
      </span>
    </div>
  );
}
