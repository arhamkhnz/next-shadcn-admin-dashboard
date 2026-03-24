import { RecentPayouts } from "./_components/recent-payouts";
import { RecentReleases } from "./_components/recent-releases";
import { StatsCards } from "./_components/stats-cards";
import { StreamsChart } from "./_components/streams-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's what's happening.</p>
      </div>
      <StatsCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <StreamsChart />
        <RecentPayouts />
      </div>
      <RecentReleases />
    </div>
  );
}
