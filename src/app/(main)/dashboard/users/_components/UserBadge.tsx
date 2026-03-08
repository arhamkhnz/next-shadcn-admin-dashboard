"use client"

import type { UserStatus } from "../_data/users"

interface UserBadgeProps {
  status: UserStatus
}

export function UserBadge({ status }: UserBadgeProps) {
  const label =
    status.charAt(0).toUpperCase() + status.slice(1)

  const color =
    status === "active"
      ? "text-emerald-600"
      : status === "pending"
      ? "text-yellow-600"
      : "text-muted-foreground"

  return (
    <span className={`${color} font-medium`}>
      {label}
    </span>
  )
}