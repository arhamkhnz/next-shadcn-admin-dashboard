import { CheckSquare, FileText, Focus, Orbit, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Nova nota", icon: FileText },
  { label: "Nova tarefa", icon: CheckSquare },
  { label: "Novo projeto", icon: Orbit },
  { label: "Nova meta", icon: Focus },
  { label: "Enviar arquivo", icon: Upload },
] as const;

export function QuickActions() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">Ações rápidas</h2>
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
