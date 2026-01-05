"use client"

import { useState, useMemo, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import { columns } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { patchUser } from "@/lib/api"
import { generateDemoUsers } from "@/lib/demo-users"

// 🧠 Détermine le mode (Démo ou Production)
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export default function UsersTable() {
  // 👇 Si démo = génère des données locales, sinon = tableau vide
  const [users, setUsers] = useState(isDemo ? generateDemoUsers(25) : [])
  const [loading, setLoading] = useState(!isDemo)
  const [sorting, setSorting] = useState([])
  const [search, setSearch] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  // 📡 Charge les utilisateurs réels si mode production
  useEffect(() => {
    if (!isDemo) {
      async function fetchUsers() {
        try {
          const res = await fetch("/api/users")
          if (!res.ok) throw new Error("Failed to fetch users")
          const data = await res.json()
          setUsers(data)
          toast.success("✅ Users loaded successfully from backend")
        } catch {
          // 💡 Fallback silencieux : on passe en mode démo local
          toast.info("ℹ️ Backend unavailable — switched to demo mode")
          setUsers(generateDemoUsers(25))
        } finally {
          setLoading(false)
        }
      }

      fetchUsers()
    }
  }, [])

  // 🔍 Recherche
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [users, search])

  // 📄 Pagination
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredUsers.slice(start, end)
  }, [filteredUsers, page, rowsPerPage])

  // ⚙️ Gestion dynamique des rôles/statuts
  const handleUserUpdate = async (id: number, field: string, value: string) => {
    const previous = users
    const updated = users.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    setUsers(updated)

    try {
      await patchUser(id, { [field]: value })
      toast.success("User updated successfully")
    } catch {
      toast.info("Local mock update applied (no backend)")
      setUsers(previous)
    }
  }

  // ✏️ Édition manuelle (nom / email)
  const handleEditUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    toast.success(`${updatedUser.name} updated successfully`)
  }

  // ❌ Suppression utilisateur
  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.error("User deleted")
  }

  // 🚫 Suspension utilisateur
  const handleSuspendUser = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Suspended" } : u))
    )
    toast.warning("User suspended")
  }

  const table = useReactTable({
    data: paginatedUsers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    meta: {
      onEdit: handleEditUser,
      onDelete: handleDeleteUser,
      onSuspend: handleSuspendUser,
      onUpdate: handleUserUpdate,
    },
  })

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)

  // 🧱 Rendu principal
  return (
    <section className="space-y-6">
      {/* 🔍 Barre de recherche et actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs shadow-sm focus:ring-2 focus:ring-primary/50"
          />
          {isDemo && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setUsers(generateDemoUsers(25))
                toast.info("Demo data reloaded")
              }}
              className="ml-2"
              title="Reload demo data"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button className="transition-all duration-200 hover:scale-[1.02]">
          Add User
        </Button>
      </div>

      {/* 🧩 Tableau principal */}
      <div className="rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading users...</div>
        ) : (
          <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
            <thead className="bg-muted/40 text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              onClick={header.column.getToggleSortingHandler()}
                              className="flex items-center gap-1 text-foreground hover:bg-transparent"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            </Button>
                          ) : (
                            <span>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                          )}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-none transition-all duration-200 ease-in-out hover:bg-muted/70 hover:shadow-sm hover:scale-[1.002]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2.5 align-middle text-sm text-foreground/90"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          {[10, 25, 50, 100].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={rowsPerPage === n ? "default" : "outline"}
              className="rounded-md"
              onClick={() => {
                setRowsPerPage(n)
                setPage(1)
              }}
            >
              {n}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-foreground/80">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}
