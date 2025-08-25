import React from "react";

import { Building2, Wrench, UsersRound, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FranchiseMetricsProps {
  totalBranches: number;
  totalServices: number;
  activeWashers: number;
  totalBookings?: number;
}

const FranchiseMetrics: React.FC<FranchiseMetricsProps> = ({
  totalBranches,
  totalServices,
  activeWashers,
  totalBookings = 0,
}) => {
  const metrics = [
    {
      title: "Total Branches",
      value: totalBranches,
      icon: Building2,
      description: "Managed by your franchise",
    },
    {
      title: "Total Services",
      value: totalServices,
      icon: Wrench,
      description: "Offered across all branches",
    },
    {
      title: "Active Washers",
      value: activeWashers,
      icon: UsersRound,
      description: "Currently available for bookings",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      description: "All bookings across branches",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-muted-foreground text-xs">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FranchiseMetrics;
