"use client";

import { useState } from "react";

import { MoreHorizontal } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFranchiseUserStore, Washer } from "@/stores/franchise-dashboard/user-store";

import { WasherDialog } from "./washer-dialog";

interface WasherActionsProps {
  washer: Washer;
}

export function WasherActions({ washer }: WasherActionsProps) {
  const { deleteWasher } = useFranchiseUserStore();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <AlertDialog>
      <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(washer.id)}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <WasherDialog washer={washer} onDialogClose={() => setMenuOpen(false)}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Washer</DropdownMenuItem>
          </WasherDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-600">Delete Washer</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the washer and all their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteWasher(washer.id)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
