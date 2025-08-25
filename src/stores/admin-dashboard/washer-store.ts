import { create } from "zustand";

import { Washer } from "@/app/(main)/admin/washers/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useBranchStore } from "./branch-store";

const supabase = createClient();

type WasherState = {
  washers: Washer[];
  fetchWashers: () => Promise<void>;
  addWasher: (washer: Omit<Washer, "id">) => Promise<void>;
  updateWasher: (washer: Washer) => Promise<void>;
  deleteWasher: (id: string) => Promise<void>;
};

export const useWasherStore = create<WasherState>((set, get) => ({
  washers: [],
  fetchWashers: async () => {
    const { data, error } = await supabase.from("washers").select("*");
    if (error) {
      console.error("Error fetching washers:", error);
      return;
    }
    const { branches } = useBranchStore.getState();
    const transformedWashers = data.map((washer) => ({
      id: washer.id,
      name: washer.name,
      branch_id: washer.branch_id,
      branch: branches.find((b) => b.id === washer.branch_id)?.name ?? "N/A",
      status: washer.status,
      rating: Number(washer.rating),
    }));
    set({ washers: transformedWashers as Washer[] });
  },
  addWasher: async (washer) => {
    const { data, error } = await supabase
      .from("washers")
      .insert([{ name: washer.name, branch_id: washer.branch, status: washer.status, rating: washer.rating }])
      .select();

    if (error) {
      console.error("Error adding washer:", error);
      throw error;
    }

    await get().fetchWashers();
  },
  updateWasher: async (washer) => {
    const { error } = await supabase
      .from("washers")
      .update({ name: washer.name, branch_id: washer.branch, status: washer.status, rating: washer.rating })
      .eq("id", washer.id);

    if (error) {
      console.error("Error updating washer:", error);
      return;
    }

    await get().fetchWashers();
  },
  deleteWasher: async (id) => {
    const { error } = await supabase.from("washers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting washer:", error);
      return;
    }
    set((state) => ({ washers: state.washers.filter((w) => w.id !== id) }));
  },
}));
