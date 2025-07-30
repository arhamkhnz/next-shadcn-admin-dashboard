import { Users, Building2, MapPin, UsersRound, TrendingUp, TrendingDown } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

async function getMetrics() {
  // TODO: Replace with actual Supabase queries
  return {
    totalUsers: { value: 1234, change: "+15.2%" },
    totalFranchises: { value: 12, change: "+5.1%" },
    totalBranches: { value: 45, change: "+8.3%" },
    totalWashers: { value: 89, change: "-2.5%" },
  };
}

export async function AdminMetrics() {
  const metrics = await getMetrics();

  const cards = [
    {
      title: "Total Users",
      data: metrics.totalUsers,
      icon: Users,
      description: "From last month",
    },
    {
      title: "Franchises",
      data: metrics.totalFranchises,
      icon: Building2,
      description: "From last month",
    },
    {
      title: "Branches",
      data: metrics.totalBranches,
      icon: MapPin,
      description: "From last month",
    },
    {
      title: "Washers",
      data: metrics.totalWashers,
      icon: UsersRound,
      description: "From last month",
    },
  ];

  return (
    <>
      {cards.map((card) => {
        const isPositive = card.data.change.startsWith("+");
        return (
          <Card key={card.title}>
            <CardHeader>
              <div className={cn("w-fit rounded-lg p-2", isPositive ? "bg-green-500/10" : "bg-destructive/10")}>
                <card.icon className={cn("size-5", isPositive ? "text-green-500" : "text-destructive")} />
              </div>
            </CardHeader>
            <CardContent className="flex size-full flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle>{card.title}</CardTitle>
                <p className="text-2xl font-medium tabular-nums">{card.data.value}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <div
                  className={cn(
                    "flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
                    isPositive ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {card.data.change}
                </div>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
