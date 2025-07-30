import { create } from "zustand";

import { Branch } from "@/app/(main)/admin/branches/_components/types";

type BranchState = {
  branches: Branch[];
  addBranch: (branch: Omit<Branch, "id">) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (id: string) => void;
};

const initialBranches: Branch[] = [
  {
    id: "1",
    name: "Downtown",
    franchise: "Karwi Wash North",
    location: "123 Main St",
    services: 10,
    activeBookings: 5,
  },
  { id: "2", name: "Uptown", franchise: "Karwi Wash North", location: "456 Oak Ave", services: 8, activeBookings: 3 },
  {
    id: "3",
    name: "Eastside",
    franchise: "Karwi Wash East",
    location: "789 Pine Ln",
    services: 12,
    activeBookings: 7,
  },
  {
    id: "4",
    name: "Westside",
    franchise: "Karwi Wash West",
    location: "101 Maple Dr",
    services: 9,
    activeBookings: 4,
  },
];

export const useBranchStore = create<BranchState>((set) => ({
  branches: initialBranches,
  addBranch: (branch) =>
    set((state) => ({
      branches: [...state.branches, { ...branch, id: `${state.branches.length + 1}` }],
    })),
  updateBranch: (updatedBranch) =>
    set((state) => ({
      branches: state.branches.map((branch) => (branch.id === updatedBranch.id ? updatedBranch : branch)),
    })),
  deleteBranch: (id) =>
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    })),
}));
