import { create } from "zustand";

import { deals as mockDeals } from "./data";
import type { Deal, DealStage } from "./schema";

type DealStore = {
  deals: Deal[];
  getDealById: (id: string) => Deal | undefined;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  archiveDeal: (id: string, archivedBy: string) => void;
  restoreDeal: (id: string) => void;
  bulkArchiveDeals: (ids: string[], archivedBy: string) => void;
  bulkRestoreDeals: (ids: string[]) => void;
  bulkAssignOwner: (ids: string[], ownerId: string) => void;
  bulkChangeStage: (ids: string[], stage: DealStage, probability: number) => void;
  bulkAddTag: (ids: string[], tag: string) => void;
};

export const useDealStore = create<DealStore>((set, get) => ({
  deals: mockDeals,

  getDealById: (id: string) => get().deals.find((d) => d.id === id),

  addDeal: (deal: Deal) => set((state) => ({ deals: [...state.deals, deal] })),

  updateDeal: (id: string, updates: Partial<Deal>) =>
    set((state) => ({
      deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  archiveDeal: (id: string, archivedBy: string) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id ? { ...d, archivedAt: new Date().toISOString().slice(0, 10), archivedBy } : d,
      ),
    })),

  restoreDeal: (id: string) =>
    set((state) => ({
      deals: state.deals.map((d) => (d.id === id ? { ...d, archivedAt: null, archivedBy: null } : d)),
    })),

  bulkArchiveDeals: (ids: string[], archivedBy: string) =>
    set((state) => {
      const now = new Date().toISOString().slice(0, 10);
      return {
        deals: state.deals.map((d) => (ids.includes(d.id) ? { ...d, archivedAt: now, archivedBy } : d)),
      };
    }),

  bulkRestoreDeals: (ids: string[]) =>
    set((state) => ({
      deals: state.deals.map((d) => (ids.includes(d.id) ? { ...d, archivedAt: null, archivedBy: null } : d)),
    })),

  bulkAssignOwner: (ids: string[], ownerId: string) =>
    set((state) => ({
      deals: state.deals.map((d) => (ids.includes(d.id) ? { ...d, ownerId, updatedAt: new Date().toISOString() } : d)),
    })),

  bulkChangeStage: (ids: string[], stage: DealStage, probability: number) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        ids.includes(d.id) ? { ...d, stage, probability, updatedAt: new Date().toISOString() } : d,
      ),
    })),

  bulkAddTag: (ids: string[], tag: string) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        ids.includes(d.id) ? { ...d, tags: [...(d.tags ?? []), tag], updatedAt: new Date().toISOString() } : d,
      ),
    })),
}));
