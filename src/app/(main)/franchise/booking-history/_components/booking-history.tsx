"use client";

import React, { useEffect } from "react";

import { enrichBookings } from "@/app/(main)/franchise/utils/bookings";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

import { BookingHistoryDataTable } from "./booking-history-data-table";
import { columns } from "./columns";

const BookingHistory: React.FC = () => {
  const { bookings, branches, washers, services, fetchBookings, fetchBranches, fetchWashers, fetchServices } =
    useFranchiseDashboardStore();

  useEffect(() => {
    fetchBookings();
    fetchBranches();
    fetchWashers();
    fetchServices();
  }, [fetchBookings, fetchBranches, fetchWashers, fetchServices]);

  const enrichedBookings = enrichBookings(bookings, branches, washers, services);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Karwi Booking History</h2>
      <BookingHistoryDataTable data={enrichedBookings} />
    </div>
  );
};

export default BookingHistory;
