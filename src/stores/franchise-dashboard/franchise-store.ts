import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { Database } from "@/types/database";
import { Branch, Service, Washer, Booking } from "@/types/franchise";

type FranchiseDashboardState = {
  branches: Branch[];
  services: Service[];
  washers: Washer[];
  bookings: Booking[];
  fetchBranches: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchWashers: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  updateBooking: (updatedBooking: Booking) => void;
};

const supabase = createClientComponentClient<Database>();

export const useFranchiseDashboardStore = create<FranchiseDashboardState>((set) => ({
  branches: [],
  services: [],
  washers: [],
  bookings: [],
  fetchBranches: async () => {
    const { data, error } = await supabase.from("branches").select("*");
    if (error) {
      console.error("Error fetching branches:", error);
      return;
    }
    set({ branches: data as Branch[] });
  },
  fetchServices: async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error fetching services:", error);
      return;
    }
    set({ services: data as Service[] });
  },
  fetchWashers: async () => {
    const { data, error } = await supabase.from("washers").select("*");
    if (error) {
      console.error("Error fetching washers:", error);
      return;
    }
    set({ washers: data as Washer[] });
  },
  fetchBookings: async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (error) {
      console.error("Error fetching bookings:", error);
      return;
    }
    set({ bookings: data as Booking[] });
  },
  updateBooking: (updatedBooking: Booking) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === updatedBooking.id ? { ...booking, ...updatedBooking } : booking,
      ),
    }));
  },
}));
