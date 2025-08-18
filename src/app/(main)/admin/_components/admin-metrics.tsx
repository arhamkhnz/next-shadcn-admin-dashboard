"use client";

import { useEffect, useState } from "react";

import { Building2, Users, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

export function AdminMetrics() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeWashers: 0,
    loading: true,
    error: false,
  });

  const { bookings } = useBookingStore();
  const { payments } = usePaymentStore();
  const { users } = useUserStore();
  const { washers } = useWasherStore();

  useEffect(() => {
    const calculateMetrics = () => {
      try {
        // Calculate total revenue from successful payments
        const totalRevenue = payments
          .filter((payment) => payment.status === "succeeded")
          .reduce((sum, payment) => sum + payment.amount, 0);

        // Get counts
        const totalBookings = bookings.length;
        const totalUsers = users.length;
        const activeWashers = washers.filter((washer) => washer.status === "active").length;

        setMetrics({
          totalRevenue,
          totalBookings,
          totalUsers,
          activeWashers,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error calculating metrics:", error);
        setMetrics((prev) => ({ ...prev, loading: false, error: true }));
      }
    };

    // Only calculate when we have data
    if (bookings.length > 0 || payments.length > 0 || users.length > 0 || washers.length > 0) {
      calculateMetrics();
    }
  }, [bookings, payments, users, washers]);

  if (metrics.loading) {
    return <div>Loading metrics...</div>;
  }

  if (metrics.error) {
    return <div>Error loading metrics...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="text-muted-foreground h-4 w-4"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</div>
          <p className="text-muted-foreground text-xs">From all completed bookings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{metrics.totalBookings}</div>
          <p className="text-muted-foreground text-xs">Across all branches</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Building2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{metrics.totalUsers}</div>
          <p className="text-muted-foreground text-xs">Registered in the system</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Washers</CardTitle>
          <UsersRound className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{metrics.activeWashers}</div>
          <p className="text-muted-foreground text-xs">Currently available for bookings</p>
        </CardContent>
      </Card>
    </>
  );
}
