// Mock user dataset for the Users Management module
// Defines a reusable TypeScript interface for type safety.

export type User = {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "pending" | "suspended"
  createdAt: string
}

export const users: User[] = [
  {
    id: 1,
    name: "Rachid Hammami",
    email: "rachid.hammami@example.com",
    role: "Admin",
    status: "active",
    createdAt: "2025-10-05",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Editor",
    status: "pending",
    createdAt: "2025-11-01",
  },
  {
    id: 3,
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    role: "Viewer",
    status: "suspended",
    createdAt: "2025-09-27",
  },
]
