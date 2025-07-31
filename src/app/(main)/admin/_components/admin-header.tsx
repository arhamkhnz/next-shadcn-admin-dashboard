"use client";

import * as React from "react";

import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export function AdminHeader() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: new Date(2024, 0, 20),
  });

  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your car wash system overview</p>
      </div>
      <div className="flex items-center space-x-2">
        <DateRangePicker date={date} onDateChange={setDate} />
        <Button>Download</Button>
      </div>
    </div>
  );
}
