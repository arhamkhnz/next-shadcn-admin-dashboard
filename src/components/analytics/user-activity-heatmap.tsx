"use client";

import * as React from "react";

import { Clock, Users } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { activityData, dayLabels, hourLabels, intensityColors } from "./data/activity-data";

export function UserActivityHeatmap() {
  const [timeRange, setTimeRange] = React.useState("week");
  const [userSegment, setUserSegment] = React.useState("all");

  // Calculate total active users based on intensity
  const totalActiveUsers = activityData.reduce((sum, item) => {
    const intensity = item[2];
    return sum + (intensity > 0 ? intensity * 25 : 0); // Each intensity point represents ~25 users
  }, 0);

  // Find peak activity time
  const peakActivity = activityData.reduce(
    (peak, [hour, day, intensity]) => {
      if (intensity > peak.intensity) {
        return { hour, day, intensity };
      }
      return peak;
    },
    { hour: 0, day: 0, intensity: 0 },
  );

  const peakDay = dayLabels[peakActivity.day];
  const peakTime = hourLabels[peakActivity.hour];

  return (
    <Card className="@container/heatmap">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Users className="size-4" />
          User Activity Heatmap
        </CardTitle>
        <CardDescription className="text-xs">User engagement patterns by day and hour</CardDescription>
        <CardAction className="flex gap-1.5">
          <Select value={userSegment} onValueChange={setUserSegment}>
            <SelectTrigger className="h-7 w-[110px] text-xs" size="sm">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
              <SelectItem value="returning">Returning Users</SelectItem>
              <SelectItem value="premium">Premium Users</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-7 w-[110px] text-xs" size="sm">
              <SelectValue placeholder="Last Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-col">
          <div className="mb-1 flex items-center justify-end gap-1.5">
            <div className="text-muted-foreground text-[10px]">Less</div>
            <div className="flex gap-0.5">
              {intensityColors.map((color, i) => (
                <div key={i} className={cn("h-2 w-2 rounded-sm", color)} aria-label={`Activity level ${i}`} />
              ))}
            </div>
            <div className="text-muted-foreground text-[10px]">More</div>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-1.5">
            <div className="pt-5"></div>
            <div className="grid grid-cols-24 gap-0.5">
              {hourLabels.map((hour, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-muted-foreground text-center text-[0.6rem]",
                    i % 2 !== 0 && "hidden @md/heatmap:block",
                    i % 3 !== 0 && "hidden @xs/heatmap:block @md/heatmap:hidden",
                    i % 6 !== 0 && "hidden @xs/heatmap:hidden",
                  )}
                >
                  {hour}
                </div>
              ))}
            </div>

            {dayLabels.map((day, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <div className="text-muted-foreground flex items-center text-[0.65rem]">{day}</div>
                <div className="grid grid-cols-24 gap-0.5">
                  {Array.from({ length: 24 }, (_, hourIndex) => {
                    const cellData = activityData.find(([h, d]) => h === hourIndex && d === dayIndex);
                    const intensity = cellData ? cellData[2] : 0;
                    const userCount = intensity * 25; // Each intensity point represents ~25 users

                    return (
                      <TooltipProvider key={hourIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "aspect-square w-full cursor-pointer rounded-sm transition-colors",
                                intensityColors[intensity],
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="px-2 py-1 text-[10px]">
                            <p className="font-medium">
                              {day} at {hourLabels[hourIndex]}
                            </p>
                            <p>{userCount} active users</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1 @md/heatmap:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border p-2">
            <div className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-full">
              <Users className="text-primary size-3.5" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase">Total Active Users</p>
              <p className="text-sm font-semibold tabular-nums">{totalActiveUsers.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-2">
            <div className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-full">
              <Clock className="text-primary size-3.5" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase">Peak Activity</p>
              <p className="text-sm font-semibold">
                {peakDay} at {peakTime}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
