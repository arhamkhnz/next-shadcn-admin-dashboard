import { BookOpenCheck, Megaphone, Plus } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

import { AssignmentStatus } from "./_components/assignment-status";
import { ClassSchedule } from "./_components/class-schedule";
import { KpiCards } from "./_components/kpi-cards";
import { PerformanceHighlights } from "./_components/performance-highlights";
import { UpcomingEvents } from "./_components/upcoming-events";

export const metadata: Metadata = {
  title: "Painel de academia open source com shadcn/ui",
  description:
    "Explore um painel de academia open source com grade de aulas, atividades, insights de desempenho e próximos eventos.",
  alternates: {
    canonical: "/dashboard/academy",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Painel da Academia</h1>
          <p className="text-muted-foreground text-sm">
            Bom dia, professor. Aqui está um resumo rápido da agenda de hoje.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:w-fit">
          <Button size="sm">
            <Megaphone />
            Novo anúncio
          </Button>
          <Button size="sm" variant="outline">
            <BookOpenCheck />
            Diário de notas
          </Button>
          <Button size="sm" variant="outline">
            <Plus />
            Adicionar atividade
          </Button>
        </div>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <ClassSchedule />
        </div>
        <div className="xl:col-span-7">
          <AssignmentStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <PerformanceHighlights />
        </div>
        <div className="xl:col-span-4">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
