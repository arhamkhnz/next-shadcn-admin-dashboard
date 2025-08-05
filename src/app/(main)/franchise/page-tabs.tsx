"use client";

import { Suspense, useEffect } from "react";

import FranchiseBookingsChart from "@/app/(main)/franchise/_components/franchise-bookings-chart";
import FranchiseMetrics from "@/app/(main)/franchise/_components/franchise-metrics";
import PendingBookingsTable from "@/app/(main)/franchise/_components/pending-bookings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

import { enrichBookings, getDailyBookings } from "./utils/bookings";
// eslint-disable-next-line import/no-unresolved
import { getMetrics } from "./utils/metrics";

export default function FranchiseHomePageTabs() {
  // Store hooks
  const { branches, services, washers, bookings, fetchBranches, fetchServices, fetchWashers, fetchBookings } =
    useFranchiseDashboardStore();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchBranches(), fetchServices(), fetchWashers(), fetchBookings()]);
      } catch (error) {
        console.error("Error fetching franchise data:", error);
        // TODO: Add error handling UI
      }
    };

    fetchData();
  }, [fetchBranches, fetchServices, fetchWashers, fetchBookings]);

  // Process bookings data for the chart
  const dailyBookingsData = getDailyBookings(bookings);

  // Enrich bookings data for the table
  const enrichedBookings = enrichBookings(bookings, branches, washers, services);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
            <FranchiseMetrics {...getMetrics(branches, services, washers)} />
          </Suspense>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <div className="col-span-1 lg:col-span-4">
              <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
                <FranchiseBookingsChart data={dailyBookingsData} />
              </Suspense>
            </div>
            <div className="col-span-1 lg:col-span-3">{/* Add a summary/activity widget here if desired */}</div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Add analytics widgets for franchise here */}
        </TabsContent>

        <TabsContent value="bookings">
          <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
            <PendingBookingsTable bookings={enrichedBookings} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
