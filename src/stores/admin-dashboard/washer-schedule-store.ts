import { create } from "zustand";

export type WasherSchedule = {
  id: string;
  washer_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
};

type ScheduleState = {
  schedules: WasherSchedule[];
  getSchedulesForWasher: (washerId: string) => WasherSchedule[];
  addSchedule: (schedule: Omit<WasherSchedule, "id">) => void;
  deleteSchedule: (scheduleId: string) => void;
};

// Mock data - associating schedules with the existing washer IDs
const initialSchedules: WasherSchedule[] = [
  { id: "1", washer_id: "1", day_of_week: 1, start_time: "09:00", end_time: "17:00" }, // Mike, Monday
  { id: "2", washer_id: "1", day_of_week: 2, start_time: "09:00", end_time: "17:00" }, // Mike, Tuesday
  { id: "3", washer_id: "2", day_of_week: 1, start_time: "10:00", end_time: "18:00" }, // Sarah, Monday
  { id: "4", washer_id: "2", day_of_week: 3, start_time: "10:00", end_time: "18:00" }, // Sarah, Wednesday
  { id: "5", washer_id: "4", day_of_week: 5, start_time: "08:00", end_time: "16:00" }, // Jessica, Friday
];

export const useWasherScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: initialSchedules,
  getSchedulesForWasher: (washerId: string) => {
    return get().schedules.filter((schedule) => schedule.washer_id === washerId);
  },
  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, { ...schedule, id: `${state.schedules.length + 1}` }],
    })),
  deleteSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== scheduleId),
    })),
}));
