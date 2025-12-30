import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AccountOverview } from "./_components/account-overview";
import { AssetsBreakdown } from "./_components/assets-breakdown";
import { CashFlowOverview } from "./_components/cash-flow-overview";
import { FinancialOverview } from "./_components/financial-overview";
import { NetWorthSummary } from "./_components/net-worth-summary";
import { RecentPayments } from "./_components/recent-payments";
import { RecentTransactions } from "./_components/recent-transactions";
import { SavingsTrend } from "./_components/savings-trend";
import { SpendingOverview } from "./_components/spending-overview";
import { UpcomingPayments } from "./_components/upcoming-payments";

export default function Page() {
  return (
    <div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="activity">
            Activity
          </TabsTrigger>
          <TabsTrigger disabled value="insights">
            Insights
          </TabsTrigger>
          <TabsTrigger disabled value="utilities">
            Utilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-xs">
            <div className="grid gap-4 *:data-[slot=card]:gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <SpendingOverview />
              <NetWorthSummary />
              <CashFlowOverview />
              <AssetsBreakdown />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[7fr_3fr]">
              <FinancialOverview />
              <AccountOverview />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AccountOverview />

              <RecentTransactions />

              <div className="flex flex-col gap-4">
                <SavingsTrend />

                <div className="grid grid-cols-2 gap-4">
                  <RecentPayments />

                  <UpcomingPayments />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
