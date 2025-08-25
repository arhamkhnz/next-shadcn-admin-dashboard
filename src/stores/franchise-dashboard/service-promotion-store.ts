import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { getCurrentUserFranchiseId } from "@/server/server-actions";

// Define the ServicePromotion type directly
export type ServicePromotion = {
  id: string;
  serviceId: string;
  promotionId: string;
  createdAt: Date;
};

const supabase = createClientComponentClient();

type ServicePromotionState = {
  servicePromotions: ServicePromotion[];
  fetchServicePromotions: (serviceId: string) => Promise<void>;
  addServicePromotion: (serviceId: string, promotionId: string) => Promise<void>;
  removeServicePromotion: (id: string) => Promise<void>;
};

export const useServicePromotionStore = create<ServicePromotionState>((set, get) => ({
  servicePromotions: [],
  fetchServicePromotions: async (serviceId: string) => {
    const { data, error } = await supabase.from("service_promotions").select("*").eq("service_id", serviceId);

    if (error) {
      console.error("Error fetching service promotions:", error);
      return;
    }

    const servicePromotions = data.map((item) => ({
      id: item.id,
      serviceId: item.service_id,
      promotionId: item.promotion_id,
      createdAt: new Date(item.created_at),
    }));

    set({ servicePromotions });
  },
  addServicePromotion: async (serviceId: string, promotionId: string) => {
    // Verify that the service belongs to this franchise
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Verify that the service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", serviceId)
      .single();

    if (serviceError ?? !service) {
      throw new Error("Service not found");
    }

    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Service does not belong to this franchise");
    }

    // Check if this promotion is already associated with this service
    const { data: existing, error: existingError } = await supabase
      .from("service_promotions")
      .select("id")
      .eq("service_id", serviceId)
      .eq("promotion_id", promotionId)
      .single();

    if (existing && !existingError) {
      throw new Error("This promotion is already associated with the service");
    }

    // Add the service promotion
    const { data, error } = await supabase
      .from("service_promotions")
      .insert({
        service_id: serviceId,
        promotion_id: promotionId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding service promotion:", error);
      throw new Error("Failed to add promotion to service: " + error.message);
    }

    const newServicePromotion = {
      id: data.id,
      serviceId: data.service_id,
      promotionId: data.promotion_id,
      createdAt: new Date(data.created_at),
    };

    set((state) => ({
      servicePromotions: [...state.servicePromotions, newServicePromotion],
    }));
  },
  removeServicePromotion: async (id: string) => {
    // Verify that the service promotion belongs to this franchise
    const franchiseId = await getCurrentUserFranchiseId();
    if (!franchiseId) {
      throw new Error("Franchise ID not found for current user");
    }

    // Get the service promotion
    const { data: servicePromotion, error: spError } = await supabase
      .from("service_promotions")
      .select("service_id")
      .eq("id", id)
      .single();

    if (spError ?? !servicePromotion) {
      throw new Error("Service promotion not found");
    }

    // Verify that the service belongs to a branch in this franchise
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("branch_id")
      .eq("id", servicePromotion.service_id)
      .single();

    if (serviceError ?? !service) {
      throw new Error("Service not found");
    }

    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id")
      .eq("id", service.branch_id)
      .eq("franchise_id", franchiseId)
      .single();

    if (branchError ?? !branch) {
      throw new Error("Service does not belong to this franchise");
    }

    // Remove the service promotion
    const { error } = await supabase.from("service_promotions").delete().eq("id", id);

    if (error) {
      console.error("Error removing service promotion:", error);
      throw new Error("Failed to remove promotion from service: " + error.message);
    }

    set((state) => ({
      servicePromotions: state.servicePromotions.filter((sp) => sp.id !== id),
    }));
  },
}));
