/* eslint-disable import/no-cycle */

import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";

import { useBranchStore } from "./branch-store";

const supabase = createClient();

// Extended service type to include all fields from the database
type ExtendedService = Service & {
  description?: string;
  todos?: string[];
  include?: string[];
  is_global?: boolean;
  pictures?: string[];
};

type ServiceState = {
  services: ExtendedService[];
  fetchServices: () => Promise<void>;
  addService: (service: Omit<ExtendedService, "id" | "branchName" | "createdAt">) => Promise<void>;
  addGlobalService: (service: Omit<ExtendedService, "id" | "branchName" | "createdAt" | "branchId">) => Promise<void>;
  updateService: (service: ExtendedService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  removeService: (id: string) => void; // For local updates
};

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  fetchServices: async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error fetching services:", error);
      return;
    }
    const { branches } = useBranchStore.getState();
    const transformedServices = data.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      duration_min: service.duration_min,
      description: service.description,
      todos: service.todos,
      include: service.include,
      branchId: service.branch_id,
      branchName: branches.find((b) => b.id === service.branch_id)?.name ?? "N/A",
      createdAt: new Date(service.created_at),
      is_global: service.is_global ?? false,
      pictures: service.pictures,
    }));
    set({ services: transformedServices as any[] });
  },
  addService: async (service) => {
    // If it's a global service, create it for all branches
    if (service.is_global) {
      // First get all branches
      const { branches } = useBranchStore.getState();
      // Create the service for each branch
      const servicePromises = branches.map((branch) =>
        supabase.from("services").insert([
          {
            ...service,
            branch_id: branch.id,
            is_global: true,
            pictures: service.pictures,
          },
        ]),
      );
      await Promise.all(servicePromises);
    } else {
      // Regular branch-specific service
      await supabase.from("services").insert([
        {
          ...service,
          branch_id: service.branchId,
          is_global: false,
          pictures: service.pictures,
        },
      ]);
    }
    await get().fetchServices();
  },
  addGlobalService: async (service) => {
    // Get all branches to create the service for each
    const { branches } = useBranchStore.getState();
    if (branches.length === 0) {
      console.warn("No branches found, cannot create global service");
      return;
    }

    // Create the service for each branch
    const servicePromises = branches.map((branch) =>
      supabase.from("services").insert([
        {
          ...service,
          branch_id: branch.id,
          is_global: true,
          pictures: service.pictures,
        },
      ]),
    );
    await Promise.all(servicePromises);
    await get().fetchServices();
  },
  updateService: async (service) => {
    // If it's a global service, we need to update all instances
    if (service.is_global) {
      // Get all services with the same name (as a way to identify global service instances)
      const { data: servicesToUpdate, error } = await supabase
        .from("services")
        .select("id")
        .eq("name", service.name)
        .eq("is_global", true);

      if (error) {
        console.error("Error finding global services to update:", error);
        return;
      }

      // Update all instances of this global service
      const updatePromises = servicesToUpdate.map((s) =>
        supabase
          .from("services")
          .update({
            name: service.name,
            description: service.description,
            price: service.price,
            duration_min: service.duration_min,
            todos: service.todos,
            include: service.include,
            is_global: true,
            pictures: service.pictures,
          })
          .eq("id", s.id),
      );
      await Promise.all(updatePromises);
    } else {
      // Regular branch-specific service update
      await supabase
        .from("services")
        .update({
          name: service.name,
          description: service.description,
          price: service.price,
          duration_min: service.duration_min,
          todos: service.todos,
          include: service.include,
          branch_id: service.branchId,
          is_global: false,
          pictures: service.pictures,
        })
        .eq("id", service.id);
    }
    await get().fetchServices();
  },
  deleteService: async (id) => {
    // Check if this is a global service
    const serviceToDelete = get().services.find((s) => s.id === id);

    if (serviceToDelete?.is_global) {
      // Delete all instances of this global service
      const { data: servicesToDelete, error } = await supabase
        .from("services")
        .select("id")
        .eq("name", serviceToDelete.name)
        .eq("is_global", true);

      if (error) {
        console.error("Error finding global services to delete:", error);
        return;
      }

      // Delete all instances
      const deletePromises = servicesToDelete.map((s) => supabase.from("services").delete().eq("id", s.id));
      await Promise.all(deletePromises);
    } else {
      // Regular branch-specific service deletion
      await supabase.from("services").delete().eq("id", id);
    }
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
  },
  removeService: (id) => {
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
  },
}));
