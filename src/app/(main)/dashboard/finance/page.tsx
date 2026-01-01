import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CardOverview } from "./_components/card-overview";
import { CashFlowOverview } from "./_components/cash-flow-overview";
import { IncomeReliability } from "./_components/income-reliability";
import { MonthlyCashFlow } from "./_components/kpis/monthly-cash-flow";
import { NetWorth } from "./_components/kpis/net-worth";
import { PrimaryAccount } from "./_components/kpis/primary-account";
import { SavingsRate } from "./_components/kpis/savings-rate";
import { SpendingBreakdown } from "./_components/spending-breakdown";

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
              <PrimaryAccount />
              <NetWorth />
              <MonthlyCashFlow />
              <SavingsRate />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="flex flex-col gap-4">
                <CashFlowOverview />

                <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                  <SpendingBreakdown />
                  <IncomeReliability />
                </div>
              </div>

              <CardOverview />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
