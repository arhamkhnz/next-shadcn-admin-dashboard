import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type FranchiseBranch = {
  id: string;
  name: string;
  location: string;
  franchise_id: string;
  created_at?: string;
};

export type FranchiseBranchState = {
  branches: FranchiseBranch[];
  fetchBranches: () => Promise<void>;
};

export const useFranchiseBranchStore = create<FranchiseBranchState>((set, get) => ({
  branches: [],
  fetchBranches: async () => {
    const { data, error } = await supabase.from("branches").select("id, name, location, franchise_id, created_at");
    set({ branches: data ?? [] });
  },
}));
