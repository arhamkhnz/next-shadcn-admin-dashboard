import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, RotateCw, Settings2 } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BalanceDistributionCard } from "./_components/balance-distribution-card";
import { FinanceNotification } from "./_components/finance-notification";
import { IncomeBreakdown } from "./_components/income-breakdown";
import { OverviewKpis } from "./_components/overview-kpis";
import { QuickActions } from "./_components/quick-actions";
import { TransactionsOverviewCard } from "./_components/transactions-overview-card";
import { UpcomingTransactions } from "./_components/upcoming-transactions";
import { Wallet } from "./_components/wallet";

export const metadata: Metadata = {
  title: "Painel de finanças pessoais com shadcn/ui",
  description:
    "Explore um painel de código aberto para finanças pessoais: patrimônio líquido, gastos, fontes de renda, alocação de contas, transações e carteiras.",
  alternates: {
    canonical: "/dashboard/finance",
  },
};

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Finanças pessoais</h1>
        <p className="text-muted-foreground text-sm">{displayDate}</p>
      </div>

      <Tabs defaultValue="30-days" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList variant="line">
            <TabsTrigger value="30-days">Painel</TabsTrigger>
            <TabsTrigger value="12-months">Contas</TabsTrigger>
            <TabsTrigger value="custom">Transações</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <RotateCw className="size-4" />
              <span>Atualizado há 5 minutos</span>
            </div>
            <Button size="sm" variant="outline">
              <Settings2 />
              Configurações
            </Button>
            <Button size="sm" variant="outline">
              <Download data-icon="inline-start" />
              Exportar
            </Button>
          </div>
        </div>

        <TabsContent value="30-days" className="flex flex-col gap-4">
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

        <TabsContent value="12-months">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Visualização de contas em breve.
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Visualização de transações em breve.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
