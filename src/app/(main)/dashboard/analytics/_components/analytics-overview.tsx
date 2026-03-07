"use client";

import * as React from "react";

import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { Check, ChevronsUpDown, Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Area, ComposedChart, XAxis, YAxis } from "recharts";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type RiskView = "risk-view" | "momentum" | "quality";
type FilterToggleKey = "enterpriseOnly" | "stalledOnly" | "overdueOnly" | "includeRenewals";

const FILTER_OPTIONS: Array<{ key: FilterToggleKey; label: string; summaryLabel: string }> = [
  { key: "enterpriseOnly", label: "Enterprise only", summaryLabel: "Enterprise" },
  { key: "stalledOnly", label: "Stalled deals (>14 days)", summaryLabel: "Stalled" },
  { key: "overdueOnly", label: "Closing date exceeded", summaryLabel: "Overdue" },
  { key: "includeRenewals", label: "Include renewals", summaryLabel: "Renewals" },
];

const riskViews: Array<{
  value: RiskView;
  label: string;
  description: string;
}> = [
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

const RISK_SUMMARY_METRICS = [
  {
    key: "stalled",
    label: "Stalled Deals",
    value: "8",
    comparatorLabel: "vs previous period",
  },
  {
    key: "risk",
    label: "Revenue at Risk",
    value: "$1,151,000",
    comparatorLabel: "vs previous period",
  },
  {
    key: "win-rate",
    label: "Win Rate Trend",
    value: "+8.3pp",
    comparatorLabel: "vs previous period",
  },
  {
    key: "cycle",
    label: "Sales Cycle Drift",
    value: "+2.3 days",
    comparatorLabel: "vs previous period",
  },
] as const;

export function AnalyticsOverview() {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>(() => {
    const to = startOfDay(new Date());
    return { from: subDays(to, 29), to };
  });
  const [selectedFilters, setSelectedFilters] = React.useState<FilterToggleKey[]>(["includeRenewals"]);

  const revenueSeries = React.useMemo(
    () => buildRevenueChartData(dateRange.from, dateRange.to),
    [dateRange.from, dateRange.to],
  );

  const handleFilterToggle = (key: FilterToggleKey, checked: boolean) => {
    setSelectedFilters((prev) => {
      if (checked) {
        return prev.includes(key) ? prev : [...prev, key];
      }
      return prev.filter((item) => item !== key);
    });
  };

  const handleDateRangeChange = (value: DateRange | undefined) => {
    if (!value?.from || !value?.to) {
      return;
    }
    setDateRange({ from: value.from, to: value.to });
  };
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <RiskViewSelect />
          <FiltersPopover selectedFilters={selectedFilters} onToggle={handleFilterToggle} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <Button variant="secondary">
            <Download />
            Export
          </Button>
        </div>
      </div>

      <SummaryRow revenueSeries={revenueSeries} />
    </div>
  );
}

function buildRevenueChartData(from: Date, to: Date) {
  const days = eachDayOfInterval({ start: from, end: to });
  const minRevenue = 22_000;
  const maxRevenue = 32_000;
  let currentRevenue = 27_500;

  return days.map((day) => {
    const nextRevenue = currentRevenue + Math.round((Math.random() - 0.45) * 4_000);
    currentRevenue = Math.max(minRevenue, Math.min(maxRevenue, nextRevenue));

    return {
      day: format(day, "MMM d"),
      revenue: currentRevenue,
    };
  });
}

function SummaryRow({ revenueSeries }: { revenueSeries: Array<{ day: string; revenue: number }> }) {
  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const revenueValues = revenueSeries.map((point) => point.revenue);
  const minRevenue = Math.min(...revenueValues);
  const maxRevenue = Math.max(...revenueValues);
  const midpoint = (minRevenue + maxRevenue) / 2;
  const halfRange = Math.max((maxRevenue - minRevenue) * 1.6, 4_500);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-2">
        <div>
          <div className="font-medium text-muted-foreground text-sm">Revenue</div>
          <div className="font-semibold text-4xl tabular-nums tracking-tight">$1,248,000</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">+9.4%</Badge>
          <Badge variant="secondary">+$107,000</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
          <span>Previous $1,141,000</span>
          <Badge variant="outline" className="font-medium text-xs">
            Risk Ladder 30
          </Badge>
        </div>
        <div>
          <ChartContainer config={revenueChartConfig} className="h-10 w-full rounded-md border">
            <ComposedChart data={revenueSeries} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[midpoint - halfRange, midpoint + halfRange]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.14}
                stroke="var(--color-revenue)"
              />
            </ComposedChart>
          </ChartContainer>
          <span className="text-muted-foreground text-xs">Selected range</span>
        </div>
      </div>

      <Card className="py-4 shadow-xs lg:col-span-2">
        <CardHeader className="px-4">
          <CardTitle>Risk summary</CardTitle>
          <CardDescription>Core risk signals vs previous period</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:[&>div:first-child]:pl-0 lg:[&>div:last-child]:pr-0 lg:[&>div]:px-5">
          {RISK_SUMMARY_METRICS.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="text-muted-foreground text-sm">{item.label}</div>
              <div className="font-semibold text-2xl tabular-nums">{item.value}</div>
              <div className="text-muted-foreground text-xs">{item.comparatorLabel}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function RiskViewSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("risk-view");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-54 justify-between">
          <div className="flex items-center gap-2">
            <div
              className="size-2 rounded-full bg-primary"
              style={{
                boxShadow: "0 0 8px color-mix(in oklab, var(--primary) 50%, transparent)",
              }}
            />
            {riskViews.find((view) => view.value === value)?.label}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-54 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {riskViews.map((view) => (
                <CommandItem
                  key={view.value}
                  value={view.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{view.label}</span>
                    <span className="text-muted-foreground text-xs">{view.description}</span>
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

function FiltersPopover({
  selectedFilters,
  onToggle,
}: {
  selectedFilters: FilterToggleKey[];
  onToggle: (key: FilterToggleKey, checked: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const activeCount = selectedFilters.length;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" aria-expanded={open}>
            Filters
            <Badge className="tabular-nums" variant="secondary">
              {activeCount}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              <Badge variant="outline" className="font-medium text-xs tabular-nums">
                Risk Ladder 30
              </Badge>
            </div>
            <div className="space-y-3">
              {FILTER_OPTIONS.map((item) => (
                <FilterToggle
                  key={item.key}
                  id={item.key}
                  label={item.label}
                  checked={selectedFilters.includes(item.key)}
                  onCheckedChange={(checked) => onToggle(item.key, checked)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground text-sm">
        Showing: <span className="font-medium">{summarizeFilterState(selectedFilters)}</span>
      </span>
    </div>
  );
}

function FilterToggle({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex cursor-pointer items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onCheckedChange(Boolean(value))} />
      <Label htmlFor={id} className="cursor-pointer font-normal text-sm">
        {label}
      </Label>
    </div>
  );
}

function summarizeFilterState(selectedFilters: FilterToggleKey[]) {
  if (selectedFilters.length === 0) {
    return "All deals";
  }
  return FILTER_OPTIONS.filter((item) => selectedFilters.includes(item.key))
    .map((item) => item.summaryLabel)
    .join(" · ");
}
