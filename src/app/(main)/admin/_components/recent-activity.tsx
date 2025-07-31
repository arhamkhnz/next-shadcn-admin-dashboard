"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";
import { useReviewStore } from "@/stores/admin-dashboard/review-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

export function RecentActivity() {
  const { payments } = usePaymentStore();
  const { reviews } = useReviewStore();
  const { users } = useUserStore();

  const combinedActivity = [
    ...payments.map((p) => ({ ...p, type: "payment", date: new Date(p.created_at) })),
    ...reviews.map((r) => {
      const user = users.find((u) => u.id === r.userId);
      return { ...r, type: "review", date: new Date(), user }; // Mocking date for reviews
    }),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {combinedActivity.slice(0, 5).map((activity, index) => (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
              {activity.type === "review" && activity.user && (
                <>
                  <AvatarImage src={`/avatars/${activity.user.name.toLowerCase().replace(" ", "")}.png`} alt="Avatar" />
                  <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                </>
              )}
              {activity.type === "payment" && (
                <span className="bg-muted flex h-full w-full items-center justify-center rounded-full">$</span>
              )}
            </Avatar>
            <div className="ml-4 space-y-1">
              {activity.type === "review" && (
                <p className="text-sm leading-none font-medium">New review from {activity.user?.name}</p>
              )}
              {activity.type === "payment" && (
                <p className="text-sm leading-none font-medium">
                  Payment of ${activity.amount.toFixed(2)} {activity.status}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                {activity.type === "review" ? activity.comment : `Booking ID: ${activity.booking_id}`}
              </p>
            </div>
            <div className="text-muted-foreground ml-auto text-sm font-medium">
              {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(activity.date)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
