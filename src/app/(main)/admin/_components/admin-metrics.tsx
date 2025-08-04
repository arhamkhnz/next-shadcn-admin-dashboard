"use client";

import { useEffect, useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Building2, Users, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/types/database";

export function AdminMetrics() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeWashers: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const supabase = createClientComponentClient<Database>();
      const totalRevenue = 0;
      let totalBookings = 0;
      let totalUsers = 0;
      let activeWashers = 0;
      let hasError = false;

      try {
        // Total Bookings
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });
        if (bookingsError) {
          console.error("Error fetching total bookings:", bookingsError);
          hasError = true;
        } else {
          totalBookings = bookingsCount ?? 0;
        }

        // Total Users
        const { count: usersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });
        if (usersError) {
          console.error("Error fetching total users:", usersError);
          hasError = true;
        } else {
          totalUsers = usersCount ?? 0;
        }

        // Active Washers
        const { count: washersCount, error: washersError } = await supabase
          .from("washers")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");
        if (washersError) {
          console.error("Error fetching active washers:", washersError);
          hasError = true;
        } else {
          activeWashers = washersCount ?? 0;
        }
      } catch (error) {
        console.error("Unexpected error fetching metrics:", error);
        hasError = true;
      } finally {
        setMetrics({
          totalRevenue,
          totalBookings,
          totalUsers,
          activeWashers,
          loading: false,
          error: hasError,
        });
      }
    };
    fetchMetrics();
  }, []);

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
