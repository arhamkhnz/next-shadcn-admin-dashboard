import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

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
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error fetching services:", error);
      return;
    }
    set({ services: data });
  },
  addService: async (service) => {
    const { data, error } = await supabase.from("services").insert(service).select().single();
    if (error) {
      console.error("Error adding service:", error);
      return;
    }
    set({ services: [...get().services, data] });
  },
  updateService: async (service) => {
    const { data, error } = await supabase.from("services").update(service).eq("id", service.id).select().single();
    if (error) {
      console.error("Error updating service:", error);
      return;
    }
    set({
      services: get().services.map((s) => (s.id === data.id ? data : s)),
    });
  },
  deleteService: async (id) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Error deleting service:", error);
      return;
    }
    set({ services: get().services.filter((s) => s.id !== id) });
  },
}));
