"use client"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Role } from "../_data/roles"
import { getColumns } from "./columns"

interface RolesTableProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onSelect: (role: Role | null) => void
  selectedRoleId: string | null
  canManage: boolean
}

export default function RolesTable({
  roles,
  onEdit,
  onDelete,
  onSelect,
  selectedRoleId,
  canManage,
}: RolesTableProps) {
  const table = useReactTable({
    data: roles,
    columns: getColumns({
      canManage,
      onEdit,
      onDelete,
    }),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left text-sm">
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
            {table.getRowModel().rows.map((row) => {
              const isSelected = row.original.id === selectedRoleId

              return (
                <tr
                  key={row.id}
                  className={`border-t ${isSelected ? "bg-muted" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                                          <td
                        key={cell.id}
                        className={`p-2 text-sm ${
                          cell.column.id === "name" || cell.column.id === "description"
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            cell.column.id === "name" ||
                            cell.column.id === "description"
                          ) {
                            onSelect(row.original)
                          }
                        }}
                      >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>

          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}