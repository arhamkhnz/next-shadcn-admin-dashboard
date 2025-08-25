/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { Booking, Branch, Service, Washer } from "@/types/franchise";

// Define types for our analytics data
export type BookingTrend = {
  date: string;
  count: number;
};

export type RevenueData = {
  date: string;
  amount: number;
};

export type ServicePerformance = {
  service_id: string;
  service_name: string;
  bookings: number;
  revenue: number;
};

export type WasherPerformance = {
  washer_id: string;
  washer_name: string;
  bookings: number;
  rating: number;
};

export type BranchPerformance = {
  branch_id: string;
  branch_name: string;
  bookings: number;
  revenue: number;
};

type AnalyticsState = {
  // Data
  branches: Branch[];
  services: Service[];
  washers: Washer[];
  bookings: Booking[];

  // Analytics
  bookingTrends: BookingTrend[];
  revenueData: RevenueData[];
  servicePerformance: ServicePerformance[];
  washerPerformance: WasherPerformance[];
  branchPerformance: BranchPerformance[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllData: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchWashers: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchBookingTrends: () => Promise<void>;
  fetchRevenueData: () => Promise<void>;
  fetchServicePerformance: () => Promise<void>;
  fetchWasherPerformance: () => Promise<void>;
  fetchBranchPerformance: () => Promise<void>;
  refreshAll: () => Promise<void>;
};

const supabase = createClientComponentClient();

export const useFranchiseAnalyticsStore = create<AnalyticsState>((set, get) => ({
  branches: [],
  services: [],
  washers: [],
  bookings: [],
  bookingTrends: [],
  revenueData: [],
  servicePerformance: [],
  washerPerformance: [],
  branchPerformance: [],
  isLoading: false,
  error: null,

  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([get().fetchBranches(), get().fetchServices(), get().fetchWashers(), get().fetchBookings()]);
    } catch (error) {
      set({ error: "Failed to fetch data" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBranches: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    const { data, error } = await supabase.from("branches").select("*").eq("franchise_id", franchiseId);

    if (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }

    set({ branches: data as Branch[] });
  },

  fetchServices: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for services:", branchesError);
      throw branchesError;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ services: [] });
      return;
    }

    // Then get services for those branches
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .or(`branch_id.in.(${branchIds.join(",")}),is_global.eq.true`);

    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }

    set({ services: data as Service[] });
  },

  fetchWashers: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for washers:", branchesError);
      throw branchesError;
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
      throw error;
    }

    set({ washers: data as Washer[] });
  },

  fetchBookings: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for bookings:", branchesError);
      throw branchesError;
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
      throw error;
    }

    set({ bookings: data as Booking[] });
  },

  fetchBookingTrends: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for booking trends:", branchesError);
      throw branchesError;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ bookingTrends: [] });
      return;
    }

    // Get booking counts by date
    const { data, error } = await supabase
      .from("bookings")
      .select("scheduled_at")
      .in("branch_id", branchIds)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching booking trends:", error);
      throw error;
    }

    // Process data to group by date
    const trends: Record<string, number> = {};
    data.forEach((booking) => {
      if (booking.scheduled_at) {
        const date = booking.scheduled_at.split("T")[0]; // Get YYYY-MM-DD
        trends[date] = (trends[date] ?? 0) + 1;
      }
    });

    const bookingTrends = Object.entries(trends).map(([date, count]) => ({
      date,
      count,
    }));

    set({ bookingTrends });
  },

  fetchRevenueData: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for revenue data:", branchesError);
      throw branchesError;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ revenueData: [] });
      return;
    }

    // Get payments for bookings in these branches
    const { data, error } = await supabase
      .from("payments")
      .select("amount, created_at, bookings(branch_id)")
      .eq("status", "completed")
      .in("bookings.branch_id", branchIds);

    if (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }

    // Process data to group by date
    const revenueByDate: Record<string, number> = {};
    data.forEach((payment) => {
      if (payment.created_at) {
        const date = payment.created_at.split("T")[0]; // Get YYYY-MM-DD
        revenueByDate[date] = (revenueByDate[date] ?? 0) + (payment.amount ?? 0);
      }
    });

    const revenueData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      amount,
    }));

    set({ revenueData });
  },

  fetchServicePerformance: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for service performance:", branchesError);
      throw branchesError;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ servicePerformance: [] });
      return;
    }

    // Get booking counts and revenue by service
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        service_id,
        services(name),
        payments(amount)
      `,
      )
      .in("branch_id", branchIds)
      .eq("payments.status", "completed");

    if (error) {
      console.error("Error fetching service performance:", error);
      throw error;
    }

    // Process data to group by service
    const serviceMap: Record<string, { name: string; bookings: number; revenue: number }> = {};
    data.forEach((booking) => {
      const serviceId = booking.service_id;
      if (serviceId) {
        if (!serviceMap[serviceId]) {
          serviceMap[serviceId] = {
            name: (booking.services as any)?.name ?? "Unknown Service",
            bookings: 0,
            revenue: 0,
          };
        }
        serviceMap[serviceId].bookings += 1;
        serviceMap[serviceId].revenue += (booking.payments as any)?.amount ?? 0;
      }
    });

    const servicePerformance = Object.entries(serviceMap).map(([service_id, data]) => ({
      service_id,
      service_name: data.name,
      bookings: data.bookings,
      revenue: data.revenue,
    }));

    set({ servicePerformance });
  },

  fetchWasherPerformance: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for washer performance:", branchesError);
      throw branchesError;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ washerPerformance: [] });
      return;
    }

    // Get booking counts and ratings by washer
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        washer_id,
        washers(name, rating)
      `,
      )
      .in("branch_id", branchIds);

    if (error) {
      console.error("Error fetching washer performance:", error);
      throw error;
    }

    // Process data to group by washer
    const washerMap: Record<string, { name: string; bookings: number; totalRating: number; ratingCount: number }> = {};
    data.forEach((booking) => {
      const washerId = booking.washer_id;
      if (washerId) {
        const washerData = booking.washers as any;
        if (!washerMap[washerId]) {
          washerMap[washerId] = {
            name: washerData?.name ?? "Unknown Washer",
            bookings: 0,
            totalRating: 0,
            ratingCount: 0,
          };
        }
        washerMap[washerId].bookings += 1;
        if (washerData?.rating) {
          washerMap[washerId].totalRating += washerData.rating;
          washerMap[washerId].ratingCount += 1;
        }
      }
    });

    const washerPerformance = Object.entries(washerMap).map(([washer_id, data]) => ({
      washer_id,
      washer_name: data.name,
      bookings: data.bookings,
      rating: data.ratingCount > 0 ? data.totalRating / data.ratingCount : 0,
    }));

    set({ washerPerformance });
  },

  fetchBranchPerformance: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // First get branch IDs for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id, name")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      console.error("Error fetching branches for branch performance:", branchesError);
      throw branchesError;
    }

    const branchMap = branches.reduce(
      (acc, branch) => {
        acc[branch.id] = branch.name;
        return acc;
      },
      {} as Record<string, string>,
    );

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ branchPerformance: [] });
      return;
    }

    // Get booking counts and revenue by branch
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        branch_id,
        payments(amount)
      `,
      )
      .in("branch_id", branchIds)
      .eq("payments.status", "completed");

    if (error) {
      console.error("Error fetching branch performance:", error);
      throw error;
    }

    // Process data to group by branch
    const branchPerformanceMap: Record<string, { name: string; bookings: number; revenue: number }> = {};
    data.forEach((booking) => {
      const branchId = booking.branch_id;
      if (branchId) {
        if (!branchPerformanceMap[branchId]) {
          branchPerformanceMap[branchId] = {
            name: branchMap[branchId] ?? "Unknown Branch",
            bookings: 0,
            revenue: 0,
          };
        }
        branchPerformanceMap[branchId].bookings += 1;
        branchPerformanceMap[branchId].revenue += (booking.payments as any)?.amount ?? 0;
      }
    });

    const branchPerformance = Object.entries(branchPerformanceMap).map(([branch_id, data]) => ({
      branch_id,
      branch_name: data.name,
      bookings: data.bookings,
      revenue: data.revenue,
    }));

    set({ branchPerformance });
  },

  refreshAll: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchAllData(),
        get().fetchBookingTrends(),
        get().fetchRevenueData(),
        get().fetchServicePerformance(),
        get().fetchWasherPerformance(),
        get().fetchBranchPerformance(),
      ]);
    } catch (error) {
      set({ error: "Failed to refresh data" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
