import { ArrowUp, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCards() {
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Alunos atendidos</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground leading-none tracking-tight">128</span>
              <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUp />
                2.8%
              </Badge>
            </div>
            <div className="text-right text-muted-foreground text-xs">em 5 turmas da 11ª série</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Frequência média</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground leading-none tracking-tight">94.2%</span>
              <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUp />
                1.1%
              </Badge>
            </div>
            <div className="text-right text-muted-foreground text-xs">vs. mês anterior</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Atividades</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="text-3xl text-foreground leading-none tracking-tight">81</div>

            <div className="text-right text-muted-foreground text-xs">63 pendentes · 18 em atraso</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aulas hoje</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="text-3xl text-foreground leading-none tracking-tight">5</div>

            <div className="text-right text-muted-foreground text-xs">1 em andamento · 3 próximas · 1 cancelada</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
