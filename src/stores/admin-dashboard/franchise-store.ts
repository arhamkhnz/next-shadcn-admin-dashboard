import { create } from "zustand";

import { Franchise } from "@/app/(main)/admin/franchises/_components/types";

type FranchiseState = {
  franchises: Franchise[];
  addFranchise: (franchise: Omit<Franchise, "id">) => void;
  updateFranchise: (franchise: Franchise) => void;
  deleteFranchise: (id: string) => void;
};

const initialFranchises: Franchise[] = [
  { id: "1", name: "Karwi Wash North", status: "active", branches: 5, washers: 20 },
  { id: "2", name: "Karwi Wash South", status: "inactive", branches: 3, washers: 15 },
  { id: "3", name: "Karwi Wash East", status: "active", branches: 7, washers: 30 },
  { id: "4", name: "Karwi Wash West", status: "active", branches: 4, washers: 25 },
];

export const useFranchiseStore = create<FranchiseState>((set) => ({
  franchises: initialFranchises,
  addFranchise: (franchise) =>
    set((state) => ({
      franchises: [...state.franchises, { ...franchise, id: `${state.franchises.length + 1}` }],
    })),
  updateFranchise: (updatedFranchise) =>
    set((state) => ({
      franchises: state.franchises.map((franchise) =>
        franchise.id === updatedFranchise.id ? updatedFranchise : franchise,
      ),
    })),
  deleteFranchise: (id) =>
    set((state) => ({
      franchises: state.franchises.filter((franchise) => franchise.id !== id),
    })),
}));
