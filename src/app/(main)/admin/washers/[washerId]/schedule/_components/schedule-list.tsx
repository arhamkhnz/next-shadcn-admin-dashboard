"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWasherScheduleStore, WasherSchedule } from "@/stores/admin-dashboard/washer-schedule-store";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ScheduleList({ schedules }: { schedules: WasherSchedule[] }) {
  const { deleteSchedule } = useWasherScheduleStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <p className="text-muted-foreground">No shifts scheduled for this washer.</p>
        ) : (
          <ul className="space-y-4">
            {schedules
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .map((schedule) => (
                <li key={schedule.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="font-semibold">{daysOfWeek[schedule.day_of_week]}</p>
                    <p className="text-muted-foreground">
                      {schedule.start_time} - {schedule.end_time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteSchedule(schedule.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
