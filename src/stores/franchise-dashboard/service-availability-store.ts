import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { ServiceAvailability } from "@/types/database";

const supabase = createClientComponentClient();

type ServiceAvailabilityState = {
  availability: ServiceAvailability[];
  fetchAvailabilityForService: (serviceId: string) => Promise<void>;
  addAvailability: (availability: Omit<ServiceAvailability, "id" | "createdAt">) => Promise<void>;
  updateAvailability: (availability: ServiceAvailability) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
  clearAvailability: () => void;
};

export const useFranchiseServiceAvailabilityStore = create<ServiceAvailabilityState>((set, get) => ({
  availability: [],
  fetchAvailabilityForService: async (serviceId: string) => {
    // First verify that the service belongs to this franchise
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Check if service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", serviceId)
      .single();

    if (serviceError ?? !service) {
      console.error("Service not found:", serviceError);
      return;
    }

    // Verify branch belongs to this franchise
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      console.error("Service does not belong to this franchise");
      return;
    }

    // Fetch availability
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
    // Verify that the service belongs to this franchise
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Check if service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", availability.serviceId)
      .single();

    if (serviceError ?? !service) {
      throw new Error("Service not found");
    }

    // Verify branch belongs to this franchise
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Service does not belong to this franchise");
    }

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
    // Verify that the availability item belongs to this franchise
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Check if availability belongs to a service in this franchise
    const { data: serviceAvailability, error: availabilityError } = await supabase
      .from("service_availability")
      .select("service_id")
      .eq("id", availability.id)
      .single();

    if (availabilityError ?? !serviceAvailability) {
      throw new Error("Service availability not found");
    }

    // Check if service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", serviceAvailability.service_id)
      .single();

    if (serviceError ?? !service) {
      throw new Error("Service not found");
    }

    // Verify branch belongs to this franchise
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Service does not belong to this franchise");
    }

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
    // Verify that the availability item belongs to this franchise
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Check if availability belongs to a service in this franchise
    const { data: serviceAvailability, error: availabilityError } = await supabase
      .from("service_availability")
      .select("service_id")
      .eq("id", id)
      .single();

    if (availabilityError ?? !serviceAvailability) {
      throw new Error("Service availability not found");
    }

    // Check if service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", serviceAvailability.service_id)
      .single();

    if (serviceError ?? !service) {
      throw new Error("Service not found");
    }

    // Verify branch belongs to this franchise
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Service does not belong to this franchise");
    }

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
