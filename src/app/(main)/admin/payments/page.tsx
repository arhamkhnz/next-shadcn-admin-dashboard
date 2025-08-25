"use client";

import React from "react";

import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";

import { columns } from "./_components/columns";
import { PaymentDataTable } from "./_components/payment-data-table";

export default function PaymentsPage() {
  const { payments, fetchPayments } = usePaymentStore();

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Track and manage all payments.</p>
        </div>
      </div>
      <PaymentDataTable data={payments} />
    </div>
  );
}
