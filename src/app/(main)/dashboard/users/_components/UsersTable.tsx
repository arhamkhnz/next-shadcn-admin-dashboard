"use client";

import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { users as demoUsers, type User } from "../_data/users";
import { columns } from "./columns";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage] = useState(10);
  const [page] = useState(1);

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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => Object.values(user).join(" ").toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const table = useReactTable({
    data: paginatedUsers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="space-y-6">
      {/* Toolbar Card */}
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
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

          <Button onClick={handleAddUser}>Add User</Button>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-xs uppercase">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
