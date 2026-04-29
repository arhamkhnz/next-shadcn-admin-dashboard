import { Download, LineChart, Scale, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { KpiStrip } from "./kpi-strip";
import { MerchandiseMovementTable } from "./merchandise-movement-table";
import { OperationsGrid } from "./operations-grid";
import { TradingPulseCard } from "./trading-pulse-card";

export function ECommerceDashboard() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <section className="space-y-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 space-y-1.5">
            <h1 className="text-3xl text-foreground leading-none tracking-tight">E-commerce Overview</h1>
            <p className="text-muted-foreground text-sm">Trading performance, funnel health, and inventory signals.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <ToggleGroup type="single" defaultValue="trading" variant="outline" size="sm" className="w-fit">
              <ToggleGroupItem value="trading" aria-label="Trading view">
                <LineChart data-icon="inline-start" />
                Trading
              </ToggleGroupItem>
              <ToggleGroupItem value="margin" aria-label="Margin view">
                <Scale data-icon="inline-start" />
                Margin
              </ToggleGroupItem>
            </ToggleGroup>

            <Select defaultValue="last-30-days">
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Quarter to date</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <SlidersHorizontal data-icon="inline-start" />
              Compare
            </Button>
            <Button variant="secondary" size="sm">
              <Download data-icon="inline-start" />
              Export
            </Button>
          </div>
        </div>

        <KpiStrip />
      </section>
      <TradingPulseCard />
      <OperationsGrid />
      <MerchandiseMovementTable />
    </div>
  );
}
