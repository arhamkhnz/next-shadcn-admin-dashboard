"use client"

import { useState } from "react"

import RolesTable from "./_components/RolesTable"
import { AddRoleDialog } from "./_components/AddRoleDialog"
import { EditRoleDialog } from "./_components/EditRoleDialog"
import { RolePermissions } from "./_components/RolePermissions"

import { Button } from "@/components/ui/button"
import { demoRoles, type Role } from "./_data/roles"

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(demoRoles)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleEdit = (role: Role) => {
    setSelectedRole(null)
    setIsAddOpen(false)
    setEditingRole(role)
  }

  const handleDelete = (role: Role) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id))
    if (selectedRole?.id === role.id) setSelectedRole(null)
  }

  const canManage = true

  return (
    <section className="p-6 space-y-8">

      {/* 🔥 HEADER AMÉLIORÉ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Roles
          </h1>
          <p className="text-muted-foreground">
            Manage roles and permissions across the application.
          </p>
        </div>

        <Button
          disabled={!canManage}
          onClick={() => {
            setSelectedRole(null)
            setEditingRole(null)
            setIsAddOpen(true)
          }}
        >
          Add role
        </Button>
      </div>

      {/* 🔥 STATS (HIÉRARCHIE VISUELLE) */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Roles</p>
          <p className="text-2xl font-bold">{roles.length}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">System Roles</p>
          <p className="text-2xl font-bold">
            {roles.filter(r => r.isSystem).length}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Custom Roles</p>
          <p className="text-2xl font-bold">
            {roles.filter(r => !r.isSystem).length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <RolesTable
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={setSelectedRole}
        selectedRoleId={selectedRole?.id ?? null}
        canManage={canManage}
      />

      {/* 🔥 PERMISSIONS PANEL AMÉLIORÉ */}
      {selectedRole && (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Permissions
          </h2>

          <RolePermissions role={selectedRole} />
        </div>
      )}

      {/* Add Role Dialog */}
      <AddRoleDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        existingRoles={roles}
        onConfirm={(role) => {
          setRoles((prev) => [...prev, role])
          setIsAddOpen(false)
        }}
      />

      {editingRole && (
        <EditRoleDialog
          role={editingRole}
          existingRoles={roles}
          onClose={() => {
            setSelectedRole(null)
            setEditingRole(null)
          }}
          onConfirm={(updated) => {
            setRoles((prev) =>
              prev.map((r) => (r.id === updated.id ? updated : r))
            )
          }}
        />
      )}
    </section>
  )
}