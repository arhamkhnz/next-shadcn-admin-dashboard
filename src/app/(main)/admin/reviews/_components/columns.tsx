"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ReviewActions } from "@/app/(main)/admin/reviews/_components/review-actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useIsMobile } from "@/hooks/use-mobile";
import { type Review } from "@/types/database";

export const useReviewColumns = (): ColumnDef<Review>[] => {
  const isMobile = useIsMobile();

  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "bookingId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking ID" />,
    },
    {
      accessorKey: "userId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    },
    {
      accessorKey: "comment",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Comment" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const review = row.original;
        return <ReviewActions review={review} />;
      },
    },
  ];

  if (isMobile) {
    return columns.filter(
      (col) =>
        ("accessorKey" in col && col.accessorKey !== "bookingId" && col.accessorKey !== "userId") ||
        ("id" in col && col.id === "actions"),
    );
  }

  return columns;
};
