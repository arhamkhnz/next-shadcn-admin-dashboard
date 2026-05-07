"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Headphones, Heart, MessageCircle, MoreHorizontal, Play, Trash2 } from "lucide-react";

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

import type { PostRow } from "./schema";

export const postColumns: ColumnDef<PostRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[200px]">
        <span className="font-medium text-sm truncate">{row.original.title}</span>
        <span className="text-xs text-muted-foreground">{row.original.author}</span>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <div className="text-sm">{row.original.duration}</div>,
  },
  {
    accessorKey: "listens",
    header: "Stats",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Headphones className="h-3 w-3" /> {row.original.listens}
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3" /> {row.original.likes}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3" /> {row.original.replies}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "Published" ? "default" : status === "Flagged" ? "destructive" : "secondary"}
          className="rounded-full px-2.5"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => <div className="text-sm">{new Date(row.original.timestamp).toLocaleDateString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Play className="mr-2 h-4 w-4" /> Listen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Remove Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
