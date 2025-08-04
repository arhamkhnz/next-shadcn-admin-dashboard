import React from "react";

import { Building2, Wrench, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FranchiseMetricsProps {
  totalBranches: number;
  totalServices: number;
  activeWashers: number;
}

const FranchiseMetrics: React.FC<FranchiseMetricsProps> = ({ totalBranches, totalServices, activeWashers }) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
          <Building2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBranches}</div>
          <p className="text-muted-foreground text-xs">Managed by this franchise</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Wrench className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
          <p className="text-muted-foreground text-xs">Offered across all branches</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Washers</CardTitle>
          <UsersRound className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeWashers}</div>
          <p className="text-muted-foreground text-xs">Currently available for bookings</p>
        </CardContent>
      </Card>
    </>
  );
};

export default FranchiseMetrics;
