import { create } from "zustand";

import { User } from "@/app/(main)/admin/users/_components/types";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type UserState = {
  users: User[];
  fetchUsers: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  fetchUsers: async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    const transformedUsers = data.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      cars: user.cars,
      bookings: user.bookings,
      totalWashes: user.total_washes,
      createdAt: new Date(user.created_at),
    }));
    set({ users: transformedUsers as any[] }); // Cast to any to avoid type conflicts from other files
  },
  updateUser: async (user) => {
    await supabase.from("users").update({ name: user.name, phone: user.phone }).eq("id", user.id);
    await get().fetchUsers();
  },
  deleteUser: async (id) => {
    await supabase.from("users").delete().eq("id", id);
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },
}));
