"use client";

import { FileBarChart } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ActivityPerformance } from "./activity-performance";
import { ReportDrillDownSheet } from "./drill-down-sheet";
import { LeadPerformance } from "./lead-performance";
import { PipelineReport } from "./pipeline-report";
import { ReportFilterBar } from "./report-filter-bar";
import { ReportsProvider } from "./reports-context";
import { SalesOverview } from "./sales-overview";
import { TeamPerformance } from "./team-performance";

const REPORT_TABS = [
  { id: "sales-overview", label: "Sales Overview" },
  { id: "pipeline", label: "Pipeline" },
  { id: "lead-performance", label: "Lead Performance" },
  { id: "activity-performance", label: "Activity Performance" },
  { id: "team-performance", label: "Team Performance" },
] as const;

function ReportsContent() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="size-5 text-muted-foreground" />
            CRM Reports &amp; Analytics
          </CardTitle>
          <CardDescription>
            Revenue, pipeline, lead, and activity analytics built from the shared CRM data. Filter once and every
            section updates together.
          </CardDescription>
          <CardAction className="hidden sm:block">
            <ReportFilterBar />
          </CardAction>
        </CardHeader>
        <CardContent className="sm:hidden">
          <ReportFilterBar />
        </CardContent>
      </Card>

      <Tabs defaultValue={REPORT_TABS[0].id} className="gap-6">
        <div className="overflow-x-auto pb-1">
          <TabsList variant="line" className="w-max min-w-full sm:min-w-0">
            {REPORT_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="whitespace-nowrap px-3 text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="sales-overview">
          <SalesOverview />
        </TabsContent>
        <TabsContent value="pipeline">
          <PipelineReport />
        </TabsContent>
        <TabsContent value="lead-performance">
          <LeadPerformance />
        </TabsContent>
        <TabsContent value="activity-performance">
          <ActivityPerformance />
        </TabsContent>
        <TabsContent value="team-performance">
          <TeamPerformance />
        </TabsContent>
      </Tabs>

      <ReportDrillDownSheet />
    </div>
  );
}

export function ReportsView() {
  return (
    <ReportsProvider>
      <ReportsContent />
    </ReportsProvider>
  );
}
