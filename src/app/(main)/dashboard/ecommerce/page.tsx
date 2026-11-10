import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Settings2 } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { CustomerReviews } from "./_components/customer-reviews";
import { Inventory } from "./_components/inventory";
import { KpiStrip } from "./_components/kpi-strip";
import { RecentOrders } from "./_components/recent-orders";
import { StoreTraffic } from "./_components/store-traffic";
import { TopProducts } from "./_components/top-products";
import { TrafficSources } from "./_components/traffic-sources";

export const metadata: Metadata = {
  title: "Painel de e-commerce open source com shadcn/ui",
  description:
    "Explore um painel de e-commerce open source com métricas de vendas, pedidos, tráfego da loja, estoque, produtos e avaliações.",
  alternates: {
    canonical: "/dashboard/ecommerce",
  },
};

export default function Page() {
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Visão geral da loja</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-34" id="ecommerce-period" size="sm">
              <SelectValue placeholder="Este mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="this-month">Este mês</SelectItem>
                <SelectItem value="last-month">Mês anterior</SelectItem>
                <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                <SelectItem value="year-to-date">Desde o início do ano</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all-channels">
            <SelectTrigger className="w-40" id="ecommerce-channel" size="sm">
              <SelectValue placeholder="Todos os canais" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-channels">Todos os canais</SelectItem>
                <SelectItem value="online-store">Loja online</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="retail">Varejo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" />

          <Button size="icon-sm" variant="outline">
            <Settings2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <KpiStrip />
        <div className="xl:col-span-5">
          <StoreTraffic />
        </div>
        <div className="xl:col-span-7">
          <TrafficSources />
        </div>
        <div className="xl:col-span-4">
          <TopProducts />
        </div>
        <div className="xl:col-span-4">
          <Inventory />
        </div>
        <div className="xl:col-span-4">
          <CustomerReviews />
        </div>
        <div className="xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
