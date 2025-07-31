"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentStore } from "@/stores/admin-dashboard/payment-store";

export function PaymentsChart() {
  const { payments } = usePaymentStore();

  const chartData = payments
    .reduce(
      (acc, payment) => {
        const date = new Date(payment.created_at).toLocaleDateString();
        const existing = acc.find((item) => item.date === date);
        if (existing) {
          existing.total += payment.amount;
        } else {
          acc.push({ date, total: payment.amount });
        }
        return acc;
      },
      [] as { date: string; total: number }[],
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="currentColor" className="stroke-primary" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
