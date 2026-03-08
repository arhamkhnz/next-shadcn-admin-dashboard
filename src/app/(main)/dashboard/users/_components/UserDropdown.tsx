"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { toast } from "sonner"
import type { UserRole, UserStatus } from "../_data/users"

interface UserDropdownProps {
  userId: number
  currentRole: UserRole
  currentStatus: UserStatus
  onUpdate?: (
    id: number,
    field: "role" | "status",
    value: string
  ) => void
}

const roles: UserRole[] = ["admin", "editor", "viewer"]
const statuses: UserStatus[] = ["active", "pending", "suspended"]

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

export function UserDropdown({
  userId,
  currentRole,
  currentStatus,
  onUpdate,
}: UserDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Role */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[140px] justify-between truncate"
          >
            {capitalize(currentRole)}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {roles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => {
                onUpdate?.(userId, "role", role)
                toast.success(`Role updated to ${capitalize(role)}`)
              }}
            >
              {capitalize(role)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[140px] justify-between truncate"
          >
            {capitalize(currentStatus)}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statuses.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => {
                onUpdate?.(userId, "status", status)
                toast.success(
                  `Status changed to ${capitalize(status)}`
                )
              }}
            >
              {capitalize(status)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}