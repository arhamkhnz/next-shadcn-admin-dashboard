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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles Management</h1>

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

      <RolesTable
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={setSelectedRole}
        selectedRoleId={selectedRole?.id ?? null}
        canManage={canManage}
      />

      {selectedRole && (
        <div className="rounded-md border p-4">
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