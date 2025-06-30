"use client";

import { PieChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";

const data = [
  { name: "income", value: 60 },
  { name: "expenses", value: 40 },
  { name: "scheduled", value: 40 },
];

const COLORS = ["#86efac", "#fdba74", "#d1d5db"];

export default function PieChartFlow() {
  return (
    <div style={{ width: "100%", height: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-sm font-bold">
                        $1800
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="text-xs">
                        SPENT
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
