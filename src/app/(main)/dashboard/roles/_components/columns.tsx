"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { RoleActions } from "./RoleActions"
import { RoleBadge } from "./RoleBadge"

import type { Role } from "../_data/roles"
import { Badge } from "@/components/ui/badge"

interface ColumnsProps {
  canManage: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d)
}

const renderPermissions = (keys: string[]) => {
  if (!keys?.length) return <span className="text-muted-foreground">—</span>

  const shown = keys.slice(0, 3)
  const remaining = Math.max(0, keys.length - shown.length)

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((k) => (
        <Badge key={k} variant="secondary" className="cursor-default select-none">
          {k}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="cursor-default select-none">
          +{remaining}
        </Badge>
      )}
    </div>
  )
}

export const getColumns = ({
  canManage,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description || "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <RoleBadge status={row.original.status} />,
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => renderPermissions(row.original.permissions ?? []),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.isSystem ? "System" : "Custom"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <RoleActions
        role={row.original}
        canManage={canManage}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
]