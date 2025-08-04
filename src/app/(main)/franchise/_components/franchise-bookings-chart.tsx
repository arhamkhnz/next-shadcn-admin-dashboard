"use client";
import React from "react";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface FranchiseBookingsChartProps {
  data: { date: string; count: number }[];
}

const FranchiseBookingsChart: React.FC<FranchiseBookingsChartProps> = ({ data }) => {
  return (
    <div className="bg-background rounded-lg p-4">
      <h2 className="mb-2 text-lg font-semibold">Daily Bookings</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FranchiseBookingsChart;
