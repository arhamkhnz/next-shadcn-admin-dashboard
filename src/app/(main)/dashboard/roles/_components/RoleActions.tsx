"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import type { Role } from "../_data/roles"

interface RoleActionsProps {
  role: Role
  canManage: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleActions({ role, canManage, onEdit, onDelete }: RoleActionsProps) {
  const [openDelete, setOpenDelete] = React.useState(false)

  const isSystemRole = role.isSystem === true
  const canEditDelete = canManage && !isSystemRole

  const handleDelete = () => {
    onDelete(role)
    toast.success("Role deleted successfully")
    setOpenDelete(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Role actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="w-full">
                <DropdownMenuItem
                  disabled={!canEditDelete}
                  onClick={() => canEditDelete && onEdit(role)}
                >
                  Edit
                </DropdownMenuItem>
              </span>
            </TooltipTrigger>
            {!canManage ? (
              <TooltipContent>Action disabled</TooltipContent>
            ) : isSystemRole ? (
              <TooltipContent>System roles cannot be edited</TooltipContent>
            ) : null}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="w-full">
                <DropdownMenuItem
                  disabled={!canEditDelete}
                  className={
                    canEditDelete
                      ? "text-destructive focus:text-destructive"
                      : "text-muted-foreground"
                  }
                  onClick={() => canEditDelete && setOpenDelete(true)}
                >
                  Delete
                </DropdownMenuItem>
              </span>
            </TooltipTrigger>
            {!canManage ? (
              <TooltipContent>Action disabled</TooltipContent>
            ) : isSystemRole ? (
              <TooltipContent>System roles cannot be deleted</TooltipContent>
            ) : null}
          </Tooltip>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete role</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The role will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}