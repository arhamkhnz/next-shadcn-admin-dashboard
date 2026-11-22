import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { kpiMetrics } from "./data";

export function KpiCards() {
  return (
    <section aria-label="HR summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpiMetrics.map(({ label, value, icon: Icon, change, comparison }) => (
        <Card key={label} size="sm" className="bg-muted/50 gap-3 pb-1 shadow-xs">
          <CardHeader className="flex items-center gap-2">
            <Icon aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
            <CardTitle>{label}</CardTitle>
          </CardHeader>
          <CardContent className="mt-auto px-1">
            <div className="bg-card border-border/60 flex flex-col gap-1 rounded-lg border p-2 shadow-xs">
              <p className="text-2xl leading-none tracking-tight tabular-nums">{value}</p>
              <div className="text-muted-foreground flex items-center justify-end gap-1 text-xs whitespace-nowrap">
                {change && (
                  <span className="font-medium text-emerald-700 tabular-nums dark:text-emerald-400">{change}</span>
                )}
                <span>{comparison}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
