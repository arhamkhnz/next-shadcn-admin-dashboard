import { create } from "zustand";

export type BranchHours = {
  id: string;
  branch_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  open_time: string | null; // "HH:MM"
  close_time: string | null; // "HH:MM"
  is_closed: boolean;
};

type HoursState = {
  hours: BranchHours[];
  getHoursForBranch: (branchId: string) => BranchHours[];
  updateHours: (hour: BranchHours) => void;
};

// Mock data - associating hours with existing branch IDs
const initialHours: BranchHours[] = [
  // Karwi Wash North (ID "1" and "2")
  { id: "1", branch_id: "1", day_of_week: 1, open_time: "08:00", close_time: "18:00", is_closed: false },
  { id: "2", branch_id: "1", day_of_week: 2, open_time: "08:00", close_time: "18:00", is_closed: false },
  { id: "3", branch_id: "1", day_of_week: 0, open_time: null, close_time: null, is_closed: true }, // Sunday closed
  { id: "4", branch_id: "2", day_of_week: 1, open_time: "09:00", close_time: "19:00", is_closed: false },
  // Karwi Wash East (ID "3")
  { id: "5", branch_id: "3", day_of_week: 1, open_time: "07:00", close_time: "17:00", is_closed: false },
];

export const useBranchHoursStore = create<HoursState>((set, get) => ({
  hours: initialHours,
  getHoursForBranch: (branchId: string) => {
    const branchHours = get().hours.filter((h) => h.branch_id === branchId);
    // Ensure all 7 days are present for a branch
    const days = Array.from({ length: 7 }, (_, i) => i);
    return days.map((day) => {
      const existing = branchHours.find((h) => h.day_of_week === day);
      if (existing) return existing;
      return {
        id: `${branchId}-${day}`,
        branch_id: branchId,
        day_of_week: day,
        open_time: "09:00",
        close_time: "17:00",
        is_closed: day === 0 || day === 6, // Default Sunday/Saturday to closed
      };
    });
  },
  updateHours: (updatedHour) =>
    set((state) => {
      const index = state.hours.findIndex((h) => h.id === updatedHour.id);
      if (index !== -1) {
        const newHours = [...state.hours];
        newHours[index] = updatedHour;
        return { hours: newHours };
      }
      // If the hour is a default one and not in the store yet, add it
      return { hours: [...state.hours, updatedHour] };
    }),
}));
