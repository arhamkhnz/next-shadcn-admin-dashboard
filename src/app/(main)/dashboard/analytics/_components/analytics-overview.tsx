"use client";

import * as React from "react";

import { Check, ChevronsUpDown, Download } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

const last30DaysRevenue = [
  { day: "D1", revenue: 24850 },
  { day: "D2", revenue: 25620 },
  { day: "D3", revenue: 26310 },
  { day: "D4", revenue: 26940 },
  { day: "D5", revenue: 26280 },
  { day: "D6", revenue: 25540 },
  { day: "D7", revenue: 24890 },
  { day: "D8", revenue: 25480 },
  { day: "D9", revenue: 26170 },
  { day: "D10", revenue: 26860 },
  { day: "D11", revenue: 27520 },
  { day: "D12", revenue: 26910 },
  { day: "D13", revenue: 26180 },
  { day: "D14", revenue: 25530 },
  { day: "D15", revenue: 24940 },
  { day: "D16", revenue: 25560 },
  { day: "D17", revenue: 26290 },
  { day: "D18", revenue: 27040 },
  { day: "D19", revenue: 27710 },
  { day: "D20", revenue: 27120 },
  { day: "D21", revenue: 26410 },
  { day: "D22", revenue: 25780 },
  { day: "D23", revenue: 25160 },
  { day: "D24", revenue: 25740 },
  { day: "D25", revenue: 26480 },
  { day: "D26", revenue: 27220 },
  { day: "D27", revenue: 27910 },
  { day: "D28", revenue: 27360 },
  { day: "D29", revenue: 26640 },
  { day: "D30", revenue: 26020 },
];
const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RiskViewSelect />
          <FiltersPopover />
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker />
          <Button variant="secondary">
            <Download />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <div>
            <div className="font-medium text-muted-foreground text-sm">Revenue</div>
            <div className="font-semibold text-4xl tabular-nums tracking-tight">$745,200</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">+11%</Badge>
            <Badge variant="secondary">+$71,700</Badge>
            <Badge variant="outline">vs last month</Badge>
          </div>

          <div className="text-muted-foreground text-sm">vs $673,500 last month</div>
          <div>
            <ChartContainer config={revenueChartConfig} className="h-10 w-full max-w-74 rounded-md border">
              <AreaChart
                accessibilityLayer
                data={last30DaysRevenue}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[20000, 40000]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                    <stop offset="90%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#fillRevenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
            <span className="text-muted-foreground text-xs">Last 30 days</span>
          </div>
        </div>

        <Card className="col-span-2 py-4 shadow-xs">
          <CardHeader className="px-4">
            <CardTitle>Risk summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 divide-x [&>div:first-child]:pl-0 [&>div:last-child]:pr-0 [&>div]:px-6">
            <div className="space-y-2">
              <div>Stalled Deals</div>
              <div className="text-2xl">22</div>
              <div className="text-muted-foreground text-xs">{">"}14 days idle</div>
            </div>

            <div className="space-y-2">
              <div>Revenue at Risk</div>
              <div className="text-2xl">$157,300</div>
              <div className="text-muted-foreground text-xs">closing date exceeded</div>
            </div>

            <div className="space-y-2">
              <div>Win Rate Trend</div>
              <div className="text-2xl">3.5%</div>
              <div className="text-muted-foreground text-xs">-4.2%</div>
            </div>

            <div className="space-y-2">
              <div>Avg Sales Cycle Drift</div>
              <div className="text-2xl">31 days</div>
              <div className="text-muted-foreground text-xs">vs previous period</div>
            </div>
          </CardContent>
        </Card>
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
                    setValue(currentValue);
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
            <Button className="w-full" variant="outline" size="sm" onClick={handleClear}>
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
