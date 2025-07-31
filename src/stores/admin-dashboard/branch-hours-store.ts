// import { create } from "zustand";
// import { createClient } from "@/lib/supabase/client";

// const supabase = createClient();

// export type BranchHours = {
//   id: string;
//   branch_id: string;
//   day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
//   open_time: string | null; // "HH:MM"
//   close_time: string | null; // "HH:MM"
//   is_closed: boolean;
// };

// type HoursState = {
//   hours: BranchHours[];
//   fetchHoursForBranch: (branchId: string) => Promise<void>;
//   getHoursForBranch: (branchId: string) => BranchHours[];
//   updateHours: (hour: BranchHours) => void;
// };

// export const useBranchHoursStore = create<HoursState>((set, get) => ({
//   hours: [],
//   fetchHoursForBranch: async (branchId: string) => {
//     const { data, error } = await supabase.from("branch_hours").select("*").eq("branch_id", branchId);
//     if (error) {
//       console.error("Error fetching branch hours:", error);
//       return;
//     }
//     const existingHours = get().hours.filter((h) => h.branch_id !== branchId);
//     set({ hours: [...existingHours, ...(data as BranchHours[])] });
//   },
//   getHoursForBranch: (branchId: string) => {
//     const branchHours = get().hours.filter((h) => h.branch_id === branchId);
//     // Ensure all 7 days are present for a branch
//     const days = Array.from({ length: 7 }, (_, i) => i);
//     return days.map((day) => {
//       const existing = branchHours.find((h) => h.day_of_week === day);
//       if (existing) return existing;
//       return {
//         id: `${branchId}-${day}`,
//         branch_id: branchId,
//         day_of_week: day,
//         open_time: "09:00",
//         close_time: "17:00",
//         is_closed: day === 0 || day === 6, // Default Sunday/Saturday to closed
//       };
//     });
//   },
//   // TODO: implement supabase mutation
//   updateHours: (updatedHour) =>
//     set((state) => {
//       const index = state.hours.findIndex((h) => h.id === updatedHour.id);
//       if (index !== -1) {
//         const newHours = [...state.hours];
//         newHours[index] = updatedHour;
//         return { hours: newHours };
//       }
//       // If the hour is a default one and not in the store yet, add it
//       return { hours: [...state.hours, updatedHour] };
//     }),
// }));
