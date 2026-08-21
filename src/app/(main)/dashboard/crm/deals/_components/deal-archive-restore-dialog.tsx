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

type DealArchiveRestoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "archive" | "restore";
  count: number;
  dealName?: string;
  onConfirm: () => void;
};

export function DealArchiveRestoreDialog({
  open,
  onOpenChange,
  mode,
  count,
  dealName,
  onConfirm,
}: DealArchiveRestoreDialogProps) {
  const isArchive = mode === "archive";

  if (count === 1 && dealName) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArchive ? "Archive deal?" : "Restore deal?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArchive
                ? "This deal will be removed from active views and the pipeline but can be restored later. Activities, notes, tasks, and related records will be preserved."
                : "This deal will return to the active views and its existing pipeline stage."}
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
              {isArchive ? "Archive Deal" : "Restore Deal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const label = count === 1 ? "deal" : "deals";

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
            {isArchive ? "Archive Deal" : "Restore Deal"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
