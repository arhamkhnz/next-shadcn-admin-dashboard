import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { Database } from "@/types/database";

export type Service = Database["public"]["Tables"]["services"]["Row"];

type ServiceState = {
  services: Service[];
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, "id" | "created_at">) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
};

const supabase = createClientComponentClient<Database>();

export const useFranchiseServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  fetchServices: async () => {
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
      console.error("Error fetching branches for services:", branchesError);
      return;
    }

    const branchIds = branches.map((branch) => branch.id);

    if (branchIds.length === 0) {
      set({ services: [] });
      return;
    }

    // Then get services for those branches
    const { data, error } = await supabase.from("services").select("*").in("branch_id", branchIds);

    if (error) {
      console.error("Error fetching services:", error);
      return;
    }
    set({ services: data });
  },
  addService: async (service) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the branch belongs to this franchise
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError || !branch) {
      throw new Error("Branch does not belong to this franchise");
    }

    const { data, error } = await supabase.from("services").insert(service).select().single();
    if (error) {
      console.error("Error adding service:", error);
      throw error;
    }
    set({ services: [...get().services, data] });
  },
  updateService: async (service) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the service belongs to a branch in this franchise
    const { data: serviceBranch, error: branchError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", service.id)
      .single();

    if (branchError || !serviceBranch) {
      throw new Error("Service not found");
    }

    const { data: branch, error: franchiseError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", serviceBranch.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (franchiseError || !branch) {
      throw new Error("Service does not belong to this franchise");
    }

    const { data, error } = await supabase.from("services").update(service).eq("id", service.id).select().single();
    if (error) {
      console.error("Error updating service:", error);
      throw error;
    }
    set({
      services: get().services.map((s) => (s.id === data.id ? data : s)),
    });
  },
  deleteService: async (id) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the service belongs to a branch in this franchise
    const { data: serviceBranch, error: branchError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", id)
      .single();

    if (branchError || !serviceBranch) {
      throw new Error("Service not found");
    }

    const { data: branch, error: franchiseError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", serviceBranch.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (franchiseError || !branch) {
      throw new Error("Service does not belong to this franchise");
    }

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
    set({ services: get().services.filter((s) => s.id !== id) });
  },
}));
