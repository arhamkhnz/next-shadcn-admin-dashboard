"use client"

import { useState, useMemo, useEffect } from "react"
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
import { ArrowUpDown, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { patchUser } from "@/lib/api"
import { demoUsers, User } from "@/lib/demo-users"

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(isDemo ? demoUsers : [])
  const [loading, setLoading] = useState(!isDemo)
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isDemo) {
      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/users")
          if (!res.ok) throw new Error()
          const data = await res.json()
          setUsers(data)
          toast.success("Users loaded successfully")
        } catch {
          toast.info("Backend unavailable — switched to demo mode")
          setUsers(demoUsers)
        } finally {
          setLoading(false)
        }
      }

      fetchUsers()
    }
  }, [])

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
    const end = start + rowsPerPage
    return filteredUsers.slice(start, end)
  }, [filteredUsers, page, rowsPerPage])

  const handleUserUpdate = async (
    id: number,
    field: keyof User,
    value: string
  ) => {
    const previous = users
    const updated = users.map((u) =>
      u.id === id ? { ...u, [field]: value } : u
    )

    setUsers(updated)

    try {
      await patchUser(id, { [field]: value })
      toast.success("User updated successfully")
    } catch {
      toast.info("Local mock update applied")
      setUsers(previous)
    }
  }

  const handleEditUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
    toast.success(`${updatedUser.name} updated successfully`)
  }

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.error("User deleted")
  }

  const handleSuspendUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "Disabled" } : u
      )
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

          {isDemo && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setUsers(demoUsers)
                toast.info("Demo data reloaded")
              }}
              title="Reload demo data"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button>Add User</Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-xs uppercase">
                      {header.isPlaceholder ? null : (
                        header.column.getCanSort() ? (
                          <Button
                            variant="ghost"
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-none">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          {[10, 25, 50, 100].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={rowsPerPage === n ? "default" : "outline"}
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
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>

          <span>
            Page {page} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}