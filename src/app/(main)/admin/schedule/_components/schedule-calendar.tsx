"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { Washer } from "../../washers/_components/types";

type ScheduleDetail = {
  washer: Washer;
  startTime: string;
  endTime: string;
};

export function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { washers } = useWasherStore();
  const { schedules } = useWasherScheduleStore();

  const getSchedulesForDate = (date: Date): ScheduleDetail[] => {
    const dayOfWeek = date.getDay();
    const dailySchedules = schedules.filter((s) => s.day_of_week === dayOfWeek);

    return dailySchedules
      .map((schedule) => {
        const washer = washers.find((w) => w.id === schedule.washer_id);
        return {
          washer: washer!,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
        };
      })
      .filter((item) => item.washer);
  };

  const selectedDaySchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="col-span-1 md:col-span-2">
        <Card>
          <CardContent className="p-0">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Schedule for {selectedDate ? selectedDate.toLocaleDateString() : "N/A"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDaySchedules.length > 0 ? (
              selectedDaySchedules.map((detail) => (
                <div key={detail.washer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`/avatars/${detail.washer.name.toLowerCase().replace(" ", "")}.png`} />
                      <AvatarFallback>{detail.washer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{detail.washer.name}</p>
                      <p className="text-muted-foreground text-sm">{detail.washer.branch}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm">
                      {detail.startTime} - {detail.endTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No washers scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
