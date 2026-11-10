import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverviewKpis() {
  return (
    <div className="bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1">
      <div className="grid grid-cols-1 xl:grid-cols-8">
        <Card className="border-foreground/10 gap-5 overflow-hidden rounded-none border-0 border-b ring-0 xl:col-span-4 xl:border-r">
          <CardHeader>
            <CardTitle className="font-normal">Patrimônio líquido</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl leading-none tracking-tight">$128.4K</div>
              <p className="text-muted-foreground text-xs">+$9.8K vs. mês anterior</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">+8.4%</Badge>
          </CardContent>
        </Card>

        <Card className="border-foreground/10 gap-5 overflow-hidden rounded-none border-0 border-b ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Dinheiro disponível</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-3xl leading-none tracking-tight">$12.8K</div>
              <p className="text-muted-foreground text-xs">$410 acima da sua média de 30 dias</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">+3.2%</Badge>
          </CardContent>
        </Card>

        <Card className="border-foreground/10 gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-4 xl:border-r">
          <CardHeader>
            <CardTitle className="font-normal">Gastos mensais</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-3xl leading-none tracking-tight">$2,140</div>
              <p className="text-muted-foreground text-xs">$124 a mais que no mês anterior</p>
            </div>
            <Badge variant="destructive" className="bg-destructive/10 text-destructive">
              +6.1%
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Taxa de poupança</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-3xl leading-none tracking-tight">28%</div>
              <p className="text-muted-foreground text-xs">Acima dos 25.6% do mês anterior</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">+2.4%</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
