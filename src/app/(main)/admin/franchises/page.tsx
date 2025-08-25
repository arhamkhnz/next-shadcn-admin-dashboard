"use client";

import { useEffect } from "react";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

import { columns } from "./_components/columns";
import { FranchiseDataTable } from "./_components/franchise-data-table";
import { FranchiseDialog } from "./_components/franchise-dialog";

export default function FranchisesPage() {
  const { franchises, fetchFranchises } = useFranchiseStore();

  useEffect(() => {
    fetchFranchises();
  }, [fetchFranchises]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Franchises</h2>
          <p className="text-muted-foreground">Manage all Karwi franchises and their branches.</p>
        </div>
        <div className="flex items-center space-x-2">
          <FranchiseDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Franchise
            </Button>
          </FranchiseDialog>
        </div>
      </div>
      <FranchiseDataTable data={franchises} />
    </div>
  );
}
