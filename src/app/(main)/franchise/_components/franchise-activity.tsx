"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

export function FranchiseActivity() {
  const { bookings, washers, services } = useFranchiseDashboardStore();

  // Combine and sort activities by date
  const recentActivity = [...bookings]
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 5) // Get the 5 most recent activities
    .map((booking) => {
      const washer = washers.find((w) => w.id === booking.user_id);
      const service = services.find((s) => s.id === booking.service_id);
      return {
        id: booking.id,
        type: "booking",
        date: new Date(booking.scheduled_at),
        description: `New booking for ${service ? service.name : "a service"}`,
        user: washer ? washer.name : "Unknown Washer",
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/${activity.user.toLowerCase().replace(" ", "")}.png`} alt="Avatar" />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm leading-none font-medium">{activity.description}</p>
                <p className="text-muted-foreground text-sm">
                  By {activity.user} - {activity.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No recent activity to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
