"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { updateBookingStatus } from "@/server/server-actions";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";
import { Booking } from "@/types/franchise";

const formSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
});

interface BranchBookingManagementProps {
  branchId: string;
}

export function BranchBookingManagement({ branchId }: BranchBookingManagementProps) {
  const { bookings, services, washers, updateBooking } = useFranchiseDashboardStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter bookings for this branch
  const branchBookings = bookings.filter((booking) => booking.branch_id === branchId);

  // Enrich bookings with service and washer names
  const enrichedBookings = branchBookings.map((booking: Booking) => {
    const service = services.find((s) => s.id === booking.service_id);
    const washer = washers.find((w) => w.id === booking.washer_id);

    return {
      ...booking,
      service_name: service?.name ?? "Unknown Service",
      washer_name: washer?.name ?? "Unassigned",
    };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: selectedBooking?.status as "pending" | "in-progress" | "completed" | "cancelled" | undefined,
    },
  });

  useEffect(() => {
    if (selectedBooking) {
      form.setValue("status", selectedBooking.status as any);
    }
  }, [selectedBooking, form]);

  const handleUpdateStatus = async (values: z.infer<typeof formSchema>) => {
    if (!selectedBooking) return;

    try {
      const updatedBooking = await updateBookingStatus(selectedBooking.id, values.status);
      if (updatedBooking) {
        updateBooking(updatedBooking[0]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
    },
    {
      accessorKey: "service_name",
      header: "Service",
    },
    {
      accessorKey: "washer_name",
      header: "Washer",
    },
    {
      accessorKey: "scheduled_at",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("scheduled_at"));
        return <span>{date.toLocaleString()}</span>;
      },
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
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
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
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setSelectedBooking(booking);
                    setIsDialogOpen(true);
                  }}
                >
                  Update Status
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useDataTableInstance({
    data: enrichedBookings,
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Branch Bookings</h3>
        <p className="text-muted-foreground text-sm">
          {branchBookings.length} booking{branchBookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      <DataTable table={table} columns={columns} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>Update the status for booking ID: {selectedBooking?.id}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateStatus)} className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
