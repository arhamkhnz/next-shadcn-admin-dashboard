"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "../_data/users"
import { UserDropdown } from "./UserDropdown"
import { UserBadge } from "./UserBadge"
import { UserActions } from "./UserActions"

type UsersTableMeta = {
  onUpdate?: (
    id: number,
    field: "role" | "status",
    value: string
  ) => void
  onEdit?: (user: User) => void
  onDelete?: (id: number) => void
  onSuspend?: (id: number) => void
}

function getMeta(table: { options: { meta?: unknown } }): UsersTableMeta {
  return (table.options.meta ?? {}) as UsersTableMeta
}

export const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    id: "role-status",
    header: "Role / Status",
    cell: ({ row, table }) => {
      const meta = getMeta(table)
      const user = row.original

      return (
        <UserDropdown
          userId={user.id}
          currentRole={user.role}
          currentStatus={user.status}
          onUpdate={meta.onUpdate}
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <UserBadge status={row.original.status} />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = getMeta(table)
      return (
        <UserActions
          row={row}
          onEdit={meta.onEdit}
          onDelete={meta.onDelete}
          onSuspend={meta.onSuspend}
        />
      )
    },
  },
]