import { addDays, format } from "date-fns";
import { Globe, Orbit, Plus, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const today = new Date();

const projects = [
  {
    title: "Q2 Roadmap",
    status: "In Progress",
    description: "Ship better, ship smarter.",
    progress: 68,
    due: `Due ${format(addDays(today, 9), "MMM d")}`,
    icon: Orbit,
  },
  {
    title: "Website Redesign",
    status: "Planning",
    description: "Clean, modern, and fast.",
    progress: 42,
    due: `Due ${format(addDays(today, 21), "MMM d")}`,
    icon: Globe,
  },
  {
    title: "Creator Hub",
    status: "In Progress",
    description: "Build once, create more.",
    progress: 75,
    due: `Due ${format(addDays(today, 4), "MMM d")}`,
    icon: Sparkles,
  },
] as const;

export function ProjectsSection() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Projects</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="active">
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            New
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} className="shadow-xs">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <project.icon className="size-4 text-muted-foreground" />
                  <span>{project.title}</span>
                </div>
              </CardTitle>
              <CardAction>
                <Badge variant="outline">{project.status}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="text-sm leading-none">{project.description}</div>
                <div className="flex items-center gap-3">
                  <Progress value={project.progress} className="h-2" />
                  <span className="shrink-0 text-sm">{project.progress}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-2.5">
              <span className="text-muted-foreground">{project.due}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
