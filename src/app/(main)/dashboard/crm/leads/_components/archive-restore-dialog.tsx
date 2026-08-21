"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ArchiveRestoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "archive" | "restore";
  count: number;
  onConfirm: () => void;
};

export function ArchiveRestoreDialog({ open, onOpenChange, mode, count, onConfirm }: ArchiveRestoreDialogProps) {
  const isArchive = mode === "archive";
  const label = count === 1 ? "lead" : "leads";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isArchive ? "Archive" : "Restore"} {count} {label}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isArchive
              ? `This will archive ${count} ${label}. Archived ${label} will be hidden from active views but can be restored later.`
              : `This will restore ${count} ${label} back to active views.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={isArchive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {isArchive ? "Archive" : "Restore"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
