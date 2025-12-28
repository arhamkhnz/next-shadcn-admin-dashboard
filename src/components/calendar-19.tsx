"use client";

import * as React from "react";

import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerWithPresets() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 2),
    to: new Date(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" id="dates" className="w-56 justify-between font-normal">
          {dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
            : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} />
      </PopoverContent>
    </Popover>
  );
}
