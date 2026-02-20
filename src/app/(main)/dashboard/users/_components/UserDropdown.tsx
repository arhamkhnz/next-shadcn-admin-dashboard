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

interface UserDropdownProps {
  userId: number
  currentRole: string
  currentStatus: string
  onUpdate: (id: number, field: string, value: string) => void
}

const roles = ["Admin", "Editor", "Viewer"]
const statuses = ["Active", "Pending", "Suspended"]

export function UserDropdown({
  userId,
  currentRole,
  currentStatus,
  onUpdate,
}: UserDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Role menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 capitalize text-xs font-medium transition-all duration-150 hover:shadow-sm"
          >
            {currentRole}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {roles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => {
                onUpdate(userId, "role", role)
                toast.success(`Role updated to ${role}`)
              }}
            >
              {role}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 capitalize text-xs font-medium transition-all duration-150 hover:shadow-sm"
          >
            {currentStatus}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {statuses.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => {
                onUpdate(userId, "status", status)
                toast.success(`Status changed to ${status}`)
              }}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
