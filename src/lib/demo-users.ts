export type User = {
  id: number
  name: string
  email: string
  role: string
  status: "Active" | "Disabled"
}

export const demoUsers: User[] = [
  {
    id: 1,
    name: "Emma Smith",
    email: "emma.smith@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    role: "Editor",
    status: "Disabled",
  },
  {
    id: 3,
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    role: "Viewer",
    status: "Active",
  },
  {
    id: 4,
    name: "Noah Taylor",
    email: "noah.taylor@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 5,
    name: "Ava Anderson",
    email: "ava.anderson@example.com",
    role: "Viewer",
    status: "Disabled",
  },
]
