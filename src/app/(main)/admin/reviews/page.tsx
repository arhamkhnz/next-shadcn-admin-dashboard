"use client";

import { ReviewList } from "./_components/review-list";

export default function ReviewsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
      <ReviewList />
    </div>
  );
}
