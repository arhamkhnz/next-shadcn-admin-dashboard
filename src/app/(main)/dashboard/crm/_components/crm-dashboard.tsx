"use client";

import { AttentionNeeded } from "./attention-needed";
import { CrmFiltersProvider } from "./crm-filters";
import { KpiCards } from "./kpi-cards";
import { OpportunitiesSection } from "./opportunities-section";
import { PipelineActivity } from "./pipeline-activity";
import { TaskReminders } from "./task-reminders";

export function CrmDashboard() {
  return (
    <CrmFiltersProvider>
      <div className="flex flex-col gap-4 md:gap-6">
        <KpiCards />
        <PipelineActivity />
        <TaskReminders />
        <AttentionNeeded />
        <OpportunitiesSection />
      </div>
    </CrmFiltersProvider>
  );
}
