"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "cn";
import { FileText, type LucideIcon, MessageSquare, Paperclip } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { getInitials } from "@/lib/utils";

import { tagTones } from "./data";
import { priorityBadgeConfig } from "./task-priority";
import { statusIcons } from "./task-status";
import type { Column, ColumnId, Task, TaskInsightLabel } from "./types";

export type TaskTableRow = Task & { status: Column };

const insightIcons: Record<TaskInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

export function createTaskTableColumns(
  columns: readonly Column[],
  onStatusChange: (taskId: string, status: ColumnId) => void,
): ColumnDef<DataTableFeatures, TaskTableRow>[] {
  return [
    {
      id: "drag",
      header: "",
      size: 48,
      minSize: 48,
      maxSize: 48,
      cell: () => null,
    },
    {
      accessorKey: "title",
      header: "Task",
      size: 360,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-4">
          <span className="min-w-0 flex-1 truncate" title={row.original.description}>
            {row.original.title}
          </span>
          <span className="text-muted-foreground flex shrink-0 items-center gap-2.5 text-xs tabular-nums">
            {row.original.insights
              .filter((insight) => insight.count > 0)
              .map((insight) => {
                const Icon = insightIcons[insight.label];

                return (
                  <span key={insight.label} className="flex items-center gap-1" title={insight.label}>
                    <Icon className="size-3.5" aria-hidden="true" />
                    {insight.count}
                    <span className="sr-only">{insight.label.toLowerCase()}</span>
                  </span>
                );
              })}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      accessorFn: (task) => task.status.title,
      header: "Status",
      size: 140,
      cell: ({ row }) => {
        const Icon = statusIcons[row.original.status.id];

        return (
          <Select
            value={row.original.status.id}
            onValueChange={(value) => {
              const status = columns.find((column) => column.id === value);
              if (status) {
                onStatusChange(row.id, status.id);
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-fit gap-1.5 border-transparent bg-transparent px-0 shadow-none"
              aria-label={`Change status for ${row.original.title}`}
            >
              <Icon className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 120,
      cell: ({ row }) => {
        const priority = priorityBadgeConfig[row.original.priority];
        const Icon = priority.icon;

        return (
          <Badge variant={priority.variant} className={cn("rounded-md px-2", priority.className)}>
            <Icon data-icon="inline-start" aria-hidden="true" />
            {row.original.priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "team",
      header: "Team",
      size: 140,
      cell: ({ row }) => (
        <Badge variant="secondary" className={tagTones[row.original.team]}>
          {row.original.team}
        </Badge>
      ),
    },
    {
      id: "owner",
      accessorFn: (task) => task.owner.name,
      header: "Owner",
      size: 190,
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5">
          <Avatar className={cn("size-6 after:rounded-sm", row.original.owner.tone)}>
            <AvatarFallback className="rounded-sm text-[11px]" aria-hidden="true">
              {getInitials(row.original.owner.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground truncate">{row.original.owner.name}</span>
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due date",
      size: 160,
      cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.dueDate}</span>,
    },
  ];
}
