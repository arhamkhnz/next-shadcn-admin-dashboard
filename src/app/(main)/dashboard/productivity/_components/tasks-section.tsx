"use client";

import * as React from "react";

import { Calendar1, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Task = {
  title: string;
  tag: string;
  time: string;
  checked: boolean;
};

const tasks: Task[] = [
  { title: "Finalize Q2 roadmap", tag: "Work", time: "10:00 AM", checked: false },
  { title: "Review design system updates", tag: "Design", time: "11:30 AM", checked: true },
  { title: "Reply to important emails", tag: "Admin", time: "2:00 PM", checked: false },
  { title: "Plan creator content for this week", tag: "Content", time: "4:30 PM", checked: false },
  { title: "Prepare weekly team sync notes", tag: "Planning", time: "6:00 PM", checked: false },
];

export function TasksSection() {
  const [items, setItems] = React.useState(tasks);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Tasks</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <Plus data-icon="inline-start" />
            New Task
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
        <div className="divide-y">
          {items.map((task) => (
            <div key={task.title} className="flex items-center gap-2 p-4">
              <Checkbox
                checked={task.checked}
                aria-label={task.title}
                onCheckedChange={(checked) => {
                  setItems((current) =>
                    current.map((item) => (item.title === task.title ? { ...item, checked: checked === true } : item)),
                  );
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                    <span className="truncate text-sm">{task.title}</span>
                    <Badge variant="outline" className="px-3 py-1 font-normal">
                      {task.tag}
                    </Badge>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-muted-foreground text-sm">
                    <span>{task.time}</span>
                    <Calendar1 className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
