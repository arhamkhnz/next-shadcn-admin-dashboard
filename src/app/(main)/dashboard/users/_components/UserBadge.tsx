"use client"

import { cn } from "@/lib/utils"

interface UserBadgeProps {
  status: "Active" | "Pending" | "Suspended"
}

export function UserBadge({ status }: UserBadgeProps) {
  const colors = {
    Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    Suspended: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2 py-[2px] text-xs font-semibold capitalize transition-all duration-200 hover:scale-[1.05]",
        colors[status]
      )}
    >
      {status}
    </span>
  )
}
