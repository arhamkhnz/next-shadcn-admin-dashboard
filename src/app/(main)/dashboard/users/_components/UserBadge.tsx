"use client"

interface UserBadgeProps {
  status: "Active" | "Disabled"
}

export function UserBadge({ status }: UserBadgeProps) {
  return (
    <span
      className={
        status === "Active"
          ? "text-emerald-600 font-medium"
          : "text-muted-foreground"
      }
    >
      {status}
    </span>
  )
}
