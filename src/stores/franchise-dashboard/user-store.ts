import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { Database } from "@/types/database";

// Define a more specific type for the washer that includes the nested branch name
export type WasherWithBranch = Database["public"]["Tables"]["washers"]["Row"] & {
  branches: {
    id: string;
    name: string;
  } | null;
};

type UserState = {
  washers: WasherWithBranch[];
  fetchWashers: () => Promise<void>;
  addWasher: (washer: Omit<Database["public"]["Tables"]["washers"]["Row"], "id" | "created_at">) => Promise<void>;
  // Correct the type definition to accept the object the form provides
  updateWasher: (washer: WasherWithBranch) => Promise<void>;
  deleteWasher: (id: string) => Promise<void>;
};

const supabase = createClientComponentClient<Database>();

export const useFranchiseUserStore = create<UserState>((set, get) => ({
  washers: [],
  fetchWashers: async () => {
    const { data, error } = await supabase.from("washers").select("*, branches(id, name)");

    if (error) {
      console.error("Error fetching washers:", error);
      throw error;
    }
    set({ washers: data });
  },
  addWasher: async (washer) => {
    const washerData = {
      ...washer,
      id: crypto.randomUUID(),
    };
    const { error } = await supabase.from("washers").insert(washerData);
    if (error) {
      console.error("Error adding washer:", error);
      throw error;
    }
    await get().fetchWashers();
  },
  updateWasher: async (washer) => {
    // Exclude the nested 'branches' object before sending the update
    const { ...updateData } = washer;

    const { error } = await supabase.from("washers").update(updateData).eq("id", washer.id);

    if (error) {
      console.error("Error updating washer:", error);
      throw error;
    }
    await get().fetchWashers();
  },
  deleteWasher: async (id) => {
    const { error } = await supabase.from("washers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting washer:", error);
      throw error;
    }
    set((state) => ({
      washers: state.washers.filter((w) => w.id !== id),
    }));
  },
}));
