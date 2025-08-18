import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type Admin = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
};

type AdminState = {
  admins: Admin[];
  fetchAdmins: () => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  admins: [],
  fetchAdmins: async () => {
    // Prevent unnecessary fetches if we already have admins
    if (get().admins.length > 0) {
      return;
    }

    const { data, error } = await supabase.from("admins").select("*");
    if (error) {
      console.error("Error fetching admins:", error);
      return;
    }
    const transformedAdmins = data.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: new Date(admin.created_at),
    }));
    set({ admins: transformedAdmins });
  },
}));
