"use client";

import { useState } from "react";

import { Tag } from "lucide-react";

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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface BulkAddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onConfirm: (tag: string) => void;
}

export function BulkAddTagDialog({ open, onOpenChange, count, onConfirm }: BulkAddTagDialogProps) {
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setTag("");
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  function handleConfirm() {
    const trimmed = tag.trim();
    if (!trimmed) {
      setError("Tag name is required.");
      return;
    }
    if (trimmed.length > 50) {
      setError("Tag must be 50 characters or fewer.");
      return;
    }
    onConfirm(trimmed);
    handleOpenChange(false);
  }

  const label = count === 1 ? "deal" : "deals";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="size-4" />
            Add Tag to {count} {label}
          </DialogTitle>
          <DialogDescription>
            Enter a tag to add to the selected {label}. The tag will be appended to existing tags.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4 py-2">
          <Field className="gap-1.5" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="bulk-tag-name">
              Tag Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="bulk-tag-name"
              placeholder="e.g. enterprise, priority-lead"
              value={tag}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setTag(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
            />
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
        </FieldGroup>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm} className="gap-1.5">
            <Tag className="size-3.5" />
            Add Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
