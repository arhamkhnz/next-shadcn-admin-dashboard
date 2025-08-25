import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

import { Promotion } from "@/types/database";

const supabase = createClientComponentClient();

type PromotionState = {
  promotions: Promotion[];
  fetchPromotions: () => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, "id">) => Promise<void>;
  updatePromotion: (promotion: Promotion) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
};

export const usePromotionStore = create<PromotionState>((set, get) => ({
  promotions: [],
  fetchPromotions: async () => {
    const { data, error } = await supabase.from("promotions").select("*");
    if (error) {
      console.error("Error fetching promotions:", error);
      return;
    }
    const promotions = data.map((item) => ({
      id: item.id,
      code: item.code,
      discount: item.discount,
      startDate: item.start_date,
      endDate: item.end_date,
      active: item.active,
    }));
    set({ promotions });
  },
  addPromotion: async (promotion) => {
    const { data, error } = await supabase
      .from("promotions")
      .insert({
        code: promotion.code,
        discount: promotion.discount,
        start_date: promotion.startDate,
        end_date: promotion.endDate,
        active: promotion.active,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding promotion:", error);
      throw new Error("Failed to add promotion: " + error.message);
    }

    const newPromotion = {
      id: data.id,
      code: data.code,
      discount: data.discount,
      startDate: data.start_date,
      endDate: data.end_date,
      active: data.active,
    };

    set((state) => ({
      promotions: [...state.promotions, newPromotion],
    }));
  },
  updatePromotion: async (updatedPromotion) => {
    const { data, error } = await supabase
      .from("promotions")
      .update({
        code: updatedPromotion.code,
        discount: updatedPromotion.discount,
        start_date: updatedPromotion.startDate,
        end_date: updatedPromotion.endDate,
        active: updatedPromotion.active,
      })
      .eq("id", updatedPromotion.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating promotion:", error);
      throw new Error("Failed to update promotion: " + error.message);
    }

    const promotion = {
      id: data.id,
      code: data.code,
      discount: data.discount,
      startDate: data.start_date,
      endDate: data.end_date,
      active: data.active,
    };

    set((state) => ({
      promotions: state.promotions.map((promo) => (promo.id === updatedPromotion.id ? promotion : promo)),
    }));
  },
  deletePromotion: async (id) => {
    const { error } = await supabase.from("promotions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting promotion:", error);
      throw new Error("Failed to delete promotion: " + error.message);
    }

    set((state) => ({
      promotions: state.promotions.filter((promo) => promo.id !== id),
    }));
  },
}));
