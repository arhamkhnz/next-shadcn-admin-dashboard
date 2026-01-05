"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Ban } from "lucide-react"
import { toast } from "sonner"

export function UserActions({ row, onEdit, onDelete, onSuspend }) {
  const user = row.original
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  })

  // 🔧 Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const { name, email } = formData

    // 🧩 Validation de base
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email cannot be empty.")
      return
    }

    if (!email.includes("@")) {
      toast.error("Invalid email format.")
      return
    }

    // ✅ Met à jour uniquement name + email
    onEdit({ ...user, name, email })
    toast.success(`User ${name} updated successfully`)
    setOpen(false)
  }

  const handleSuspend = () => {
    onSuspend(user.id)
    toast.warning(`${user.name} has been suspended`)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDelete(user.id)
      toast.error(`${user.name} deleted`)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className="mr-2 h-4 w-4 text-blue-600" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSuspend}>
            <Ban className="mr-2 h-4 w-4 text-yellow-600" /> Suspend
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🧩 Modale d’édition restreinte à name + email */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
