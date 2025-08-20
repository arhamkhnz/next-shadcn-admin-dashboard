"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserFranchiseId } from "@/server/server-actions";
import { useFranchiseDashboardStore } from "@/stores/franchise-dashboard/franchise-store";

export function DebugData() {
  const { branches, services, washers, bookings } = useFranchiseDashboardStore();
  const [franchiseId, setFranchiseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFranchiseId = async () => {
      try {
        const id = await getCurrentUserFranchiseId();
        setFranchiseId(id);
      } catch (err) {
        setError("Failed to fetch franchise ID");
        console.error("Error fetching franchise ID:", err);
      }
    };

    fetchFranchiseId();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Franchise ID:</strong> {franchiseId ?? "Not loaded"}
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <p>
              <strong>Branches Count:</strong> {branches.length}
            </p>
            <p>
              <strong>Services Count:</strong> {services.length}
            </p>
            <p>
              <strong>Washers Count:</strong> {washers.length}
            </p>
            <p>
              <strong>Bookings Count:</strong> {bookings.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {branches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Branches Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-40 overflow-auto text-xs">{JSON.stringify(branches, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
