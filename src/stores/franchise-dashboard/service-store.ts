import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type FranchiseService = {
  id: string;
  branch_id: string;
  name: string;
  price: number;
  duration_min: number;
};

export type FranchiseServiceState = {
  services: FranchiseService[];
  fetchServices: () => Promise<void>;
};

export const useFranchiseServiceStore = create<FranchiseServiceState>((set, get) => ({
  services: [],
  fetchServices: async () => {
    const { data, error } = await supabase.from("services").select("id, branch_id, name, price, duration_min");
    set({ services: data ?? [] });
  },
}));
