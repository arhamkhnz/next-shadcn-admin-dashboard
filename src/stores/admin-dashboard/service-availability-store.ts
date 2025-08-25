import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { ServiceAvailability } from "@/types/database";

const supabase = createClient();

type ServiceAvailabilityState = {
  availability: ServiceAvailability[];
  fetchAvailabilityForService: (serviceId: string) => Promise<void>;
  addAvailability: (availability: Omit<ServiceAvailability, "id" | "createdAt">) => Promise<void>;
  updateAvailability: (availability: ServiceAvailability) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
  clearAvailability: () => void;
};

export const useServiceAvailabilityStore = create<ServiceAvailabilityState>((set, get) => ({
  availability: [],
  fetchAvailabilityForService: async (serviceId: string) => {
    const { data, error } = await supabase
      .from("service_availability")
      .select("*")
      .eq("service_id", serviceId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching service availability:", error);
      return;
    }

    const transformedAvailability = data.map((item) => ({
      id: item.id,
      serviceId: item.service_id,
      dayOfWeek: item.day_of_week,
      startTime: item.start_time,
      endTime: item.end_time,
      isActive: item.is_active,
      createdAt: new Date(item.created_at),
    }));

    set({ availability: transformedAvailability });
  },
  addAvailability: async (availability) => {
    const { data, error } = await supabase
      .from("service_availability")
      .insert([
        {
          service_id: availability.serviceId,
          day_of_week: availability.dayOfWeek,
          start_time: availability.startTime,
          end_time: availability.endTime,
          is_active: availability.isActive,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding service availability:", error);
      throw error;
    }

    const newAvailability = {
      id: data.id,
      serviceId: data.service_id,
      dayOfWeek: data.day_of_week,
      startTime: data.start_time,
      endTime: data.end_time,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
    };

    set((state) => ({ availability: [...state.availability, newAvailability] }));
  },
  updateAvailability: async (availability) => {
    const { error } = await supabase
      .from("service_availability")
      .update({
        service_id: availability.serviceId,
        day_of_week: availability.dayOfWeek,
        start_time: availability.startTime,
        end_time: availability.endTime,
        is_active: availability.isActive,
      })
      .eq("id", availability.id);

    if (error) {
      console.error("Error updating service availability:", error);
      throw error;
    }

    set((state) => ({
      availability: state.availability.map((item) => (item.id === availability.id ? availability : item)),
    }));
  },
  deleteAvailability: async (id: string) => {
    const { error } = await supabase.from("service_availability").delete().eq("id", id);

    if (error) {
      console.error("Error deleting service availability:", error);
      throw error;
    }

    set((state) => ({ availability: state.availability.filter((item) => item.id !== id) }));
  },
  clearAvailability: () => {
    set({ availability: [] });
  },
}));
