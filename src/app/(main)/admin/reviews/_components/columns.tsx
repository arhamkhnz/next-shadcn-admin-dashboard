"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Review } from "@/types/database";

import { ReviewActions } from "./review-actions";

export const columns: ColumnDef<Review>[] = [
  { accessorKey: "bookingId", header: "Booking ID" },
  { accessorKey: "userId", header: "User ID" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "comment", header: "Comment" },
  {
    id: "actions",
    cell: ({ row }) => {
      const review = row.original;
      return <ReviewActions review={review} />;
    },
  },
];
