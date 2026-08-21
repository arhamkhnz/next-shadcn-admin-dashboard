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

type CompanyArchiveRestoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "archive" | "restore";
  count: number;
  companyName?: string;
  onConfirm: () => void;
};

export function CompanyArchiveRestoreDialog({
  open,
  onOpenChange,
  mode,
  count,
  companyName,
  onConfirm,
}: CompanyArchiveRestoreDialogProps) {
  const isArchive = mode === "archive";

  if (count === 1 && companyName) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArchive ? "Archive company?" : "Restore company?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArchive
                ? "This company will be removed from active views but can be restored later. Related contacts, leads, deals, activities, and notes will be preserved."
                : "This company will return to the active company views with its related CRM history preserved."}
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
              {isArchive ? "Archive Company" : "Restore Company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const label = count === 1 ? "company" : "companies";

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
            {isArchive ? "Archive Company" : "Restore Company"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
