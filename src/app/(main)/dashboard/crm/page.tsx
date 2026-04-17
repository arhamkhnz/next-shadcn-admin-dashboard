import { ActivityTimeline } from "./_components/activity-timeline";
import { recentLeadsData } from "./_components/crm.config";
import { InsightCards } from "./_components/insight-cards";
import { OperationalCards } from "./_components/operational-cards";
import { OverviewCards } from "./_components/overview-cards";
import { PageHeader } from "./_components/page-header";
import { RecentLeadsTable } from "./_components/recent-leads-table/table";
import { StatusOverview } from "./_components/status-overview";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader />
      <StatusOverview />
      <OverviewCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <InsightCards />
          <OperationalCards />
        </div>
        <div className="space-y-4">
          <ActivityTimeline />
        </div>
      </div>
      <RecentLeadsTable data={recentLeadsData} />
    </div>
  );
}
