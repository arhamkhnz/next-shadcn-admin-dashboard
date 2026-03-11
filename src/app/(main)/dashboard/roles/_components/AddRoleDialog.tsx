"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import type { Role } from "../_data/roles"

const RESERVED_ROLE_NAMES = ["admin", "super_admin", "root"]

function normalizeRoleName(value: string): string {
  const normalized = value.trim().toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

interface AddRoleDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (role: Role) => void
  existingRoles: Role[]
}

export function AddRoleDialog({
  open,
  onClose,
  onConfirm,
  existingRoles,
}: AddRoleDialogProps) {
  const [loading, setLoading] = React.useState(false)

  const schema = React.useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(2, "Name is too short")
          .max(50)
          .refine(
            (v) => !RESERVED_ROLE_NAMES.includes(v.toLowerCase()),
            "This role name is reserved"
          )
          .refine(
            (v) =>
              !existingRoles.some(
                (r) => r.name.toLowerCase() === v.toLowerCase()
              ),
            "A role with this name already exists"
          ),
        description: z.string().max(255).optional().or(z.literal("")),
      }),
    [existingRoles]
  )

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true)

      const newRole: Role = {
        id: crypto.randomUUID(),
        name: normalizeRoleName(values.name),
        description: values.description?.trim() || "",
        usersCount: 0,
        status: "Active",
        isSystem: false,
        createdAt: new Date().toISOString(),
        permissions: [],
      }

      toast.success("Role created successfully")
      form.reset()
      onConfirm(newRole)
      onClose()
    } catch {
      toast.error("Failed to create role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add role</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Create role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}