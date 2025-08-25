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

import { BranchForm } from "./branch-form";
import { Branch } from "./types";

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
      <DialogContent className="flex h-[95vh] max-h-[95vh] max-w-[95vw] flex-col gap-0 p-0 sm:max-w-4xl sm:rounded-lg md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <div className="bg-background sticky top-0 z-10 border-b p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl">{branch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
            <DialogDescription>
              {branch ? "Update the details of the branch." : "Add a new branch to your system."}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <BranchForm branch={branch} onSuccess={() => handleOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
