"use client";

import { AttentionQueue } from "./attention-queue";
import { DealsAttention } from "./deals-attention";
import { KpiSection } from "./kpi-section";
import { LeadFollowup } from "./lead-followup";
import { OverdueTasksCard } from "./overdue-tasks-card";
import { OverviewFiltersProvider } from "./overview-filters";
import { OverviewHeader } from "./overview-header";
import { PipelineSnapshot } from "./pipeline-snapshot";
import { RecentActivityFeed } from "./recent-activity-feed";
import { RevenueChart } from "./revenue-chart";
import { TeamSnapshot } from "./team-snapshot";
import { TodaySchedule } from "./today-schedule";
import { UpcomingActivities } from "./upcoming-activities";

function OverviewContent() {
  return (
    <div className="flex flex-col gap-4">
      <OverviewHeader />
      <KpiSection />
      <AttentionQueue />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        <div className="xl:col-span-4">
          <TodaySchedule />
        </div>
        <div className="xl:col-span-3">
          <UpcomingActivities />
        </div>
      </div>
      <PipelineSnapshot />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueChart />
        <OverdueTasksCard />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DealsAttention />
        <LeadFollowup />
      </div>
      <TeamSnapshot />
      <RecentActivityFeed />
    </div>
  );
}

export function OverviewView() {
  return (
    <OverviewFiltersProvider>
      <OverviewContent />
    </OverviewFiltersProvider>
  );
}
