import { format } from "date-fns";
import { Download, RotateCw, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BalanceDistributionCard } from "./_components/balance-distribution-card";
import { FinanceNotification } from "./_components/finance-notification";
import { IncomeBreakdown } from "./_components/income-breakdown";
import { OverviewKpis } from "./_components/overview-kpis";
import { TransactionsOverviewCard } from "./_components/transactions-overview-card";
import { UpcomingTransactionsTable } from "./_components/upcoming-transactions-table";

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Personal Finances</h1>
        <p className="text-muted-foreground text-sm">{formattedDate}</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs defaultValue="30-days">
          <TabsList variant="line">
            <TabsTrigger value="30-days">Dashboard</TabsTrigger>
            <TabsTrigger value="12-months">Accounts</TabsTrigger>
            <TabsTrigger value="custom">Transactions</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <RotateCw className="size-4" />
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
        <div className="xl:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-normal">More Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-md border border-foreground/20 border-dashed text-muted-foreground text-sm">
                Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-4">
          <UpcomingTransactionsTable />
        </div>
      </div>
    </div>
  );
}
