import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type FranchiseUser = {
  id: string;
  name: string;
  phone?: string;
  created_at?: string;
};

export type FranchiseUserState = {
  users: FranchiseUser[];
  fetchUsers: () => Promise<void>;
};

export const useFranchiseUserStore = create<FranchiseUserState>((set, get) => ({
  users: [],
  fetchUsers: async () => {
    const { data, error } = await supabase.from("users").select("id, name, phone, created_at");
    set({ users: data ?? [] });
  },
}));
