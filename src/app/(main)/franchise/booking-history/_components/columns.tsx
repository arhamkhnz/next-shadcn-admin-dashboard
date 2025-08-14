"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { EnrichedBooking } from "@/app/(main)/franchise/utils/bookings";
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

import { BookingDetailsDialog } from "./booking-details-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";

export const columns: ColumnDef<EnrichedBooking>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : status === "in-progress"
                  ? "default"
                  : "outline"
          }
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "pending"
                ? "bg-yellow-500"
                : status === "in-progress"
                  ? "bg-blue-500"
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
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{date.toLocaleString()}</span>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const booking = row.original;
      const [isDetailsOpen, setIsDetailsOpen] = useState(false);
      const [isUpdateOpen, setIsUpdateOpen] = useState(false);

      return (
        <>
          <BookingDetailsDialog booking={booking} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />
          <UpdateStatusDialog booking={booking} isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} />
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
              <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>Update Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
