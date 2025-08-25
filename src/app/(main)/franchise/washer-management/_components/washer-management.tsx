"use client";

import React, { useEffect } from "react";

import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseUserStore } from "@/stores/franchise-dashboard/user-store";

import { columns } from "./columns";
import { WasherDataTable } from "./washer-data-table";

const WasherManagement: React.FC = () => {
  const { washers, fetchWashers } = useFranchiseUserStore();
  const { fetchBranches } = useFranchiseBranchStore();

  useEffect(() => {
    fetchWashers();
    fetchBranches();
  }, [fetchWashers, fetchBranches]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Karwi Washer Management</h2>
        {/* ADD FEATURE DISABLED */}
      </div>
      <WasherDataTable data={washers ?? []} />
    </div>
  );
};

export default WasherManagement;
