"use client";

import { Button } from "@/components/ui/button";
import { Review } from "@/types/database";

export function ReviewActions({ review }: { review: Review }) {
  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => alert(`Viewing review ${review.id}`)}>
        View
      </Button>
      <Button variant="ghost" size="sm" onClick={() => alert(`Deleting review ${review.id}`)}>
        Delete
      </Button>
    </div>
  );
}
