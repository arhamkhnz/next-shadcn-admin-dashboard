import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Franchise, Branch, Washer, Booking, Service } from "@/types/franchise";

const supabase = createClient();

export type FranchiseDashboardState = {
  branches: Branch[];
  washers: Washer[];
  bookings: Booking[];
  services: Service[];
  loading: boolean;
  fetchBranches: () => Promise<void>;
  fetchWashers: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchServices: () => Promise<void>;
};

export const useFranchiseDashboardStore = create<FranchiseDashboardState>((set, get) => ({
  branches: [],
  washers: [],
  bookings: [],
  services: [],
  loading: false,
  fetchBranches: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("branches").select("*");
    set({ branches: data ?? [], loading: false });
  },
  fetchWashers: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("washers").select("*");
    set({ washers: data ?? [], loading: false });
  },
  fetchBookings: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("bookings").select("*");
    set({ bookings: data ?? [], loading: false });
  },
  fetchServices: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("services").select("*");
    set({ services: data ?? [], loading: false });
  },
}));
