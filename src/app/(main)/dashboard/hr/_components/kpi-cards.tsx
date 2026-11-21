import { BriefcaseBusiness, CalendarDays, UserRoundMinus, UserRoundPlus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpiMetrics = [
  {
    label: "Total employees",
    value: "272",
    icon: Users,
    change: "+6%",
    comparison: "vs last month",
  },
  {
    label: "New hires",
    value: "18",
    icon: UserRoundPlus,
    change: "+4",
    comparison: "vs last month",
  },
  {
    label: "Open positions",
    value: "12",
    icon: BriefcaseBusiness,
    change: "",
    comparison: "5 departments hiring",
  },
  {
    label: "On leave today",
    value: "8",
    icon: CalendarDays,
    change: "",
    comparison: "3 returning tomorrow",
  },
  {
    label: "Employees left",
    value: "6",
    icon: UserRoundMinus,
    change: "",
    comparison: "This month",
  },
];

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
