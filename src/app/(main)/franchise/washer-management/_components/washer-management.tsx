"use client";

import React, { useEffect } from "react";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseUserStore } from "@/stores/franchise-dashboard/user-store";

import { columns } from "./columns";
import { WasherDataTable } from "./washer-data-table";
import { WasherDialog } from "./washer-dialog";

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
        <WasherDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Washer
          </Button>
        </WasherDialog>
      </div>
      <WasherDataTable columns={columns} data={washers || []} />
    </div>
  );
};

export default WasherManagement;
