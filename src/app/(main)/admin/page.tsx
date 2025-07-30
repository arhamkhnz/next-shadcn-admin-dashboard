"use client";

import { Suspense } from "react";

import { AdminHeader } from "./_components/admin-header";
import { AdminMetrics } from "./_components/admin-metrics";
import { BookingsChartInteractive } from "./_components/bookings-chart-interactive";
import { RecentBookingsTable } from "./_components/recent-bookings-table";

export default function AdminHomePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <AdminHeader />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
          <AdminMetrics />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-1">
          <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
            <BookingsChartInteractive />
          </Suspense>
        </div>
        <div className="col-span-1 xl:col-span-2">
          <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
            <RecentBookingsTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
