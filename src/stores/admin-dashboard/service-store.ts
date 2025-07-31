import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";

import { useBranchStore } from "./branch-store";

const supabase = createClient();

type ServiceState = {
  services: Service[];
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, "id" | "branchName" | "createdAt">) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
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
      branchId: service.branch_id,
      branchName: branches.find((b) => b.id === service.branch_id)?.name ?? "N/A",
      createdAt: new Date(service.created_at),
    }));
    set({ services: transformedServices as any[] });
  },
  addService: async (service) => {
    await supabase.from("services").insert([{ ...service, branch_id: service.branchId }]);
    await get().fetchServices();
  },
  updateService: async (service) => {
    await supabase
      .from("services")
      .update({ ...service, branch_id: service.branchId })
      .eq("id", service.id);
    await get().fetchServices();
  },
  deleteService: async (id) => {
    await supabase.from("services").delete().eq("id", id);
    set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
  },
}));
