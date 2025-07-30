import { create } from "zustand";

import { User } from "@/app/(main)/admin/users/_components/types";

type UserState = {
  users: User[];
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
};

const initialUsers: User[] = [
  { id: "1", name: "John Doe", phone: "123-456-7890", cars: 2, bookings: 5, totalWashes: 10 },
  { id: "2", name: "Jane Smith", phone: "098-765-4321", cars: 1, bookings: 3, totalWashes: 8 },
  { id: "3", name: "Robert Johnson", phone: "555-555-5555", cars: 3, bookings: 8, totalWashes: 15 },
  { id: "4", name: "Emily Davis", phone: "111-222-3333", cars: 1, bookings: 2, totalWashes: 4 },
];

export const useUserStore = create<UserState>((set) => ({
  users: initialUsers,
  updateUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
