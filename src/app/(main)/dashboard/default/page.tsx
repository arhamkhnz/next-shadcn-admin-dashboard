import type { Metadata } from "next";

import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export const metadata: Metadata = {
  title: "Dashboard de negócios open source com shadcn/ui",
  description:
    "Explore um dashboard administrativo open source com métricas de negócio, atividade de clientes, gráficos de desempenho e dados de clientes.",
  alternates: {
    canonical: "/dashboard/default",
  },
};

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <MetricCards />
      <PerformanceOverview />
      <SubscriberOverview />
    </div>
  );
}
