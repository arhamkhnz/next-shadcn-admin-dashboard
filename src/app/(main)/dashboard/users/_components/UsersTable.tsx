"use client";

import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { users as demoUsers, type User } from "../_data/users";
import { columns } from "./columns";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const handleAddUser = () => {
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser: User = {
      id: newId,
      name: "New User",
      email: `user${newId}@example.com`,
      role: "viewer",
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [...prev, newUser]);
  };

  // ✅ AJOUT DES HANDLERS (IMPORTANT)
  const handleEdit = (updated: User) => setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

  const handleDelete = (id: number) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const handleSuspend = (id: number) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "suspended" } : u)));

  const handleUpdate = (id: number, field: "role" | "status", value: string) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)));

  const filteredUsers = useMemo(() => {
    return users.filter((user) => Object.values(user).join(" ").toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  // ✅ AJOUT DU META ICI
  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    meta: {
      onEdit: handleEdit,
      onDelete: handleDelete,
      onSuspend: handleSuspend,
      onUpdate: handleUpdate,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <Button variant="outline" size="icon" onClick={() => setUsers(demoUsers)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button className="gap-2" onClick={handleAddUser}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="group">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="group-hover:bg-muted/50">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
