import { BarChart3, Disc3, DollarSign, Star, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const stats: { label: string; value: string; sub: string; icon: LucideIcon }[] = [
  {
    label: "Total Releases",
    value: "7",
    sub: "5 live · 2 upcoming",
    icon: Disc3,
  },
  {
    label: "Total Streams",
    value: "394,400",
    sub: "+31.2% this quarter",
    icon: BarChart3,
  },
  {
    label: "Total Revenue",
    value: "$1,538.00",
    sub: "Across all releases",
    icon: DollarSign,
  },
  {
    label: "Top Artist",
    value: "Draylean",
    sub: "3 releases · 295,800 streams",
    icon: Star,
  },
];

export function ReleaseStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} data-slot="card">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <Icon className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
