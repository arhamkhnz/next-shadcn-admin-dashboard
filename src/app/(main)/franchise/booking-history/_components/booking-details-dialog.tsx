import { EnrichedBooking } from "@/app/(main)/franchise/utils/bookings";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BookingDetailsDialogProps {
  booking: EnrichedBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsDialog({ booking, isOpen, onClose }: BookingDetailsDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>Details for booking ID: {booking.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <strong>User:</strong> {booking.user}
          </div>
          <div>
            <strong>Branch:</strong> {booking.branch}
          </div>
          <div>
            <strong>Service:</strong> {booking.service}
          </div>
          <div>
            <strong>Status:</strong> {booking.status}
          </div>
          <div>
            <strong>Date:</strong> {new Date(booking.date).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
