import { create } from "zustand";

import { Franchise } from "@/app/(main)/admin/franchises/_components/types";
import { createClient } from "@/lib/supabase/client";

import { useAdminStore } from "./admin-store";

const supabase = createClient();

// Updated type for addFranchise parameter
type NewFranchise = Omit<Franchise, "id" | "admin_id" | "createdAt" | "adminName"> & {
  adminEmail: string;
  adminPassword: string;
};

type FranchiseState = {
  franchises: Franchise[];
  fetchFranchises: () => Promise<void>;
  addFranchise: (franchise: NewFranchise) => Promise<void>;
  updateFranchise: (franchise: Franchise) => Promise<void>;
  deleteFranchise: (id: string) => Promise<void>;
};

export const useFranchiseStore = create<FranchiseState>((set, get) => ({
  franchises: [],
  fetchFranchises: async () => {
    // Only fetch admins if we don't have them yet
    const { admins } = useAdminStore.getState();
    if (admins.length === 0) {
      await useAdminStore.getState().fetchAdmins();
    }

    const { data, error } = await supabase.from("franchises").select("*");
    if (error) {
      console.error("Error fetching franchises:", error);
      return;
    }

    const { admins: updatedAdmins } = useAdminStore.getState();
    const transformedFranchises = data.map((franchise) => ({
      id: franchise.id,
      admin_id: franchise.admin_id,
      name: franchise.name,
      status: franchise.status,
      branches: franchise.branches,
      washers: franchise.washers,
      createdAt: new Date(franchise.created_at),
      adminName: updatedAdmins.find((a) => a.id === franchise.admin_id)?.name ?? "N/A",
    }));

    set({ franchises: transformedFranchises });
  },
  addFranchise: async (franchise) => {
    try {
      // First, create the admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: franchise.adminEmail,
        password: franchise.adminPassword,
        options: {
          data: {
            name: franchise.name, // Using franchise name as admin name
          },
        },
      });

      if (authError) {
        console.error("Error creating admin user:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create admin user");
      }

      // Then, create the admin record in the admins table
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .insert([
          {
            id: authData.user.id,
            name: franchise.name,
            email: franchise.adminEmail,
          },
        ])
        .select();

      if (adminError) {
        console.error("Error creating admin record:", adminError);
        throw adminError;
      }

      // Finally, create the franchise record
      const { data: franchiseData, error: franchiseError } = await supabase
        .from("franchises")
        .insert([
          {
            name: franchise.name,
            status: franchise.status,
            branches: franchise.branches,
            washers: franchise.washers,
            admin_id: authData.user.id,
          },
        ])
        .select();

      if (franchiseError) {
        console.error("Error adding franchise:", franchiseError);
        throw franchiseError;
      }

      await get().fetchFranchises(); // Refetch to get the transformed data
    } catch (error) {
      console.error("Error in addFranchise:", error);
      throw error;
    }
  },
  updateFranchise: async (franchise) => {
    const { data, error } = await supabase
      .from("franchises")
      .update({
        name: franchise.name,
        status: franchise.status,
        branches: franchise.branches,
        washers: franchise.washers,
      })
      .eq("id", franchise.id)
      .select();

    if (error) {
      console.error("Error updating franchise:", error);
      return;
    }
    await get().fetchFranchises(); // Refetch to ensure consistency
  },
  deleteFranchise: async (id) => {
    const { error } = await supabase.from("franchises").delete().eq("id", id);
    if (error) {
      console.error("Error deleting franchise:", error);
      return;
    }
    set((state) => ({
      franchises: state.franchises.filter((franchise) => franchise.id !== id),
    }));
  },
}));
