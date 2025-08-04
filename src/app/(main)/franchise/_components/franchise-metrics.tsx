import React from "react";

import { Card } from "@/components/ui/card";

interface FranchiseMetricsProps {
  totalBranches: number;
  totalServices: number;
  activeWashers: number;
}

const FranchiseMetrics: React.FC<FranchiseMetricsProps> = ({ totalBranches, totalServices, activeWashers }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Branches</span>
        <span className="text-primary text-2xl font-bold">{totalBranches}</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Services</span>
        <span className="text-primary text-2xl font-bold">{totalServices}</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Active Washers</span>
        <span className="text-primary text-2xl font-bold">{activeWashers}</span>
      </Card>
    </div>
  );
};

export default FranchiseMetrics;
