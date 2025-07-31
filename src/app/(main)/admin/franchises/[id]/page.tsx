"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

export default function FranchiseDetailPage({ params }: { params: { id: string } }) {
  const { franchises } = useFranchiseStore();
  const franchise = franchises.find((f) => f.id === params.id);

  if (!franchise) {
    return <div>Franchise not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{franchise.name}</CardTitle>
          <Badge variant={franchise.status === "active" ? "default" : "destructive"}>{franchise.status}</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Branches</p>
            <p className="text-lg font-semibold">{franchise.branches}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Washers</p>
            <p className="text-lg font-semibold">{franchise.washers}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
