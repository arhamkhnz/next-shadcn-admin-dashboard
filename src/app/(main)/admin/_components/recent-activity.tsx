/* eslint-disable complexity */
"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";
import { useReviewStore } from "@/stores/admin-dashboard/review-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

import { BookingDetailsDialog } from "./booking-details-dialog";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { Booking } from "./columns";
import { UpdateStatusDialog } from "./update-status-dialog";

export function RecentActivity() {
  const { payments } = usePaymentStore();
  const { reviews } = useReviewStore();
  const { users } = useUserStore();
  const { bookings, updateBookingStatus, cancelBooking } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Get recent bookings (last 24 hours)
  const recentBookings = bookings
    .filter((booking) => {
      const bookingDate = new Date(booking.date);
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return bookingDate >= oneDayAgo;
    })
    .map((booking) => ({
      ...booking,
      type: "booking",
      date: booking.date,
    }));

  const combinedActivity = [
    ...payments.map((p) => ({ ...p, type: "payment", date: new Date(p.created_at) })),
    ...reviews.map((r) => {
      const user = users.find((u) => u.id === r.userId);
      // Use the current date for reviews since there's no created_at field
      const date = new Date();
      return { ...r, type: "review", date, user };
    }),
    ...recentBookings,
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsUpdateDialogOpen(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus as Booking["status"]);
      toast.success("Booking status updated successfully");
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
  };

  const handleBookingCancellation = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {combinedActivity.slice(0, 5).map((activity, index) => (
          <div key={`${activity.type}-${activity.id ?? index}`} className="flex items-center">
            <Avatar className="h-9 w-9">
              {activity.type === "review" && "user" in activity && activity.user && (
                <>
                  <AvatarImage
                    src={`/avatars/${("user" in activity && activity.user ? (activity.user as any).name : "unknown").toLowerCase().replace(" ", "")}.png`}
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    {"user" in activity && activity.user ? (activity.user as any).name[0] : "U"}
                  </AvatarFallback>
                </>
              )}
              {activity.type === "payment" && (
                <span className="bg-muted flex h-full w-full items-center justify-center rounded-full">$</span>
              )}
              {activity.type === "booking" && (
                <span className="bg-muted flex h-full w-full items-center justify-center rounded-full">B</span>
              )}
            </Avatar>
            <div className="ml-4 flex-1 space-y-1">
              {activity.type === "review" && (
                <p className="text-sm leading-none font-medium">
                  New review from {"user" in activity && activity.user ? (activity.user as any).name : "Unknown User"}
                </p>
              )}
              {activity.type === "payment" && "amount" in activity && (
                <p className="text-sm leading-none font-medium">
                  Payment of ${(activity as any).amount.toFixed(2)} {(activity as any).status}
                </p>
              )}
              {activity.type === "booking" && (
                <p className="text-sm leading-none font-medium">
                  New booking for {(activity as any).service} at {(activity as any).branch}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                {activity.type === "review" && "comment" in activity && (activity as any).comment}
                {activity.type === "payment" &&
                  "booking_id" in activity &&
                  `Booking ID: ${(activity as any).booking_id}`}
                {activity.type === "booking" && "user" in activity && `User: ${(activity as any).user}`}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-muted-foreground text-sm font-medium">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(activity.date)}
              </div>
              {activity.type === "booking" && (
                <div className="mt-1 flex gap-1">
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-blue-600 hover:underline"
                    onClick={() => handleViewBookingDetails(activity as Booking)}
                  >
                    View
                  </Button>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-green-600 hover:underline"
                    onClick={() => handleUpdateStatus(activity as Booking)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-red-600 hover:underline"
                    onClick={() => handleCancelBooking(activity as Booking)}
                    disabled={(activity as Booking).status === "cancelled"}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <BookingDetailsDialog booking={selectedBooking} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      <UpdateStatusDialog
        bookingId={selectedBooking?.id ?? ""}
        currentStatus={selectedBooking?.status ?? "pending"}
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onUpdateStatus={handleStatusUpdate}
      />
      <CancelBookingDialog
        bookingId={selectedBooking?.id ?? ""}
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleBookingCancellation}
      />
    </Card>
  );
}
