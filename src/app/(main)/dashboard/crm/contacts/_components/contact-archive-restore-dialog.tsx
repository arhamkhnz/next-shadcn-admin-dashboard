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

type ContactArchiveRestoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "archive" | "restore";
  count: number;
  contactName?: string;
  onConfirm: () => void;
};

export function ContactArchiveRestoreDialog({
  open,
  onOpenChange,
  mode,
  count,
  contactName,
  onConfirm,
}: ContactArchiveRestoreDialogProps) {
  const isArchive = mode === "archive";

  if (count === 1 && contactName) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArchive ? "Archive contact?" : "Restore contact?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArchive
                ? "This contact will be removed from active views but can be restored later. Related company, deal, and activity history will be preserved."
                : "This contact will return to the active contact views."}
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
              {isArchive ? "Archive Contact" : "Restore Contact"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const label = count === 1 ? "contact" : "contacts";

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
            {isArchive ? "Archive Contact" : "Restore Contact"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
