"use client";

import React, { useEffect } from "react";

import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";

import { BranchDataTable } from "./branch-data-table";

const BranchManagement: React.FC = () => {
  const { branches, fetchBranches } = useFranchiseBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <div className="space-y-6">
      <BranchDataTable data={branches || []} />
    </div>
  );
};

export default BranchManagement;
