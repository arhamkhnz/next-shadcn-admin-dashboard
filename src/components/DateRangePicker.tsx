"use client";

import * as React from "react";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format, startOfYear, endOfYear } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly selectedRange?: DateRange | undefined;
  readonly onChangeRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  readonly calendarStart?: Date;
  readonly calendarEnd?: Date;
}

export function DateRangePicker({
  className,
  selectedRange,
  onChangeRange,
  calendarStart = startOfYear(new Date()), // Default: start of the current year
  calendarEnd = endOfYear(new Date()), // Default: end of the current year
}: DateRangePickerProps) {
  const renderDateText = () => {
    if (selectedRange?.from) {
      if (selectedRange.to) {
        return (
          <>
            {format(selectedRange.from, "LLL dd, y")} - {format(selectedRange.to, "LLL dd, y")}
          </>
        );
      }
      return format(selectedRange.from, "LLL dd, y");
    }
    return <span>Pick a date</span>;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full md:w-[260px] justify-start text-left font-normal",
              !selectedRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {renderDateText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={onChangeRange}
            numberOfMonths={2}
            disabled={{ before: calendarStart, after: calendarEnd }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
