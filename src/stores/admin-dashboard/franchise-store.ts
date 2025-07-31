import { create } from "zustand";

import { Franchise } from "@/app/(main)/admin/franchises/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useAdminStore } from "./admin-store";

const supabase = createClient();

type FranchiseState = {
  franchises: Franchise[];
  fetchFranchises: () => Promise<void>;
  addFranchise: (franchise: Omit<Franchise, "id" | "createdAt" | "adminName">) => Promise<void>;
  updateFranchise: (franchise: Franchise) => Promise<void>;
  deleteFranchise: (id: string) => Promise<void>;
};

export const useFranchiseStore = create<FranchiseState>((set, get) => ({
  franchises: [],
  fetchFranchises: async () => {
    const { data, error } = await supabase.from("franchises").select("*");
    if (error) {
      console.error("Error fetching franchises:", error);
      return;
    }

    const { admins } = useAdminStore.getState();
    const transformedFranchises = data.map((franchise) => ({
      id: franchise.id,
      admin_id: franchise.admin_id,
      name: franchise.name,
      status: franchise.status,
      branches: franchise.branches,
      washers: franchise.washers,
      createdAt: new Date(franchise.created_at),
      adminName: admins.find((a) => a.id === franchise.admin_id)?.name ?? "N/A",
    }));

    set({ franchises: transformedFranchises });
  },
  addFranchise: async (franchise) => {
    const { data, error } = await supabase
      .from("franchises")
      .insert([{ name: franchise.name, admin_id: franchise.adminId }])
      .select();

    if (error) {
      console.error("Error adding franchise:", error);
      return;
    }
    await get().fetchFranchises(); // Refetch to get the transformed data
  },
  updateFranchise: async (franchise) => {
    const { data, error } = await supabase
      .from("franchises")
      .update({ name: franchise.name, admin_id: franchise.adminId })
      .eq("id", franchise.id)
      .select();

    if (error) {
      console.error("Error updating franchise:", error);
      return;
    }
    await get().fetchFranchises(); // Refetch to ensure consistency
  },
  deleteFranchise: async (id) => {
    const { error } = await supabase.from("franchises").delete().eq("id", id);
    if (error) {
      console.error("Error deleting franchise:", error);
      return;
    }
    set((state) => ({
      franchises: state.franchises.filter((franchise) => franchise.id !== id),
    }));
  },
}));
