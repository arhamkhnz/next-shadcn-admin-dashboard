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
import { Branch } from "@/stores/franchise-dashboard/branch-store";

import { BranchForm } from "./branch-form";

interface BranchDialogProps {
  branch?: Branch;
  children: React.ReactNode;
  onDialogClose?: () => void;
}

export function BranchDialog({ branch, children, onDialogClose }: BranchDialogProps) {
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit" : "Add"} Branch</DialogTitle>
          <DialogDescription>
            {branch ? "Update the details of the branch." : "Add a new branch to your system."}
          </DialogDescription>
        </DialogHeader>
        <BranchForm branch={branch} onSuccess={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
