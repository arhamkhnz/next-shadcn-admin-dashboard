import { create } from "zustand";

export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: "succeeded" | "failed" | "refunded";
  provider: string;
  provider_txn_id: string;
  created_at: Date;
};

type PaymentState = {
  payments: Payment[];
};

const initialPayments: Payment[] = [
  {
    id: "1",
    booking_id: "BK001",
    amount: 45.0,
    status: "succeeded",
    provider: "stripe",
    provider_txn_id: "pi_123abc",
    created_at: new Date(),
  },
  {
    id: "2",
    booking_id: "BK002",
    amount: 25.0,
    status: "succeeded",
    provider: "stripe",
    provider_txn_id: "pi_456def",
    created_at: new Date(),
  },
  {
    id: "3",
    booking_id: "BK003",
    amount: 65.0,
    status: "refunded",
    provider: "paypal",
    provider_txn_id: "pay_789ghi",
    created_at: new Date(),
  },
  {
    id: "4",
    booking_id: "BK004",
    amount: 45.0,
    status: "failed",
    provider: "stripe",
    provider_txn_id: "pi_012jkl",
    created_at: new Date(),
  },
];

export const usePaymentStore = create<PaymentState>(() => ({
  payments: initialPayments,
}));
