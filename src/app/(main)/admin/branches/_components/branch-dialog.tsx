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
}

export function BranchDialog({ branch, children }: BranchDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit" : "Add"} Branch</DialogTitle>
          <DialogDescription>
            {branch ? "Update the details of the branch." : "Add a new branch to your system."}
          </DialogDescription>
        </DialogHeader>
        <BranchForm branch={branch} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
