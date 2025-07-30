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

import { Washer } from "./types";
import { WasherForm } from "./washer-form";

interface WasherDialogProps {
  washer?: Washer;
  children: React.ReactNode;
}

export function WasherDialog({ washer, children }: WasherDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{washer ? "Edit" : "Add"} Washer</DialogTitle>
          <DialogDescription>
            {washer ? "Update the details of the washer." : "Add a new washer to your system."}
          </DialogDescription>
        </DialogHeader>
        <WasherForm washer={washer} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
