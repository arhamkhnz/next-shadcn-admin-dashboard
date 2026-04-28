
/**
 * Permission definitions used as the foundation of the RBAC system.
 *
 * At this stage, permissions are static and not yet bound to roles in the UI.
 * This file intentionally contains no logic and no runtime behavior.
 *
 * Its purpose is to:
 * - provide a clear and stable permission vocabulary
 * - serve as a single source of truth for future role-permission mapping
 * - be easily consumed by both frontend and backend layers
 */

export type Permission = {
  key: string
  label: string
  description?: string
  group: PermissionGroup
}

export type PermissionGroup = "users" | "roles" | "content" | "settings" | "system"

export const permissions: Permission[] = [
  {
    key: "users.read",
    label: "Read users",
    description: "View user profiles and basic information.",
    group: "users",
  },
  {
    key: "users.create",
    label: "Create users",
    description: "Create new users in the system.",
    group: "users",
  },
  {
    key: "users.update",
    label: "Update users",
    description: "Edit existing user information.",
    group: "users",
  },
  {
    key: "users.delete",
    label: "Delete users",
    description: "Remove users from the system.",
    group: "users",
  },
  {
    key: "roles.read",
    label: "Read roles",
    description: "View roles and their basic properties.",
    group: "roles",
  },
  {
    key: "roles.create",
    label: "Create roles",
    description: "Create new roles.",
    group: "roles",
  },
  {
    key: "roles.update",
    label: "Update roles",
    description: "Edit role details and metadata.",
    group: "roles",
  },
  {
    key: "roles.delete",
    label: "Delete roles",
    description: "Delete non-system roles.",
    group: "roles",
  },
  {
    key: "roles.manage",
    label: "Manage role permissions",
    description: "Assign and revoke permissions on roles.",
    group: "roles",
  },
  {
    key: "content.read",
    label: "Read content",
    description: "View content and resources.",
    group: "content",
  },
  {
    key: "content.publish",
    label: "Publish content",
    description: "Publish or unpublish content.",
    group: "content",
  },
  {
    key: "settings.read",
    label: "Read settings",
    description: "View application settings.",
    group: "settings",
  },
  {
    key: "settings.update",
    label: "Update settings",
    description: "Modify application settings.",
    group: "settings",
  },
  {
    key: "system.manage",
    label: "System management",
    description:
      "Perform critical system-level operations. Reserved for system roles.",
    group: "system",
  },
]