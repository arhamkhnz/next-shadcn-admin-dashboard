"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data - replace with actual Supabase data
const bookingsData = [
  { month: "Jan", bookings: 120 },
  { month: "Feb", bookings: 150 },
  { month: "Mar", bookings: 180 },
  { month: "Apr", bookings: 220 },
  { month: "May", bookings: 280 },
  { month: "Jun", bookings: 320 },
  { month: "Jul", bookings: 350 },
  { month: "Aug", bookings: 380 },
  { month: "Sep", bookings: 340 },
  { month: "Oct", bookings: 300 },
  { month: "Nov", bookings: 260 },
  { month: "Dec", bookings: 290 },
];

export function BookingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Bookings</CardTitle>
        <CardDescription>Bookings per month for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            bookings: {
              label: "Bookings",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={bookingsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--background))" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="bookings" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
