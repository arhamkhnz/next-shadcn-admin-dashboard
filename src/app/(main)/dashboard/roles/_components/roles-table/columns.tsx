"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Role } from "./data";

export const rolesColumns: ColumnDef<Role>[] = [
  {
    id: "group",
    accessorKey: "group",
    filterFn: "equalsString",
    enableHiding: true,
  },
  {
    id: "search",
    accessorFn: (row) => [row.role, row.owner, ...row.permissionSets].join(" "),
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    size: 180,
    minSize: 180,
    cell: ({ row }) => <span className="font-medium text-sm">{row.original.role}</span>,
  },
  {
    id: "accessLevel",
    accessorKey: "accessLevel",
    header: "Access level",
    size: 120,
    cell: ({ row }) => (
      <Badge className="rounded-sm" variant="outline">
        {row.original.accessLevel}
      </Badge>
    ),
  },
  {
    id: "users",
    accessorKey: "users",
    header: "Users",
    size: 70,
    cell: ({ row }) => <span className="text-sm">{row.original.users}</span>,
  },
  {
    id: "permissionSets",
    accessorFn: (row) => row.permissionSets.join(" "),
    header: "Permission sets",
    size: 310,
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center justify-start gap-2">
        {row.original.permissionSets.slice(0, 3).map((set) => (
          <Badge className="rounded-sm" variant="outline" key={set}>
            {set}
          </Badge>
        ))}
        {row.original.permissionSets.length > 3 ? (
          <span className="text-sm tabular-nums">+{row.original.permissionSets.length - 3}</span>
        ) : null}
      </div>
    ),
  },
  {
    id: "lastReview",
    accessorKey: "lastReview",
    header: "Last review",
    size: 120,
    cell: ({ row }) => <span className="text-sm">{row.original.lastReview}</span>,
  },
  {
    id: "owner",
    accessorKey: "owner",
    header: "Owner",
    size: 110,
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{row.original.owner}</span>,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 130,
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge className="rounded-sm" variant="outline">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 70,
    cell: ({ row }) => {
      const isSystemRole = row.original.group === "System roles";
      const needsReview = row.original.status === "Needs review";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuGroup>
              {needsReview ? <DropdownMenuItem>Review changes</DropdownMenuItem> : null}
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem disabled={isSystemRole}>Edit role</DropdownMenuItem>
              <DropdownMenuItem disabled={isSystemRole}>Duplicate role</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Review permissions</DropdownMenuItem>
              <DropdownMenuItem>Manage members</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={isSystemRole} variant="destructive">
                Archive role
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableColumnFilter: false,
  },
];
