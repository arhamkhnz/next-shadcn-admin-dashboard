"use client";

import * as React from "react";

import { DateRange } from "react-day-picker";

export function AdminHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your car wash system overview</p>
      </div>
    </div>
  );
}
