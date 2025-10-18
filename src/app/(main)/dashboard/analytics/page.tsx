"use client";

import type { ReactNode } from "react";

import {
  UserActivityHeatmap,
  ConversionFunnel,
  PerformanceMetricsRadar,
  RealtimeNotificationsFeed,
  GeographicUserMap,
} from "@/components/analytics";

// Wrapper component to constrain the size of analytics components
const AnalyticsCard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-4">
      {/* Summary analytics cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        <div className="@container/card">
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Total Users</p>
                <h3 className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">152,842</h3>
              </div>
              <div className="bg-primary/10 text-primary flex h-5 items-center rounded-md px-2 text-xs font-medium">
                +12.5%
              </div>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">Compared to previous month</div>
          </div>
        </div>

        <div className="@container/card">
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Conversion Rate</p>
                <h3 className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">11.4%</h3>
              </div>
              <div className="bg-primary/10 text-primary flex h-5 items-center rounded-md px-2 text-xs font-medium">
                +3.2%
              </div>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">Visitors to customers</div>
          </div>
        </div>

        <div className="@container/card">
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Avg. Session Time</p>
                <h3 className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">4m 32s</h3>
              </div>
              <div className="bg-destructive/10 text-destructive flex h-5 items-center rounded-md px-2 text-xs font-medium">
                -0.8%
              </div>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">Time spent on site</div>
          </div>
        </div>

        <div className="@container/card">
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Bounce Rate</p>
                <h3 className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">28.5%</h3>
              </div>
              <div className="bg-primary/10 text-primary flex h-5 items-center rounded-md px-2 text-xs font-medium">
                +2.1%
              </div>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">Single page sessions</div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex flex-col gap-4">
        {/* Full width Performance Metrics Radar */}
        <AnalyticsCard className="shadow-xs">
          <PerformanceMetricsRadar />
        </AnalyticsCard>
      </div>
      {/* Second row - User Activity Heatmap and Conversion Funnel */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnalyticsCard className="shadow-xs">
          <UserActivityHeatmap />
        </AnalyticsCard>
        <AnalyticsCard className="shadow-xs">
          <ConversionFunnel />
        </AnalyticsCard>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnalyticsCard className="h-[500px] overflow-hidden shadow-xs">
          <div className="h-full overflow-hidden">
            <RealtimeNotificationsFeed />
          </div>
        </AnalyticsCard>
        <AnalyticsCard className="h-[500px] overflow-hidden shadow-xs">
          <div className="h-full overflow-hidden">
            <GeographicUserMap />
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}
