"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { User } from "./types";
import { UserForm } from "./user-form";

interface UserDialogProps {
  user: User;
  children: React.ReactNode;
}

export function UserDialog({ user, children }: UserDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the details of the user.</DialogDescription>
        </DialogHeader>
        <UserForm user={user} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
