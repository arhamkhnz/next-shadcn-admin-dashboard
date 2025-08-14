/* eslint-disable */
/* eslint-disable complexity */
"use client";
import React, { useEffect } from "react";

import FranchiseBookingsChart from "@/app/(main)/franchise/_components/franchise-bookings-chart";

import FranchiseMetrics from "@/app/(main)/franchise/_components/franchise-metrics";
import PendingBookingsTable from "@/app/(main)/franchise/_components/pending-bookings-table";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

function getDailyBookings(bookings: { scheduled_at: string }[] = []) {
  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    const date = b.scheduled_at.slice(0, 10);
    counts[date] = (counts[date] || 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

const FranchiseDashboardHome: React.FC = () => {
  const { branches, services, washers, bookings, fetchBranches, fetchServices, fetchWashers, fetchBookings } =
    useFranchiseDashboardStore();

  useEffect(() => {
    fetchBranches();
    fetchServices();
    fetchWashers();
    fetchBookings();
  }, [fetchBranches, fetchServices, fetchWashers, fetchBookings]);

  return (
    <div className="space-y-6 p-6">
      <section>
        <FranchiseMetrics
          totalBranches={branches.length}
          totalServices={services.length}
          activeWashers={washers.length}
        />
      </section>
      <section>
        {/* Daily Bookings Chart */}
        <FranchiseBookingsChart data={getDailyBookings(bookings)} />
      </section>
      <section>
        <PendingBookingsTable
          bookings={bookings.map((booking) => {
            const user =
              typeof booking.user_id === "string" && branches && branches.length && washers && washers.length
                ? (washers.find((washer) => washer.id === booking.user_id)?.name ?? booking.user_id)
                : booking.user_id;
            const branch = branches.find((br) => br.id === booking.branch_id)?.name ?? booking.branch_id;
            const service = services.find((s) => s.id === booking.service_id)?.name ?? booking.service_id;
            return {
              ...booking,
              user,
              branch,
              service,
              date: booking.scheduled_at,
            };
          })}
        />
      </section>
    </div>
  );
};

export default FranchiseDashboardHome;
