export type UserRole = "admin" | "editor" | "viewer"
export type UserStatus = "active" | "pending" | "suspended"

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export const users: User[] = [
  {
    id: 1,
    name: "Emma Smith",
    email: "emma.smith@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    role: "editor",
    status: "pending",
    createdAt: "2024-01-03",
  },
  {
    id: 3,
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    role: "viewer",
    status: "suspended",
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    name: "Noah Taylor",
    email: "noah.taylor@example.com",
    role: "editor",
    status: "active",
    createdAt: "2024-01-07",
  },
  {
    id: 5,
    name: "Ava Anderson",
    email: "ava.anderson@example.com",
    role: "viewer",
    status: "pending",
    createdAt: "2024-01-10",
  },
]