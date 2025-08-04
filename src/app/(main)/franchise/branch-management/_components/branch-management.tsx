"use client";

import React, { useEffect } from "react";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";

import { BranchDataTable } from "./branch-data-table";
import { BranchDialog } from "./branch-dialog";
import { columns } from "./columns";

const BranchManagement: React.FC = () => {
  const { branches, fetchBranches } = useFranchiseBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Branch Management</h2>
        <BranchDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </BranchDialog>
      </div>
      <BranchDataTable columns={columns} data={branches || []} />
    </div>
  );
};

export default BranchManagement;
