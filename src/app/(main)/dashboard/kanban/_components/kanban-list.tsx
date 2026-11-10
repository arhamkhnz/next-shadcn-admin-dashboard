"use client";

import { cn } from "cn";
import { FileText, Flame, type LucideIcon, MessageSquare, MoreVertical, Paperclip, Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getInitials } from "@/lib/utils";

import { tagTones } from "./data";
import { KanbanListDropGroup, SortableListTask } from "./kanban-list-dnd";
import { priorityBadgeConfig } from "./task-priority";
import { statusIcons } from "./task-status";
import type { BoardState, Column, TaskInsightLabel } from "./types";

const insightIcons: Record<TaskInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

export function KanbanList({ board, columns }: { board: BoardState; columns: readonly Column[] }) {
  return (
    <div className="min-w-0 pb-4">
      {columns.map((column) => {
        const tasks = board[column.id];
        const StatusIcon = statusIcons[column.id];
        const highPriorityCount = tasks.filter((task) => task.priority === "High").length;

        return (
          <KanbanListDropGroup key={column.id} columnId={column.id}>
            <Collapsible defaultOpen className="border-b">
              <div className="bg-muted/50 hover:bg-muted flex items-center gap-1 pr-3 lg:pr-4.5">
                <h2 className="min-w-0 flex-1">
                  <CollapsibleTrigger className="focus-visible:ring-ring flex min-h-10 w-full items-center gap-2 py-2 pr-3 pl-4 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset lg:pl-6">
                    <StatusIcon className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                    {column.title}
                    <span className="text-muted-foreground font-normal tabular-nums">
                      {tasks.length}
                      <span className="sr-only"> tasks</span>
                    </span>
                    {highPriorityCount > 0 && (
                      <span className="text-muted-foreground ml-auto hidden items-center gap-1.5 text-xs font-normal sm:flex">
                        <Flame className="text-destructive size-3.5" aria-hidden="true" />
                        {highPriorityCount} high priority
                      </span>
                    )}
                  </CollapsibleTrigger>
                </h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label={`Add task to ${column.title}`}
                >
                  <Plus />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label={`${column.title} group actions`}
                >
                  <MoreVertical />
                </Button>
              </div>
              <CollapsibleContent>
                <ul aria-label={`${column.title} tasks`}>
                  {tasks.map((task, index) => {
                    const priority = priorityBadgeConfig[task.priority];
                    const PriorityIcon = priority.icon;

                    return (
                      <SortableListTask key={task.id} task={task} columnId={column.id} index={index}>
                        <Badge
                          variant={priority.variant}
                          className={cn("size-5 rounded-sm p-0", priority.className)}
                          title={`${task.priority} priority`}
                        >
                          <PriorityIcon aria-hidden="true" />
                          <span className="sr-only">{task.priority} priority</span>
                        </Badge>
                        <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-4">
                          <span className="w-full truncate text-sm font-normal sm:w-auto sm:flex-1" title={task.title}>
                            {task.title}
                          </span>
                          <Badge variant="secondary" className={cn("shrink-0", tagTones[task.team])}>
                            {task.team}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground hidden shrink-0 items-center gap-2.5 text-xs tabular-nums sm:flex">
                          {task.insights
                            .filter((insight) => insight.count > 0)
                            .map((insight) => {
                              const InsightIcon = insightIcons[insight.label];

                              return (
                                <span
                                  key={insight.label}
                                  className="flex items-center gap-1"
                                  title={`${insight.count} ${insight.label.toLowerCase()}`}
                                >
                                  <InsightIcon className="size-3.5" aria-hidden="true" />
                                  {insight.count}
                                  <span className="sr-only">{insight.label.toLowerCase()}</span>
                                </span>
                              );
                            })}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                          <span className="sr-only">Due </span>
                          {task.dueDate}
                        </span>
                        <div className="flex shrink-0 items-center gap-1.5" title={task.owner.name}>
                          <Avatar className={cn("size-6 after:rounded-sm", task.owner.tone)}>
                            <AvatarFallback className="rounded-sm text-[11px]">
                              <span aria-hidden="true">{getInitials(task.owner.name)}</span>
                              <span className="sr-only">Assigned to {task.owner.name}</span>
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </SortableListTask>
                    );
                  })}
                  {tasks.length === 0 && <li className="text-muted-foreground px-4 py-6 text-sm lg:px-6">No tasks.</li>}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </KanbanListDropGroup>
        );
      })}
    </div>
  );
}
