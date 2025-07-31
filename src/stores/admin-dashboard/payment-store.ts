import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: "succeeded" | "failed" | "refunded";
  provider: string;
  provider_txn_id: string;
  created_at: string;
};

type PaymentState = {
  payments: Payment[];
  fetchPayments: () => Promise<void>;
};

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  fetchPayments: async () => {
    const { data, error } = await supabase.from("payments").select("*");
    if (error) {
      console.error("Error fetching payments:", error);
      return;
    }
    set({ payments: data as Payment[] });
  },
}));
