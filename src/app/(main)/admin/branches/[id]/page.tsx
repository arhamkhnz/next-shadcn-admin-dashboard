"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";

export default function BranchDetailPage({ params }: { params: { id: string } }) {
  const { branches } = useBranchStore();
  const branch = branches.find((b) => b.id === params.id);

  if (!branch) {
    return <div>Branch not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{branch.name}</CardTitle>
          <p className="text-muted-foreground">{branch.location}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Franchise</p>
            <p className="text-lg font-semibold">{branch.franchise}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Services Offered</p>
            <p className="text-lg font-semibold">{branch.services}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Active Bookings</p>
            <p className="text-lg font-semibold">{branch.activeBookings}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
