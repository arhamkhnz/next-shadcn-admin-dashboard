import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";

// Define a more specific type for the washer that includes the nested branch name
export type WasherWithBranch = {
  id: string;
  name: string;
  branch_id: string;
  status: "active" | "inactive";
  rating: number;
  created_at: string;
  branches: {
    id: string;
    name: string;
  } | null;
};

type UserState = {
  washers: WasherWithBranch[];
  fetchWashers: () => Promise<void>;
  addWasher: (washer: Omit<WasherWithBranch, "id" | "created_at" | "branches">) => Promise<void>;
  // Correct the type definition to accept the object the form provides
  updateWasher: (washer: WasherWithBranch) => Promise<void>;
  deleteWasher: (id: string) => Promise<void>;
};

const supabase = createClientComponentClient();

export const useFranchiseUserStore = create<UserState>((set, get) => ({
  washers: [],
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
      throw branchesError;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ washers: [] });
      return;
    }

    // Then get washers for those branches
    const { data, error } = await supabase.from("washers").select("*, branches(id, name)").in("branch_id", branchIds);

    if (error) {
      console.error("Error fetching washers:", error);
      throw error;
    }
    set({ washers: data });
  },
  addWasher: async (washer) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the branch belongs to this franchise
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", washer.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Branch does not belong to this franchise");
    }

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
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the washer belongs to a branch in this franchise
    const { data: washerBranch, error: branchError } = await supabase
      .from("washers")
      .select("branch_id")
      .eq("id", washer.id)
      .single();

    if (branchError ?? !washerBranch) {
      throw new Error("Washer not found");
    }

    const { data: branch, error: franchiseError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", washerBranch.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (franchiseError ?? !branch) {
      throw new Error("Washer does not belong to this franchise");
    }

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
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the washer belongs to a branch in this franchise
    const { data: washerBranch, error: branchError } = await supabase
      .from("washers")
      .select("branch_id")
      .eq("id", id)
      .single();

    if (branchError ?? !washerBranch) {
      throw new Error("Washer not found");
    }

    const { data: branch, error: franchiseError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", washerBranch.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (franchiseError ?? !branch) {
      throw new Error("Washer does not belong to this franchise");
    }

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
