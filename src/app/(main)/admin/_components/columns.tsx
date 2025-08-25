"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Booking = {
  id: string;
  user: string;
  branch: string;
  service: string;
  serviceId: string;
  status: "completed" | "pending" | "in-progress" | "scheduled" | "cancelled";
  date: Date;
};

type ExtendedColumnDef<T> = ColumnDef<T> & {
  cell?: (props: any) => any;
};

export const columns: ExtendedColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking ID" />,
  },
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
  },
  {
    accessorKey: "branch",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
  },
  {
    accessorKey: "service",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as Booking["status"];
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : status === "in-progress"
                  ? "default"
                  : status === "cancelled"
                    ? "destructive"
                    : "outline"
          }
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "pending"
                ? "bg-yellow-500"
                : status === "in-progress"
                  ? "bg-blue-500"
                  : status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => format(row.getValue("date"), "MMM d, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;

      // These handlers will be overridden by the table component
      const handleViewDetails = () => {};
      const handleUpdateStatus = () => {};
      const handleCancelBooking = () => {};

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>Copy ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewDetails()}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus()}>Update Status</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleCancelBooking()}
              disabled={booking.status === "cancelled"}
            >
              Cancel Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
