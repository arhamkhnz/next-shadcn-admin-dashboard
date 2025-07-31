"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReviewStore } from "@/stores/admin-dashboard/review-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

export function RecentReviews() {
  const { reviews } = useReviewStore();
  const { users } = useUserStore();

  const reviewsWithUsers = reviews.map((review) => {
    const user = users.find((user) => user.id === review.userId);
    return { ...review, user };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviewsWithUsers.map((review) => (
          <div key={review.id} className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={`/avatars/${review.user?.name.toLowerCase().replace(" ", "")}.png`} />
              <AvatarFallback>{review.user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-semibold">{review.user?.name}</p>
              <p className="text-muted-foreground text-sm">{review.comment}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
