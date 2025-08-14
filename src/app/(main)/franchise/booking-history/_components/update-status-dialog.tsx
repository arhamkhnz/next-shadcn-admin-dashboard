"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EnrichedBooking } from "@/app/(main)/franchise/utils/bookings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBookingStatus } from "@/server/server-actions";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

const formSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
});

interface UpdateStatusDialogProps {
  booking: EnrichedBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateStatusDialog({ booking, isOpen, onClose }: UpdateStatusDialogProps) {
  const { updateBooking } = useFranchiseDashboardStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: booking?.status as "pending" | "in-progress" | "completed" | "cancelled" | undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!booking) return;
    try {
      const updatedBooking = await updateBookingStatus(booking.id, values.status);
      if (updatedBooking) {
        updateBooking(updatedBooking[0]);
      }
      onClose();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>Update the status for booking ID: {booking?.id}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
