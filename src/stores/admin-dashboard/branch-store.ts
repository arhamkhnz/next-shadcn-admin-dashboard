import { create } from "zustand";

import { Branch } from "@/app/(main)/admin/branches/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useFranchiseStore } from "./franchise-store";

const supabase = createClient();

type BranchState = {
  branches: Branch[];
  fetchBranches: () => Promise<void>;
  addBranch: (branch: Omit<Branch, "id" | "createdAt" | "franchiseName">) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
};

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  fetchBranches: async () => {
    const { data, error } = await supabase.from("branches").select("*");
    if (error) {
      console.error("Error fetching branches:", error);
      return;
    }

    const { franchises } = useFranchiseStore.getState();
    const transformedBranches = data.map((branch) => ({
      id: branch.id,
      name: branch.name,
      location: typeof branch.location === "string" ? branch.location : JSON.stringify(branch.location),
      // franchiseId: branch.franchise_id,
      franchise_id: branch.franchise_id,
      franchise: franchises.find((f) => f.id === branch.franchise_id)?.name ?? "N/A",
      services: branch.services,
      activeBookings: branch.active_bookings,
      createdAt: new Date(branch.created_at),
    }));

    set({ branches: transformedBranches });
  },
  addBranch: async (branch) => {
    await supabase
      .from("branches")
      .insert([{ name: branch.name, franchise_id: branch.franchiseId, location: branch.location }]);
    await get().fetchBranches();
  },
  updateBranch: async (branch) => {
    await supabase
      .from("branches")
      .update({ name: branch.name, franchise_id: branch.franchiseId, location: branch.location })
      .eq("id", branch.id);
    await get().fetchBranches();
  },
  deleteBranch: async (id) => {
    await supabase.from("branches").delete().eq("id", id);
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    }));
  },
}));
