import { create } from "zustand";

import { Promotion } from "@/types/database";

type PromotionState = {
  promotions: Promotion[];
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  updatePromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
};

const initialPromotions: Promotion[] = [
  {
    id: "1",
    code: "SUMMER10",
    discount: 10,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    active: true,
  },
  {
    id: "2",
    code: "FALL20",
    discount: 20,
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-11-30"),
    active: true,
  },
  {
    id: "3",
    code: "WINTER15",
    discount: 15,
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-02-28"),
    active: false,
  },
];

export const usePromotionStore = create<PromotionState>((set) => ({
  promotions: initialPromotions,
  addPromotion: (promotion) =>
    set((state) => ({
      promotions: [...state.promotions, { ...promotion, id: `${state.promotions.length + 1}` }],
    })),
  updatePromotion: (updatedPromotion) =>
    set((state) => ({
      promotions: state.promotions.map((promo) => (promo.id === updatedPromotion.id ? updatedPromotion : promo)),
    })),
  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((promo) => promo.id !== id),
    })),
}));
