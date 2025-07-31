import { create } from "zustand";

import { Booking } from "@/app/(main)/admin/_components/columns";
import { createClient } from "@/lib/supabase/client";

import { useBranchStore } from "./branch-store";
import { useServiceStore } from "./service-store";
import { useUserStore } from "./user-store";

const supabase = createClient();

type BookingState = {
  bookings: Booking[];
  fetchBookings: () => Promise<void>;
};

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  fetchBookings: async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (error) {
      console.error("Error fetching bookings:", error);
      return;
    }

    // Get the states from other stores to map IDs to names
    const { users } = useUserStore.getState();
    const { branches } = useBranchStore.getState();
    const { services } = useServiceStore.getState();

    const transformedBookings = data.map((booking) => {
      const user = users.find((u) => u.id === booking.user_id)?.name ?? "Unknown User";
      const branch = branches.find((b) => b.id === booking.branch_id)?.name ?? "Unknown Branch";
      const service = services.find((s) => s.id === booking.service_id)?.name ?? "Unknown Service";

      return {
        id: booking.id,
        user,
        branch,
        service,
        serviceId: booking.service_id,
        status: booking.status,
        date: new Date(booking.scheduled_at),
      };
    });

    set({ bookings: transformedBookings as Booking[] });
  },
}));
