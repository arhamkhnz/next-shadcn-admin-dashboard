"use client";

import { ScheduleView } from "./_components/schedule-view";

export default function SchedulePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
      <ScheduleView />
    </div>
  );
}
