import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

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
  fetchHoursForBranch: (branchId: string) => Promise<void>;
  getHoursForBranch: (branchId: string) => BranchHours[];
  updateHours: (hour: BranchHours) => Promise<void>;
  addHours: (hour: Omit<BranchHours, "id">) => Promise<void>;
  deleteHours: (id: string) => Promise<void>;
};

export const useBranchHoursStore = create<HoursState>((set, get) => ({
  hours: [],
  fetchHoursForBranch: async (branchId: string) => {
    const { data, error } = await supabase.from("branch_hours").select("*").eq("branch_id", branchId);
    if (error) {
      console.error("Error fetching branch hours:", error);
      return;
    }
    const existingHours = get().hours.filter((h) => h.branch_id !== branchId);
    set({ hours: [...existingHours, ...(data as BranchHours[])] });
  },
  getHoursForBranch: (branchId: string) => {
    const branchHours = get().hours.filter((h) => h.branch_id === branchId);
    // Ensure all 7 days are present for a branch
    const days = Array.from({ length: 7 }, (_, i) => i);
    return days.map((day) => {
      const existing = branchHours.find((h) => h.day_of_week === day);
      if (existing) return existing;
      return {
        id: `default-${branchId}-${day}`,
        branch_id: branchId,
        day_of_week: day,
        open_time: "09:00",
        close_time: "17:00",
        is_closed: day === 0 || day === 6, // Default Sunday/Saturday to closed
      };
    });
  },
  updateHours: async (updatedHour) => {
    // Check if this is a default hour (not in DB yet)
    if (updatedHour.id.startsWith("default-")) {
      // Add new hour to database
      const { data, error } = await supabase
        .from("branch_hours")
        .insert([
          {
            branch_id: updatedHour.branch_id,
            day_of_week: updatedHour.day_of_week,
            open_time: updatedHour.open_time,
            close_time: updatedHour.close_time,
            is_closed: updatedHour.is_closed,
          },
        ])
        .select();

      if (error) {
        // Check if it's a unique constraint violation
        if (error.code === "23505") {
          // Unique constraint violation, try updating instead
          const { data: updateData, error: updateError } = await supabase
            .from("branch_hours")
            .update({
              open_time: updatedHour.open_time,
              close_time: updatedHour.close_time,
              is_closed: updatedHour.is_closed,
            })
            .eq("branch_id", updatedHour.branch_id)
            .eq("day_of_week", updatedHour.day_of_week)
            .select();

          if (updateError) {
            console.error("Error updating branch hours:", updateError);
            throw updateError;
          }

          // Update the store with the updated hour
          set((state) => ({
            hours: state.hours
              .filter((h) => !(h.branch_id === updatedHour.branch_id && h.day_of_week === updatedHour.day_of_week))
              .concat(updateData[0] as BranchHours),
          }));
        } else {
          console.error("Error adding branch hours:", error);
          throw error;
        }
      } else {
        // Update the store with the new hour
        set((state) => ({
          hours: state.hours
            .filter((h) => !(h.branch_id === updatedHour.branch_id && h.day_of_week === updatedHour.day_of_week))
            .concat(data[0] as BranchHours),
        }));
      }
    } else {
      // Update existing hour in database
      const { data, error } = await supabase
        .from("branch_hours")
        .update({
          open_time: updatedHour.open_time,
          close_time: updatedHour.close_time,
          is_closed: updatedHour.is_closed,
        })
        .eq("id", updatedHour.id)
        .select();

      if (error) {
        console.error("Error updating branch hours:", error);
        throw error;
      }

      // Update the store
      set((state) => {
        const index = state.hours.findIndex((h) => h.id === updatedHour.id);
        if (index !== -1) {
          const newHours = [...state.hours];
          newHours[index] = data[0] as BranchHours;
          return { hours: newHours };
        }
        return state;
      });
    }
  },
  addHours: async (newHour) => {
    const { data, error } = await supabase.from("branch_hours").insert([newHour]).select();

    if (error) {
      console.error("Error adding branch hours:", error);
      throw error;
    }

    set((state) => ({
      hours: [...state.hours, ...(data as BranchHours[])],
    }));
  },
  deleteHours: async (id: string) => {
    // Don't delete default hours, just mark them as closed
    if (id.startsWith("default-")) {
      // This is a default hour, we can't delete it from DB, just update it
      // In this case, we'll just update the store locally
      set((state) => ({
        hours: state.hours.map((h) => (h.id === id ? { ...h, is_closed: true, open_time: null, close_time: null } : h)),
      }));
    } else {
      // Delete from database
      const { error } = await supabase.from("branch_hours").delete().eq("id", id);

      if (error) {
        console.error("Error deleting branch hours:", error);
        throw error;
      }

      // Remove from store
      set((state) => ({
        hours: state.hours.filter((h) => h.id !== id),
      }));
    }
  },
}));
