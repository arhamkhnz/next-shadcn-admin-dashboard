import { create } from "zustand";

import { Washer } from "@/app/(main)/admin/washers/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useBranchStore } from "./branch-store";

const supabase = createClient();

type WasherState = {
  washers: Washer[];
  fetchWashers: () => Promise<void>;
  addWasher: (washer: Omit<Washer, "id" | "branchName" | "createdAt">) => Promise<void>;
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
      branch: branches.find((b) => b.id === washer.branch_id)?.name ?? "N/A",
      status: washer.status,
      rating: Number(washer.rating),
    }));
    set({ washers: transformedWashers as Washer[] });
  },
  addWasher: async (washer) => {
    await supabase.from("washers").insert([{ ...washer, branch_id: washer.branchId }]);
    await get().fetchWashers();
  },
  updateWasher: async (washer) => {
    await supabase
      .from("washers")
      .update({ ...washer, branch_id: washer.branchId })
      .eq("id", washer.id);
    await get().fetchWashers();
  },
  deleteWasher: async (id) => {
    await supabase.from("washers").delete().eq("id", id);
    set((state) => ({ washers: state.washers.filter((w) => w.id !== id) }));
  },
}));
