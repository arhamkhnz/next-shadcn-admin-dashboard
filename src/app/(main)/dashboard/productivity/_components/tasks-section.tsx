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
  { title: "Finalizar roadmap do T2", tag: "Trabalho", time: "10:00", checked: false },
  { title: "Revisar atualizações do design system", tag: "Design", time: "11:30", checked: true },
  { title: "Responder e-mails importantes", tag: "Administrativo", time: "14:00", checked: false },
  { title: "Planejar conteúdo da semana", tag: "Conteúdo", time: "16:30", checked: false },
  { title: "Preparar notas da reunião semanal", tag: "Planejamento", time: "18:00", checked: false },
];

export function TasksSection() {
  const [items, setItems] = React.useState(tasks);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Tarefas</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Hoje" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="tomorrow">Amanhã</SelectItem>
                <SelectItem value="this-week">Esta semana</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <Plus data-icon="inline-start" />
            Nova tarefa
          </Button>
        </div>
      </div>

      <div className="bg-background overflow-hidden rounded-xl border shadow-xs">
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
                  <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-sm">
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
