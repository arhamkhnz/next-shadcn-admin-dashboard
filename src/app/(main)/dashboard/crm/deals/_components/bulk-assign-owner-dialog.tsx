"use client";

import { useState } from "react";

import { User } from "lucide-react";

import { salesOwners } from "@/app/(main)/dashboard/crm/_components/crm-data/sales-team";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BulkAssignOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: (ownerId: string) => void;
}

export function BulkAssignOwnerDialog({ open, onOpenChange, count, onConfirm }: BulkAssignOwnerDialogProps) {
  const [ownerId, setOwnerId] = useState<string>("");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setOwnerId("");
    onOpenChange(nextOpen);
  }

  function handleConfirm() {
    if (!ownerId) return;
    onConfirm(ownerId);
    handleOpenChange(false);
  }

  const label = count === 1 ? "deal" : "deals";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-4" />
            Assign Owner to {count} {label}
          </DialogTitle>
          <DialogDescription>Select a sales owner to assign to the selected {label}.</DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5">
            <FieldLabel>
              New Owner <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {salesOwners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" disabled={!ownerId} onClick={handleConfirm}>
            Assign Owner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
