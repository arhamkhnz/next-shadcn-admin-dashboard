import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export const metadata: Metadata = {
  title: "Painel de análises open source com shadcn/ui",
  description:
    "Explore um painel de análises open source com métricas de tráfego, visitantes em tempo real, desempenho de páginas e insights de conversão.",
  alternates: {
    canonical: "/dashboard/analytics",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Olá, Aiy</h1>
        <p className="text-muted-foreground text-sm">Acompanhe tráfego, engajamento e conversões em uma única visão.</p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="gap-1">
            <TabsTrigger value="overview">Visão geral</TabsTrigger>
            <TabsTrigger value="audience">Público</TabsTrigger>
            <TabsTrigger value="acquisition">Aquisição</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="conversions">Conversões</TabsTrigger>
          </TabsList>

          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <AnalyticsKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TopPages />
            </div>
            <div className="xl:col-span-5 xl:col-start-8">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audience">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Visualização de público em breve.
          </div>
        </TabsContent>

        <TabsContent value="acquisition">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Visualização de aquisição em breve.
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Visualização de engajamento em breve.
          </div>
        </TabsContent>

        <TabsContent value="conversions">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Visualização de conversões em breve.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
