"use client";

import { DataTable } from "@/components/data-table/data-table";
import { useReviewStore } from "@/stores/admin-dashboard/review-store";

import { columns } from "./columns";

export function ReviewList() {
  const reviews = useReviewStore((state) => state.reviews);

  return (
    <div>
      <DataTable columns={columns} data={reviews} />
    </div>
  );
}
