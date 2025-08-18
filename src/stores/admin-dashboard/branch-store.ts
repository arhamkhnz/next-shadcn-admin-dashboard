/* eslint-disable import/no-cycle */

import { create } from "zustand";

import { Branch } from "@/app/(main)/admin/branches/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useFranchiseStore } from "./franchise-store";
import { useServiceStore } from "./service-store";

const supabase = createClient();

type BranchState = {
  branches: Branch[];
  fetchBranches: () => Promise<void>;
  addBranch: (branch: Omit<Branch, "id" | "createdAt">) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
};

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  fetchBranches: async () => {
    // Fetch franchises first to ensure we have the latest data
    await useFranchiseStore.getState().fetchFranchises();
    // Fetch services to ensure we have the latest data
    await useServiceStore.getState().fetchServices();

    const { data, error } = await supabase.from("branches").select("*, location_text:location::text");
    if (error) {
      console.error("Error fetching branches:", error);
      return;
    }

    const { franchises } = useFranchiseStore.getState();
    const { services } = useServiceStore.getState();

    const transformedBranches = data.map((branch) => ({
      id: branch.id,
      name: branch.name,
      location: typeof branch.location === "string" ? branch.location : JSON.stringify(branch.location),
      location_text: branch.location_text,
      franchise_id: branch.franchise_id,
      franchise: franchises.find((f) => f.id === branch.franchise_id)?.name ?? "N/A",
      services: services.filter((s) => s.branch_id === branch.id),
      activeBookings: branch.active_bookings,
      createdAt: new Date(branch.created_at),
    }));

    set({ branches: transformedBranches });
  },
  addBranch: async (branch) => {
    const { data, error } = await supabase
      .from("branches")
      .insert([
        {
          name: branch.name,
          franchise_id: branch.franchise_id,
          location: branch.location,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding branch:", error);
      throw error;
    }

    await get().fetchBranches();

    // Return the created branch
    return data?.[0] ? { id: data[0].id, ...branch } : null;
  },
  updateBranch: async (branch) => {
    const { data, error } = await supabase
      .from("branches")
      .update({
        name: branch.name,
        franchise_id: branch.franchise_id,
        location: branch.location,
      })
      .eq("id", branch.id)
      .select();

    if (error) {
      console.error("Error updating branch:", error);
      return;
    }

    await get().fetchBranches();
  },
  deleteBranch: async (id) => {
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) {
      console.error("Error deleting branch:", error);
      return;
    }
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    }));
  },
}));
