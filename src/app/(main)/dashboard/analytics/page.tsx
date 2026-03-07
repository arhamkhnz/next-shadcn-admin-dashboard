import { CoverageTriageCard } from "./_components/analytics-coverage-triage-card";
import { ForecastVsTargetCard } from "./_components/analytics-forecast-vs-target-card";
import { ManagerActionQueueCard } from "./_components/analytics-manager-action-queue-card";
import { AnalyticsOverview } from "./_components/analytics-overview";
import { RevenueRiskLedgerCard } from "./_components/analytics-revenue-risk-ledger-card";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AnalyticsOverview />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ForecastVsTargetCard />
          <CoverageTriageCard />
        </div>
        <ManagerActionQueueCard />
      </div>

      <RevenueRiskLedgerCard />
    </div>
  );
}
