"use client";

import { Building2, Users, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

export function AdminMetrics() {
  const { bookings } = useBookingStore();
  const { services } = useServiceStore();
  const { users } = useUserStore();
  const { washers } = useWasherStore();

  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((acc, booking) => {
      const service = services.find((s) => s.id === booking.serviceId);
      return acc + (service?.price ?? 0);
    }, 0);

  const totalBookings = bookings.length;
  const totalUsers = users.length;
  const activeWashers = washers.filter((w) => w.status === "active").length;

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
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <p className="text-muted-foreground text-xs">From all completed bookings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalBookings}</div>
          <p className="text-muted-foreground text-xs">Across all branches</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Building2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalUsers}</div>
          <p className="text-muted-foreground text-xs">Registered in the system</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Washers</CardTitle>
          <UsersRound className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{activeWashers}</div>
          <p className="text-muted-foreground text-xs">Currently available for bookings</p>
        </CardContent>
      </Card>
    </>
  );
}
