import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AccountOverview } from "./_components/account-overview";
import { AssetsBreakdown } from "./_components/assets-breakdown";
import { CashFlowOverview } from "./_components/cash-flow-overview";
import { ExpenseSummary } from "./_components/expense-summary";
import { FinancialOverview } from "./_components/financial-overview";
import { NetWorthSummary } from "./_components/net-worth-summary";
import { RecentTransactions } from "./_components/recent-transactions";
import { SpendingOverview } from "./_components/spending-overview";

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
            <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              <SpendingOverview />
              <NetWorthSummary />
              <CashFlowOverview />
              <AssetsBreakdown />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="flex flex-col gap-4">
                <FinancialOverview />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                  <ExpenseSummary />
                  <RecentTransactions />
                </div>
              </div>

              <AccountOverview />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
