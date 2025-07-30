"use client";

import Link from "next/link";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { Washer } from "./types";
import { WasherDialog } from "./washer-dialog";

export function WasherBadge({ washer }: { washer: Washer }) {
  return (
    <Badge variant={washer.status === "active" ? "default" : "destructive"}>
      {washer.status === "active" ? "Active" : "Inactive"}
    </Badge>
  );
}

export function WasherActions({ washer }: { washer: Washer }) {
  const { deleteWasher } = useWasherStore();

  return (
    <AlertDialog>
      <DropdownMenu>
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
          <WasherDialog washer={washer}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Washer</DropdownMenuItem>
          </WasherDialog>
          <Link href={`/admin/washers/${washer.id}/schedule`}>
            <DropdownMenuItem>Manage Schedule</DropdownMenuItem>
          </Link>
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
