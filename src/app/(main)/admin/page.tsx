"use client";

import { Suspense, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminStore } from "@/stores/admin-dashboard/admin-store";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";
import { useReviewStore } from "@/stores/admin-dashboard/review-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";
import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { AdminHeader } from "./_components/admin-header";
import { AdminMetrics } from "./_components/admin-metrics";
import { BookingsChartInteractive } from "./_components/bookings-chart-interactive";
import { DebugData } from "./_components/debug-data";
import { FranchisePerformanceChart } from "./_components/franchise-performance-chart";
import { PaymentsChart } from "./_components/payments-chart";
import { RecentActivity } from "./_components/recent-activity";
import { RecentBookingsTable } from "./_components/recent-bookings-table";
import { ReportsView } from "./_components/reports-view";
import { WashersActivityTable } from "./_components/washers-activity-table";

export default function AdminHomePage() {
  const { fetchBranches } = useBranchStore();
  const { fetchFranchises } = useFranchiseStore();
  const { fetchPayments } = usePaymentStore();
  const { fetchReviews } = useReviewStore();
  const { fetchServices } = useServiceStore();
  const { fetchUsers } = useUserStore();
  const { fetchWashers } = useWasherStore();
  const { fetchBookings } = useBookingStore();

  useEffect(() => {
    const fetchData = async () => {
      // Level 1: No dependencies
      await Promise.all([useAdminStore.getState().fetchAdmins(), useUserStore.getState().fetchUsers()]);

      // Level 2: Depends on Admins
      await useFranchiseStore.getState().fetchFranchises();

      // Level 3: Depends on Franchises
      await useBranchStore.getState().fetchBranches();

      // Level 4: Depends on Branches and Users
      await Promise.all([
        useWasherStore.getState().fetchWashers(),
        useServiceStore.getState().fetchServices(),
        useReviewStore.getState().fetchReviews(),
        usePaymentStore.getState().fetchPayments(),
      ]);

      // Level 5: Depends on Washers
      const washerIds = useWasherStore.getState().washers.map((w) => w.id);
      await Promise.all(washerIds.map((id) => useWasherScheduleStore.getState().fetchSchedulesForWasher(id)));

      // Level 6: Depends on multiple stores
      await useBookingStore.getState().fetchBookings();
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <AdminHeader />
      {/* Debug component - can be removed later */}
      <DebugData />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
              <AdminMetrics />
            </Suspense>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <div className="col-span-1 lg:col-span-4">
              <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
                <BookingsChartInteractive />
              </Suspense>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
                <RecentActivity />
              </Suspense>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
              <FranchisePerformanceChart />
            </Suspense>
            <Suspense fallback={<div className="bg-muted h-[350px] animate-pulse rounded-lg" />}>
              <PaymentsChart />
            </Suspense>
          </div>
          <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
            <WashersActivityTable />
          </Suspense>
        </TabsContent>
        <TabsContent value="activity">
          <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
            <RecentBookingsTable />
          </Suspense>
        </TabsContent>
        <TabsContent value="reports">
          <Suspense fallback={<div className="bg-muted h-[450px] animate-pulse rounded-lg" />}>
            <ReportsView />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
