import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { Database } from "@/types/database";

export type Branch = Database["public"]["Tables"]["branches"]["Row"] & {
  services: { id: string; name: string }[];
};

type BranchUpdatePayload = Omit<Branch, "created_at" | "services"> & {
  service_ids?: string[];
};

type BranchState = {
  branches: Branch[];
  fetchBranches: () => Promise<void>;
  addBranch: (
    branch: Omit<Branch, "id" | "created_at" | "services" | "location" | "active_bookings" | "services"> & {
      location: string;
    },
  ) => Promise<void>;
  updateBranch: (branch: BranchUpdatePayload) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
};

const supabase = createClientComponentClient<Database>();

export const useFranchiseBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  fetchBranches: async () => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    const { data, error } = await supabase
      .from("branches")
      .select("*, services(*), location_text:location::text")
      .eq("franchise_id", franchiseId);

    if (error) {
      console.error("Error fetching branches:", error);
      return;
    }
    set({ branches: data as any[] });
  },
  addBranch: async (branch) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    const { data, error } = await supabase
      .from("branches")
      .insert({ ...branch, franchise_id: franchiseId })
      .select()
      .single();

    if (error) {
      console.error("Error adding branch:", error);
      throw error;
    }
    await get().fetchBranches();
  },
  updateBranch: async (branch) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    const { error } = await supabase
      .from("branches")
      .update({ name: branch.name, location: branch.location })
      .eq("id", branch.id)
      .eq("franchise_id", franchiseId); // Ensure franchise ID match for security

    if (error) {
      console.error("Error updating branch:", error);
      throw error;
    }

    // After updating, refetch the specific branch to get its latest state
    const { data: updatedBranch, error: fetchError } = await supabase
      .from("branches")
      .select("*, services(*)")
      .eq("id", branch.id)
      .eq("franchise_id", franchiseId) // Ensure franchise ID match for security
      .single();

    if (fetchError) {
      console.error("Error refetching branch:", fetchError);
      // Even if refetch fails, we can update the local state with what we have
      set((state) => ({
        branches: state.branches.map((b) => (b.id === branch.id ? { ...b, ...branch } : b)),
      }));
      return;
    }

    set((state) => ({
      branches: state.branches.map((b) => (b.id === updatedBranch.id ? (updatedBranch as any) : b)),
    }));
  },
  deleteBranch: async (id) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      console.error("Franchise ID not found for current user");
      return;
    }

    const { error } = await supabase.from("branches").delete().eq("id", id).eq("franchise_id", franchiseId); // Ensure franchise ID match for security

    if (error) {
      console.error("Error deleting branch:", error);
      return;
    }
    set({ branches: get().branches.filter((b) => b.id !== id) });
  },
}));
