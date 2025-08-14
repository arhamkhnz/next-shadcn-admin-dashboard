"use client";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";

import { BranchDataTable } from "./_components/branch-data-table";
import { BranchDialog } from "./_components/branch-dialog";
import { columns } from "./_components/columns";

export default function BranchesPage() {
  const { branches } = useBranchStore();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
          <p className="text-muted-foreground">Manage all Karwi branches and their services.</p>
        </div>
        <div className="flex items-center space-x-2">
          <BranchDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </BranchDialog>
        </div>
      </div>
      <BranchDataTable columns={columns} data={branches} />
    </div>
  );
}
