"use client";

import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFranchiseAnalyticsStore } from "@/stores/franchise-dashboard/analytics-store";

import { FranchiseAnalyticsChart } from "./franchise-analytics-chart";
import FranchiseMetrics from "./franchise-metrics";

export function FranchiseAnalyticsDashboard() {
  const {
    branches,
    services,
    washers,
    bookings,
    bookingTrends,
    revenueData,
    servicePerformance,
    washerPerformance,
    branchPerformance,
    fetchAllData,
    fetchBookingTrends,
    fetchRevenueData,
    fetchServicePerformance,
    fetchWasherPerformance,
    fetchBranchPerformance,
  } = useFranchiseAnalyticsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAllData(),
          fetchBookingTrends(),
          fetchRevenueData(),
          fetchServicePerformance(),
          fetchWasherPerformance(),
          fetchBranchPerformance(),
        ]);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, [
    fetchAllData,
    fetchBookingTrends,
    fetchRevenueData,
    fetchServicePerformance,
    fetchWasherPerformance,
    fetchBranchPerformance,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">View insights and performance metrics for your franchise.</p>
      </div>

      <FranchiseMetrics
        totalBranches={branches.length}
        totalServices={services.length}
        activeWashers={washers.length}
        totalBookings={bookings.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Daily bookings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart data={bookingTrends} dataKey="count" title="Bookings" color="#5eead4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Daily revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart data={revenueData} dataKey="amount" title="Revenue" color="#60a5fa" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Bookings by service</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={servicePerformance}
              dataKey="bookings"
              title="Bookings"
              color="#f87171"
              type="bar"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Washer Performance</CardTitle>
            <CardDescription>Bookings by washer</CardDescription>
          </CardHeader>
          <CardContent>
            <FranchiseAnalyticsChart
              data={washerPerformance}
              dataKey="bookings"
              title="Bookings"
              color="#fbbf24"
              type="bar"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch Performance</CardTitle>
          <CardDescription>Bookings by branch</CardDescription>
        </CardHeader>
        <CardContent>
          <FranchiseAnalyticsChart
            data={branchPerformance}
            dataKey="bookings"
            title="Bookings"
            color="#a78bfa"
            type="bar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
