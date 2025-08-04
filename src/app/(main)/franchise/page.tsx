"use client";

import React, { Suspense, useEffect } from "react";

import { FranchiseActivity } from "@/app/(main)/franchise/_components/franchise-activity";
import FranchiseBookingsChart from "@/app/(main)/franchise/_components/franchise-bookings-chart";
import { FranchiseHeader } from "@/app/(main)/franchise/_components/franchise-header";
import FranchiseMetrics from "@/app/(main)/franchise/_components/franchise-metrics";
import { FranchiseReportsView } from "@/app/(main)/franchise/_components/franchise-reports-view";
import PendingBookingsTable from "@/app/(main)/franchise/_components/pending-bookings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

// Helper to prepare data for bookings chart
function getDailyBookings(bookings: { scheduled_at: string }[] = []) {
  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    if (b.scheduled_at) {
      const date = b.scheduled_at.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

// Enrich bookings with user, branch, service display fields
function enrichBookings(
  bookings: any[],
  users: { id: string; name: string }[],
  branches: { id: string; name: string }[],
  services: { id: string; name: string }[],
) {
  return bookings.map((b) => {
    const user = users.find((u) => u.id === b.user_id);
    const branch = branches.find((br) => br.id === b.branch_id);
    const service = services.find((s) => s.id === b.service_id);
    return {
      ...b,
      user: user ? user.name : b.user_id,
      branch: branch ? branch.name : b.branch_id,
      service: service ? service.name : b.service_id,
      date: b.scheduled_at,
    };
  });
}

export default function FranchiseHomePage() {
  const { branches, services, washers, bookings, fetchBranches, fetchServices, fetchWashers, fetchBookings } =
    useFranchiseDashboardStore();

  useEffect(() => {
    fetchBranches();
    fetchServices();
    fetchWashers();
    fetchBookings();
  }, [fetchBranches, fetchServices, fetchWashers, fetchBookings]);

  const metrics = {
    totalBranches: branches.length,
    totalServices: services.length,
    activeWashers: washers.length,
  };

  const dailyBookingsData = getDailyBookings(bookings);
  const enrichedBookingsData = enrichBookings(bookings, washers, branches, services);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <FranchiseHeader />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
              <FranchiseMetrics {...metrics} />
            </Suspense>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <div className="col-span-1 lg:col-span-4">
              <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
                <FranchiseBookingsChart data={dailyBookingsData} />
              </Suspense>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
                <PendingBookingsTable bookings={enrichedBookingsData} />
              </Suspense>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
            <FranchiseActivity />
          </Suspense>
        </TabsContent>
        <TabsContent value="reports">
          <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
            <FranchiseReportsView />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
