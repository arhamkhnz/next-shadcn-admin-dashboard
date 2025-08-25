import Link from "next/link";

import BranchManagement from "@/app/(main)/franchise/branch-management/_components/branch-management";
import { Button } from "@/components/ui/button";

export default function BranchManagementPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branch Management</h2>
          <p className="text-muted-foreground">Manage your Karwi branches.</p>
        </div>
        <Link href="/franchise/branch-analytics">
          <Button variant="outline">View Analytics</Button>
        </Link>
      </div>

      <BranchManagement />
    </div>
  );
}
