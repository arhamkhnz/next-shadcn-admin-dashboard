import type { Metadata } from "next";

import { KpiCards } from "./_components/kpi-cards";
import { OpportunitiesSection } from "./_components/opportunities-section";
import { PipelineActivity } from "./_components/pipeline-activity";
import { TaskReminders } from "./_components/task-reminders";

export const metadata: Metadata = {
  title: "Dashboard de CRM de código aberto com shadcn/ui",
  description:
    "Explore um dashboard CRM de código aberto com atividade de pipeline, oportunidades, desempenho de vendas e lembretes de tarefas.",
  alternates: {
    canonical: "/dashboard/crm",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <KpiCards />
      <PipelineActivity />
      <TaskReminders />
      <OpportunitiesSection />
    </div>
  );
}
