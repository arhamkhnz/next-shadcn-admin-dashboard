"use client";

import { useMemo } from "react";

import { format, subMinutes } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const trafficIntervalMinutes = 15;

const trafficPoints = [
  { visitors: 280, anomalies: 8 },
  { visitors: 420, anomalies: 4 },
  { visitors: 360, anomalies: 3 },
  { visitors: 140, anomalies: 2 },
  { visitors: 80, anomalies: 1 },
  { visitors: 600, anomalies: 4 },
  { visitors: 260, anomalies: 3 },
  { visitors: 70, anomalies: 2 },
  { visitors: 90, anomalies: 1 },
  { visitors: 180, anomalies: 4 },
  { visitors: 150, anomalies: 3 },
  { visitors: 60, anomalies: 2 },
  { visitors: 430, anomalies: 1 },
  { visitors: 110, anomalies: 4 },
  { visitors: 260, anomalies: 3 },
  { visitors: 120, anomalies: 2 },
  { visitors: 90, anomalies: 1 },
  { visitors: 40, anomalies: 8 },
  { visitors: 75, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 15, anomalies: 1 },
  { visitors: 35, anomalies: 4 },
  { visitors: 60, anomalies: 3 },
  { visitors: 95, anomalies: 2 },
  { visitors: 105, anomalies: 1 },
  { visitors: 120, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 25, anomalies: 2 },
  { visitors: 70, anomalies: 1 },
  { visitors: 110, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 140, anomalies: 2 },
  { visitors: 310, anomalies: 1 },
  { visitors: 120, anomalies: 4 },
  { visitors: 160, anomalies: 8 },
  { visitors: 30, anomalies: 2 },
  { visitors: 20, anomalies: 1 },
  { visitors: 0, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 210, anomalies: 2 },
  { visitors: 110, anomalies: 1 },
  { visitors: 190, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 85, anomalies: 2 },
  { visitors: 250, anomalies: 1 },
  { visitors: 40, anomalies: 4 },
  { visitors: 110, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 140, anomalies: 1 },
  { visitors: 95, anomalies: 4 },
  { visitors: 180, anomalies: 3 },
  { visitors: 620, anomalies: 18 },
  { visitors: 35, anomalies: 1 },
  { visitors: 330, anomalies: 4 },
  { visitors: 45, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 160, anomalies: 1 },
  { visitors: 190, anomalies: 4 },
  { visitors: 260, anomalies: 3 },
  { visitors: 90, anomalies: 2 },
  { visitors: 70, anomalies: 1 },
  { visitors: 180, anomalies: 4 },
  { visitors: 150, anomalies: 3 },
  { visitors: 280, anomalies: 2 },
  { visitors: 160, anomalies: 1 },
  { visitors: 20, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 200, anomalies: 2 },
  { visitors: 45, anomalies: 8 },
  { visitors: 115, anomalies: 4 },
  { visitors: 145, anomalies: 3 },
  { visitors: 40, anomalies: 2 },
  { visitors: 160, anomalies: 1 },
  { visitors: 170, anomalies: 4 },
  { visitors: 95, anomalies: 3 },
  { visitors: 140, anomalies: 2 },
  { visitors: 70, anomalies: 1 },
  { visitors: 230, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 65, anomalies: 2 },
  { visitors: 35, anomalies: 1 },
  { visitors: 0, anomalies: 4 },
  { visitors: 80, anomalies: 3 },
  { visitors: 180, anomalies: 2 },
  { visitors: 95, anomalies: 1 },
  { visitors: 140, anomalies: 8 },
  { visitors: 270, anomalies: 3 },
  { visitors: 110, anomalies: 2 },
  { visitors: 50, anomalies: 1 },
  { visitors: 230, anomalies: 18 },
  { visitors: 115, anomalies: 3 },
  { visitors: 80, anomalies: 2 },
  { visitors: 260, anomalies: 1 },
  { visitors: 20, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 5, anomalies: 2 },
] as const;

function getTrafficData() {
  const now = new Date();

  return trafficPoints.map((point, index) => ({
    ...point,
    timestamp: subMinutes(now, (trafficPoints.length - 1 - index) * trafficIntervalMinutes).toISOString(),
  }));
}

const trafficConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-3)",
  },
  anomalies: {
    label: "Anomalies",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

function formatTrafficTooltipLabel(value: string) {
  return format(new Date(value), "h:mm a, do MMMM yyyy");
}

export function StoreTraffic() {
  const trafficData = useMemo(getTrafficData, []);
  const firstTrafficTimestamp = trafficData[0].timestamp;
  const lastTrafficTimestamp = trafficData.at(-1)?.timestamp ?? "";

  function formatTrafficTick(value: string) {
    if (value === firstTrafficTimestamp) {
      return "24h ago";
    }

    return value === lastTrafficTimestamp ? "now" : "";
  }

  return (
    <Card className="xl:col-span-7">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Store Traffic</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          12.9K visits
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={trafficConfig} className="h-54 w-full">
          <AreaChart accessibilityLayer data={trafficData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              tick={{ fontSize: 11 }}
              tickFormatter={formatTrafficTick}
              tickLine={false}
              tickMargin={10}
              ticks={[trafficData[0].timestamp, trafficData.at(-1)?.timestamp ?? ""]}
            />
            <YAxis axisLine={false} domain={[0, 650]} tickLine={false} tickMargin={6} width={36} yAxisId="traffic" />
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={(value) => formatTrafficTooltipLabel(String(value))} />}
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            />
            <ChartLegend align="right" verticalAlign="top" className="justify-end" content={<ChartLegendContent />} />
            <Area
              dataKey="visitors"
              dot={false}
              fill="url(#fillVisitors)"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              type="stepAfter"
              yAxisId="traffic"
            />
            <Line
              dataKey="anomalies"
              dot={false}
              stroke="var(--color-anomalies)"
              strokeLinecap="round"
              strokeWidth={1.2}
              type="stepAfter"
              yAxisId="traffic"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
