import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";
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

const supabase = createClientComponentClient();

export const useFranchiseDashboardStore = create<FranchiseDashboardState>((set) => ({
  branches: [],
  services: [],
  washers: [],
  bookings: [],
  fetchBranches: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    const { data, error } = await supabase.from("branches").select("*").eq("franchise_id", franchiseId);

    if (error) {
      console.error("Error fetching branches:", error);
      return;
    }

    set({ branches: data as Branch[] });
  },
  fetchServices: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for services:", branchesError);
      return;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ services: [] });
      return;
    }

    // Then get services for those branches
    const { data, error } = await supabase.from("services").select("*").in("branch_id", branchIds);

    if (error) {
      console.error("Error fetching services:", error);
      return;
    }

    set({ services: data as Service[] });
  },
  fetchWashers: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for washers:", branchesError);
      return;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ washers: [] });
      return;
    }

    // Then get washers for those branches
    const { data, error } = await supabase.from("washers").select("*").in("branch_id", branchIds);

    if (error) {
      console.error("Error fetching washers:", error);
      return;
    }

    set({ washers: data as Washer[] });
  },
  fetchBookings: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for bookings:", branchesError);
      return;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ bookings: [] });
      return;
    }

    // Then get bookings for those branches
    const { data, error } = await supabase.from("bookings").select("*").in("branch_id", branchIds);

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
