import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Promotion } from "@/types/database";

const supabase = createClient();

type PromotionState = {
  promotions: Promotion[];
  fetchPromotions: () => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  updatePromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
};

export const usePromotionStore = create<PromotionState>((set) => ({
  promotions: [],
  fetchPromotions: async () => {
    const { data, error } = await supabase.from("promotions").select("*");
    if (error) {
      console.error("Error fetching promotions:", error);
      return;
    }
    set({ promotions: data as Promotion[] });
  },
  // TODO: implement supabase mutation
  addPromotion: (promotion) =>
    set((state) => ({
      promotions: [...state.promotions, { ...promotion, id: `${state.promotions.length + 1}` }],
    })),
  // TODO: implement supabase mutation
  updatePromotion: (updatedPromotion) =>
    set((state) => ({
      promotions: state.promotions.map((promo) => (promo.id === updatedPromotion.id ? updatedPromotion : promo)),
    })),
  // TODO: implement supabase mutation
  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((promo) => promo.id !== id),
    })),
}));
