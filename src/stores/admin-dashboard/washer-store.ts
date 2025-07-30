import { create } from "zustand";

import { Washer } from "@/app/(main)/admin/washers/_components/types";

type WasherState = {
  washers: Washer[];
  addWasher: (washer: Omit<Washer, "id">) => void;
  updateWasher: (washer: Washer) => void;
  deleteWasher: (id: string) => void;
};

const initialWashers: Washer[] = [
  { id: "1", name: "Mike Johnson", branch: "Downtown", status: "active", rating: 4.5 },
  { id: "2", name: "Sarah Williams", branch: "Uptown", status: "active", rating: 4.8 },
  { id: "3", name: "David Brown", branch: "Eastside", status: "inactive", rating: 4.2 },
  { id: "4", name: "Jessica Miller", branch: "Westside", status: "active", rating: 4.9 },
];

export const useWasherStore = create<WasherState>((set) => ({
  washers: initialWashers,
  addWasher: (washer) =>
    set((state) => ({
      washers: [...state.washers, { ...washer, id: `${state.washers.length + 1}` }],
    })),
  updateWasher: (updatedWasher) =>
    set((state) => ({
      washers: state.washers.map((washer) => (washer.id === updatedWasher.id ? updatedWasher : washer)),
    })),
  deleteWasher: (id) =>
    set((state) => ({
      washers: state.washers.filter((washer) => washer.id !== id),
    })),
}));
