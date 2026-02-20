"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserDropdown } from "./UserDropdown"
import { UserBadge } from "./UserBadge"
import { UserActions } from "./UserActions"

export type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    id: "role-status",
    header: "Role / Status",
    cell: ({ row, table }) => {
      const { onUpdate } = table.options.meta || {}
      const user = row.original
      return (
        <UserDropdown
          userId={user.id}
          currentRole={user.role}
          currentStatus={user.status}
          onUpdate={onUpdate}
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UserBadge status={row.original.status as any} />,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row, table }) => {
      const { onEdit, onDelete, onSuspend } = table.options.meta || {}
      return (
        <UserActions
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
          onSuspend={onSuspend}
        />
      )
    },
  },
]
