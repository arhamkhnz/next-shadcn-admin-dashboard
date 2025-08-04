"use client";
import React, { Suspense, useEffect } from "react";

import { FranchiseActivity } from "@/app/(main)/franchise/_components/franchise-activity";
import FranchiseBookingsChart from "@/app/(main)/franchise/_components/franchise-bookings-chart";
import { FranchiseHeader } from "@/app/(main)/franchise/_components/franchise-header";
import FranchiseMetrics from "@/app/(main)/franchise/_components/franchise-metrics";
import { FranchiseReportsView } from "@/app/(main)/franchise/_components/franchise-reports-view";
import PendingBookingsTable from "@/app/(main)/franchise/_components/pending-bookings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";
import { useFranchiseUserStore } from "@/stores/franchise-dashboard/user-store";

// Metrics calculation helper
function getMetrics(branches: any[], services: any[], washers: any[]) {
  return {
    totalBranches: branches.length,
    totalServices: services.length,
    activeWashers: washers.length, // Could be filtered for active only
  };
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

  // Calculate metrics from store data
  const metrics = getMetrics(branches, services, washers);

  // Prepare bookings data for the chart
  const bookingsData = bookings.map((booking) => ({
    date: new Date(booking.scheduled_at).toISOString().split("T")[0],
    count: 1, // Each booking counts as 1 for the chart
  }));
  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <FranchiseHeader />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
                <FranchiseMetrics {...metrics} />
              </Suspense>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="col-span-1 lg:col-span-2">
                <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
                  <FranchiseBookingsChart data={bookingsData} />
                </Suspense>
              </div>
              <div className="col-span-1">{/* Add more widgets or quick stats here if needed */}</div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-background rounded-lg p-4">
              <h2 className="mb-2 text-lg font-semibold">Analytics</h2>
              <p className="text-muted-foreground">Analytics for your franchise will appear here.</p>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
              <FranchiseActivity />
            </Suspense>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
              <FranchiseReportsView />
            </Suspense>
          </TabsContent>
          <TabsContent value="bookings">
            <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
              <PendingBookingsTable bookings={enrichBookings(bookings, washers, branches, services)} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
