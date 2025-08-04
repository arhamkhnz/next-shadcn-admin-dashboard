import { create } from "zustand";

export type Washer = {
  id: string;
  name: string;
  branch: string;
  status: "active" | "inactive";
  rating: number;
};

type UserState = {
  washers: Washer[];
  fetchWashers: () => void;
  addWasher: (washer: Omit<Washer, "id">) => void;
  updateWasher: (washer: Washer) => void;
  deleteWasher: (id: string) => void;
};

// Mock data for washers
const mockWashers: Washer[] = [
  { id: "w1", name: "John Doe", branch: "Downtown", status: "active", rating: 4.5 },
  { id: "w2", name: "Jane Smith", branch: "Uptown", status: "inactive", rating: 4.2 },
  { id: "w3", name: "Mike Johnson", branch: "Downtown", status: "active", rating: 4.8 },
  { id: "w4", name: "Emily White", branch: "Suburb", status: "active", rating: 4.9 },
];

export const useFranchiseUserStore = create<UserState>((set) => ({
  washers: [],
  fetchWashers: () => {
    // In a real app, you'd fetch this from an API
    set({ washers: mockWashers });
  },
  addWasher: (washer) =>
    set((state) => ({
      washers: [...state.washers, { ...washer, id: `w${Date.now()}` }],
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
