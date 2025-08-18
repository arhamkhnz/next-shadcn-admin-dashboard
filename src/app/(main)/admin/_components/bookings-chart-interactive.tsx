"use client";

import * as React from "react";

import { useTheme } from "next-themes";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookingStore } from "@/stores/admin-dashboard/booking-store";

// Generate chart data from bookings
const generateChartDataFromBookings = (bookings: { date: Date }[]) => {
  // Group bookings by date
  const bookingsByDate: Record<string, number> = {};

  bookings.forEach((booking) => {
    if (booking.date) {
      const dateStr = new Date(booking.date).toISOString().split("T")[0];
      bookingsByDate[dateStr] = (bookingsByDate[dateStr] ?? 0) + 1;
    }
  });

  // Generate data for the last 90 days
  const data = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    data.push({
      date: dateStr,
      bookings: bookingsByDate[dateStr] ?? 0,
    });
  }

  return data;
};

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
} satisfies ChartConfig;

export function BookingsChartInteractive() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = React.useState("90d");
  const { bookings } = useBookingStore();
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    // Generate chart data when bookings change
    const data = generateChartDataFromBookings(bookings);
    setChartData(data);
  }, [bookings]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const areaColors =
    theme === "dark"
      ? {
          fill: "#5eead4cc", // Bright teal with opacity for dark mode
          stroke: "#5eead4", // Bright teal for dark mode
        }
      : {
          fill: "hsl(var(--chart-1))",
          stroke: "hsl(var(--chart-1))",
        };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total bookings for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColors.fill} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaColors.fill} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="bookings" type="natural" fill="url(#fillBookings)" stroke={areaColors.stroke} stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
