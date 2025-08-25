/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable complexity */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";

export type Service = {
  id: string;
  branchId?: string;
  name: string;
  price: number;
  duration_min: number;
  description?: string;
  todos?: string[];
  include?: string[];
  is_global?: boolean;
  created_at?: string;
  pictures?: string[];
};

type ServiceState = {
  services: Service[];
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, "id" | "created_at">) => Promise<void>;
  addGlobalService: (service: Omit<Service, "id" | "created_at" | "branch_id">) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
};

const supabase = createClientComponentClient();

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

    // Then get services for those branches (including global services)
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .or(`branch_id.in.(${branchIds.join(",")}),is_global.eq.true`);

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
      .eq("id", service.branchId)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Branch does not belong to this franchise");
    }

    const { data, error } = await supabase.from("services").insert(service).select().single();
    if (error) {
      console.error("Error adding service:", error);
      throw error;
    }
    set({ services: [...get().services, data] });
  },
  addGlobalService: async (service) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Get all branches for this franchise
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id")
      .eq("franchise_id", franchiseId);

    if (branchesError) {
      throw new Error("Error fetching branches for franchise");
    }

    if (branches.length === 0) {
      throw new Error("No branches found for this franchise");
    }

    // Create the service for each branch with is_global = true
    const servicePromises = branches.map((branch) =>
      supabase
        .from("services")
        .insert({
          ...service,
          branch_id: branch.id,
          is_global: true,
        })
        .select()
        .single(),
    );

    const results = await Promise.all(servicePromises);

    // Check for errors
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error("Error adding global service:", errors);
      throw new Error("Error creating global service for all branches");
    }

    // Get all services to update the store
    await get().fetchServices();
  },
  updateService: async (service) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the service belongs to a branch in this franchise
    const { data: serviceBranch, error: branchError } = await supabase
      .from("services")
      .select("branch_id, is_global")
      .eq("id", service.id)
      .single();

    if (branchError ?? !serviceBranch) {
      throw new Error("Service not found");
    }

    // If it's a global service, we need to update all instances
    if (serviceBranch.is_global) {
      // For global services, we only allow price customization per branch
      // Get the existing service to preserve other fields
      const { data: existingService, error: fetchError } = await supabase
        .from("services")
        .select("*")
        .eq("id", service.id)
        .single();

      if (fetchError) {
        throw new Error("Error fetching existing global service: " + fetchError.message);
      }

      // Only update the price for this specific branch instance
      const { error } = await supabase
        .from("services")
        .update({
          price: service.price,
        })
        .eq("id", service.id);

      if (error) {
        throw new Error("Error updating global service price: " + error.message);
      }
    } else {
      // Regular branch-specific service
      const { data: branch, error: franchiseError } = await supabase
        .from("branches")
        .select("id")
        .eq("id", serviceBranch.branch_id)
        .eq("franchise_id", franchiseId)
        .single();

      if (franchiseError ?? !branch) {
        throw new Error("Service does not belong to this franchise");
      }

      const { error } = await supabase.from("services").update(service).eq("id", service.id);
      if (error) {
        console.error("Error updating service:", error);
        throw new Error("Failed to update service: " + error.message);
      }
    }

    // Get all services to update the store
    await get().fetchServices();
  },
  deleteService: async (id) => {
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id, is_global, name")
      .eq("id", id)
      .single();

    if (serviceError ?? !service) {
      throw new Error("Service not found");
    }

    // If it's a global service, we need to delete all instances
    if (service.is_global) {
      // Get all services with the same name that are global
      const { data: servicesToDelete, error: fetchError } = await supabase
        .from("services")
        .select("id")
        .eq("name", service.name)
        .eq("is_global", true);

      if (fetchError) {
        throw new Error("Error finding global services to delete: " + fetchError.message);
      }

      // Delete all instances
      const deletePromises = servicesToDelete.map((s) => supabase.from("services").delete().eq("id", s.id));

      const results = await Promise.all(deletePromises);
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error("Error deleting global service instances: " + (errors[0].error?.message ?? "Unknown error"));
      }
    } else {
      // Regular branch-specific service
      const { data: branch, error: franchiseError } = await supabase
        .from("branches")
        .select("id")
        .eq("id", service.branch_id)
        .eq("franchise_id", franchiseId)
        .single();

      if (franchiseError ?? !branch) {
        throw new Error("Service does not belong to this franchise");
      }

      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) {
        console.error("Error deleting service:", error);
        throw error;
      }
    }

    // Get all services to update the store
    await get().fetchServices();
  },
}));
