"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table"

import { columns } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

import { users as demoUsers, type User } from "../_data/users"

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const handleAddUser = () => {
    const newId =
      users.length > 0
        ? Math.max(...users.map((u) => u.id)) + 1
        : 1

    const newUser: User = {
      id: newId,
      name: "New User",
      email: `user${newId}@example.com`,
      role: "viewer",
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers((prev) => [...prev, newUser])
  }

  const handleUserUpdate = (
    id: number,
    field: "role" | "status",
    value: string
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, [field]: value } : u
      )
    )
  }

  const handleEditUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      )
    )
  }

  const handleDeleteUser = (id: number) => {
    setUsers((prev) =>
      prev.filter((u) => u.id !== id)
    )
  }

  const handleSuspendUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: "suspended" }
          : u
      )
    )
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [users, search])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return filteredUsers.slice(start, start + rowsPerPage)
  }, [filteredUsers, page, rowsPerPage])

  const table = useReactTable({
    data: paginatedUsers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onEdit: handleEditUser,
      onDelete: handleDeleteUser,
      onSuspend: handleSuspendUser,
      onUpdate: handleUserUpdate,
    },
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / rowsPerPage)
  )

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => setUsers(demoUsers)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handleAddUser}>
          Add User
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs uppercase"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-none"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span>
          Page {page} of {totalPages}
        </span>
      </div>
    </section>
  )
}