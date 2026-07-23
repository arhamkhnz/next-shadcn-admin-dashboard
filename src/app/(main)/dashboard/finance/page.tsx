"use client";

import * as React from "react";

import { format } from "date-fns";
import { Download, RotateCw, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AccountKpis } from "./_components/account-kpis";
import { AccountsList } from "./_components/accounts-list";
import { AddAccountCard } from "./_components/add-account-card";
import { AllocationByType } from "./_components/allocation-by-type";
import { BalanceDistributionCard } from "./_components/balance-distribution-card";
import { FinanceNotification } from "./_components/finance-notification";
import { IncomeBreakdown } from "./_components/income-breakdown";
import { OverviewKpis } from "./_components/overview-kpis";
import { QuickActions } from "./_components/quick-actions";
import { RecentAccountActivity } from "./_components/recent-account-activity";
import { TransactionsKpis } from "./_components/transactions-kpis";
import { TransactionsOverviewCard } from "./_components/transactions-overview-card";
import { TransactionsSection } from "./_components/transactions-section";
import { UpcomingInflows } from "./_components/upcoming-inflows";
import { UpcomingTransactions } from "./_components/upcoming-transactions";
import { Wallet } from "./_components/wallet";

const DASHBOARD_TAB = "dashboard";
const ACCOUNTS_TAB = "accounts";
const TRANSACTIONS_TAB = "transactions";

export default function Page() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
  }, []);
  const formattedDate = now ? format(now, "EEEE, do MMMM yyyy") : " ";
  const [activeTab, setActiveTab] = React.useState<string>(DASHBOARD_TAB);
  const [accountFilterSeed, setAccountFilterSeed] = React.useState<string | undefined>(undefined);
  const transactionsTriggerRef = React.useRef<HTMLButtonElement>(null);

  const handleAccountSelect = React.useCallback((accountId: string) => {
    setAccountFilterSeed(accountId);
    setActiveTab(TRANSACTIONS_TAB);
    requestAnimationFrame(() => transactionsTriggerRef.current?.focus());
  }, []);

  const handleAccountFilterConsumed = React.useCallback(() => {
    setAccountFilterSeed(undefined);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Personal Finances</h1>
        <p className="text-muted-foreground text-sm">{formattedDate}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList variant="line">
            <TabsTrigger value={DASHBOARD_TAB}>Dashboard</TabsTrigger>
            <TabsTrigger value={ACCOUNTS_TAB}>Accounts</TabsTrigger>
            <TabsTrigger ref={transactionsTriggerRef} value={TRANSACTIONS_TAB}>
              Transactions
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <RotateCw aria-hidden="true" className="size-4" />
              <span>Updated 5 min ago</span>
            </div>
            <Button size="sm" variant="outline">
              <Settings2 />
              Settings
            </Button>
            <Button size="sm" variant="outline">
              <Download data-icon="inline-start" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value={DASHBOARD_TAB} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <OverviewKpis />
            </div>

            <div className="flex flex-col gap-4 xl:col-span-6">
              <IncomeBreakdown />
              <FinanceNotification />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TransactionsOverviewCard />
            </div>
            <div className="xl:col-span-5">
              <BalanceDistributionCard />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <Wallet />
            </div>
            <div className="xl:col-span-4">
              <UpcomingTransactions />
            </div>
            <div className="xl:col-span-4">
              <QuickActions />
            </div>
          </div>
        </TabsContent>

        <TabsContent value={ACCOUNTS_TAB} className="flex flex-col gap-4">
          <AccountKpis />

          <AccountsList onSelectAccount={handleAccountSelect} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <AllocationByType />
            <RecentAccountActivity />
            <UpcomingInflows />
            <AddAccountCard />
          </div>
        </TabsContent>

        <TabsContent value={TRANSACTIONS_TAB} className="flex flex-col gap-4">
          <TransactionsKpis />
          <TransactionsSection
            initialAccountFilter={accountFilterSeed}
            onAccountFilterConsumed={handleAccountFilterConsumed}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
