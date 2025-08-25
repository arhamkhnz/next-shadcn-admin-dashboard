import type { Booking, Branch, Service, Washer } from "@/types/franchise";

export interface EnrichedBooking extends Omit<Booking, "user_id" | "branch_id" | "service_id" | "scheduled_at"> {
  user: string;
  branch: string;
  service: string;
  date: string;
}

export const enrichBookings = (
  bookings: Booking[],
  branches: Branch[],
  washers: Washer[],
  services: Service[],
): EnrichedBooking[] => {
  if (!bookings?.length) return [];

  return bookings.map((booking) => ({
    ...booking,
    user: `User ${booking.user_id.slice(0, 8)}`, // Simplified user representation
    branch: branches.find((b) => b.id === booking.branch_id)?.name ?? booking.branch_id,
    service: services.find((s) => s.id === booking.service_id)?.name ?? booking.service_id,
    date: booking.scheduled_at,
  }));
};

export const getDailyBookings = (bookings: { scheduled_at: string }[] = []) => {
  const counts: Record<string, number> = {};

  for (const booking of bookings) {
    if (!booking?.scheduled_at) continue;
    const date = booking.scheduled_at.slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }

  return Object.entries(counts).map(([date, count]) => ({ date, count }));
};
