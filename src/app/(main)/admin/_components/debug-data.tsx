"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAdminStore } from "@/stores/admin-dashboard/admin-store";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

export function DebugData() {
  const { admins } = useAdminStore();
  const { bookings } = useBookingStore();
  const { branches } = useBranchStore();
  const { franchises } = useFranchiseStore();
  const { payments } = usePaymentStore();
  const { services } = useServiceStore();
  const { users } = useUserStore();
  const { washers } = useWasherStore();

  const [adminId, setAdminId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError("Failed to fetch session");
          console.error("Error fetching session:", sessionError);
          return;
        }

        if (!session?.user) {
          setError("No user session found");
          return;
        }

        setAdminId(session.user.id);
      } catch (err) {
        setError("Failed to fetch admin ID");
        console.error("Error fetching admin ID:", err);
      }
    };

    fetchAdminId();
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
              <strong>Admin ID:</strong> {adminId ?? "Not loaded"}
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <p>
              <strong>Admins Count:</strong> {admins.length}
            </p>
            <p>
              <strong>Bookings Count:</strong> {bookings.length}
            </p>
            <p>
              <strong>Branches Count:</strong> {branches.length}
            </p>
            <p>
              <strong>Franchises Count:</strong> {franchises.length}
            </p>
            <p>
              <strong>Payments Count:</strong> {payments.length}
            </p>
            <p>
              <strong>Services Count:</strong> {services.length}
            </p>
            <p>
              <strong>Users Count:</strong> {users.length}
            </p>
            <p>
              <strong>Washers Count:</strong> {washers.length}
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
