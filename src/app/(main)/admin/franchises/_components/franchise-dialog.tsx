"use client";

import { useState } from "react";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FranchiseForm } from "./franchise-form";
import { Franchise } from "./types";

interface FranchiseDialogProps {
  franchise?: Franchise;
  children: React.ReactNode;
}

export function FranchiseDialog({ franchise, children }: FranchiseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{franchise ? "Edit" : "Add"} Franchise</DialogTitle>
          <DialogDescription>
            {franchise ? "Update the details of the franchise." : "Add a new franchise to your system."}
          </DialogDescription>
        </DialogHeader>
        {!franchise && (
          <p className="text-muted-foreground text-sm">
            Note: The franchise admin will need to confirm their email address after creation.
          </p>
        )}
        <FranchiseForm franchise={franchise} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
