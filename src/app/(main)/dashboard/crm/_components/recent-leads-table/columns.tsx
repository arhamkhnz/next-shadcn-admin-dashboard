"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronRight,
  Clock,
  EllipsisVertical,
  Mail,
  MessageSquare,
  Phone,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { RecentLeadRow } from "./schema";

const statusConfig: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
    label: string;
    color: string;
  }
> = {
  New: { variant: "outline", label: "New", color: "text-muted-foreground" },
  Contacted: { variant: "secondary", label: "Contacted", color: "text-blue-500" },
  Qualified: { variant: "default", label: "Qualified", color: "text-primary" },
  "Proposal Sent": { variant: "secondary", label: "Proposal", color: "text-purple-500" },
  Negotiation: { variant: "outline", label: "Negotiation", color: "text-orange-500" },
  Won: { variant: "default", label: "Won", color: "text-green-500" },
  Lost: { variant: "destructive", label: "Lost", color: "text-destructive" },
};

const sourceConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Website: { icon: <Users className="size-3" />, color: "text-primary" },
  Referral: { icon: <Users className="size-3" />, color: "text-green-500" },
  "Social Media": { icon: <MessageSquare className="size-3" />, color: "text-blue-500" },
  "Cold Outreach": { icon: <Mail className="size-3" />, color: "text-orange-500" },
  Other: { icon: <EllipsisVertical className="size-3" />, color: "text-muted-foreground" },
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const recentLeadsColumns: ColumnDef<RecentLeadRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Ref",
    cell: ({ row }) => <span className="font-mono text-muted-foreground text-xs tabular-nums">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Lead",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
            {getInitials(row.original.name)}
          </div>
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
              row.original.status === "Won"
                ? "bg-green-500"
                : row.original.status === "Lost"
                  ? "bg-destructive"
                  : row.original.status === "Negotiation"
                    ? "bg-orange-500"
                    : "bg-primary",
            )}
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{row.original.name}</p>
          </div>
          <p className="text-muted-foreground text-xs truncate">{row.original.company}</p>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusConfig[status] || statusConfig.New;

      return (
        <Badge
          variant={config.variant}
          className={cn(
            "h-5 text-[10px] font-medium",
            status === "Won" && "bg-green-500/10 text-green-500 hover:bg-green-500/20",
            status === "Qualified" && "bg-primary/10 text-primary hover:bg-primary/20",
            status === "Negotiation" && "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
            status === "Lost" && "bg-destructive/10 text-destructive hover:bg-destructive/20",
          )}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.original.source;
      const config = sourceConfig[source] || sourceConfig.Other;

      return (
        <div className="flex items-center gap-1.5">
          <span className={cn("flex size-5 items-center justify-center rounded-full bg-muted", config.color)}>
            {config.icon}
          </span>
          <span className="text-xs">{source}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastActivity",
    header: "Activity",
    cell: ({ row }) => {
      const activity = row.original.lastActivity;
      const isUrgent = activity.includes("ago") && (activity.includes("d") || activity.includes("day"));
      const isRecent = activity.includes("m") || activity.includes("h");

      return (
        <div className="flex items-center gap-1.5">
          <Clock
            className={cn(
              "size-3.5",
              isRecent ? "text-green-500" : isUrgent ? "text-destructive" : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "text-xs tabular-nums",
              isRecent ? "text-green-500 font-medium" : isUrgent ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {activity}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-primary">
          <Phone className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-primary">
          <Mail className="size-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
              <EllipsisVertical className="size-3.5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {row.original.name} · {row.original.id}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Users className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Phone className="mr-2 size-4" />
                Schedule Call
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Mail className="mr-2 size-4" />
                Send Email
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">Change Status</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <ChevronRight className="mr-2 size-4" />
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <TrendingUp className="mr-2 size-4 text-green-500" />
                Qualify Lead
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <TrendingDown className="mr-2 size-4 text-destructive" />
                Disqualify
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Users className="mr-2 size-4" />
                Assign to...
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <EllipsisVertical className="mr-2 size-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="cursor-pointer">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableHiding: false,
  },
];
