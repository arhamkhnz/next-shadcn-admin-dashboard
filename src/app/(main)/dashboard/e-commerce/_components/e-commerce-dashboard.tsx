"use client";

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
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-2xl tracking-tight">E-commerce</h1>
          <p className="text-muted-foreground text-sm">Trading performance, funnel health, and inventory signals.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          <ToggleGroup type="single" defaultValue="trading" variant="outline" size="sm" className="w-fit">
            <ToggleGroupItem value="trading" aria-label="Trading view">
              <LineChart />
              Trading
            </ToggleGroupItem>
            <ToggleGroupItem value="margin" aria-label="Margin view">
              <Scale />
              Margin
            </ToggleGroupItem>
          </ToggleGroup>

          <Select defaultValue="last-30-days">
            <SelectTrigger size="sm" className="w-full sm:w-40">
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
            <SlidersHorizontal />
            Compare
          </Button>
          <Button variant="secondary" size="sm">
            <Download />
            Export
          </Button>
        </div>
      </div>

      <KpiStrip />
      <TradingPulseCard />
      <OperationsGrid />
      <MerchandiseMovementTable />
    </div>
  );
}
