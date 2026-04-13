import { CheckSquare, FileText, Focus, Orbit, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "New Note", icon: FileText },
  { label: "New Task", icon: CheckSquare },
  { label: "New Project", icon: Orbit },
  { label: "New Goal", icon: Focus },
  { label: "Upload", icon: Upload },
] as const;

export function QuickActions() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {quickActions.map((action) => (
          <Button key={action.label} variant="outline" className="justify-start">
            <action.icon data-icon="inline-start" />
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
