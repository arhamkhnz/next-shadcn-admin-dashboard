

export type RoleStatus = "Active" | "Disabled"

export type Role = {
  id: string
  name: string
  description: string
  usersCount: number
  status: RoleStatus
  isSystem: boolean
  createdAt: string // ISO string
  permissions: string[] // permission keys (display-only)
}

export const demoRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all administrative features and settings.",
    usersCount: 3,
    status: "Active",
    isSystem: true,
    createdAt: "2025-01-10T10:00:00.000Z",
    permissions: [
      "users.read",
      "users.create",
      "users.update",
      "users.delete",
      "roles.read",
      "roles.create",
      "roles.update",
      "roles.delete",
      "roles.manage",
      "content.read",
      "content.publish",
      "settings.read",
      "settings.update",
      "system.manage",
    ],
  },
  {
    id: "2",
    name: "Manager",
    description: "Can manage teams, users, and assigned resources.",
    usersCount: 5,
    status: "Active",
    isSystem: true,
    createdAt: "2025-02-05T12:30:00.000Z",
    permissions: [
      "users.read",
      "users.create",
      "users.update",
      "roles.read",
      "content.read",
      "content.publish",
      "settings.read",
    ],
  },
  {
    id: "3",
    name: "Editor",
    description: "Can modify and publish content within assigned areas.",
    usersCount: 7,
    status: "Active",
    isSystem: true,
    createdAt: "2025-03-12T09:15:00.000Z",
    permissions: ["content.read", "content.publish", "users.read", "roles.read"],
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to public or shared content.",
    usersCount: 12,
    status: "Disabled",
    isSystem: true,
    createdAt: "2025-04-01T08:00:00.000Z",
    permissions: ["users.read", "roles.read", "content.read", "settings.read"],
  },
]