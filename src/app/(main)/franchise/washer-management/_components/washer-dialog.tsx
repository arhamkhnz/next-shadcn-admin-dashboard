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
import { WasherWithBranch } from "@/stores/franchise-dashboard/user-store";

import { WasherForm } from "./washer-form";

interface WasherDialogProps {
  washer?: WasherWithBranch;
  children: React.ReactNode;
  onDialogClose?: () => void;
}

export function WasherDialog({ washer, children, onDialogClose }: WasherDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onDialogClose) {
      onDialogClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{washer ? "Edit" : "Add"} Washer</DialogTitle>
          <DialogDescription>
            {washer ? "Update the details of this washer." : "Add a new washer to your system."}
          </DialogDescription>
        </DialogHeader>
        <WasherForm washer={washer} onSuccess={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
