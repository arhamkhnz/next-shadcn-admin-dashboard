"use client";

import React from "react";

import { notFound } from "next/navigation";

import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { AddScheduleForm } from "./_components/add-schedule-form";
import { ScheduleList } from "./_components/schedule-list";

export default function WasherSchedulePage({ params }: { params: Promise<{ washerId: string }> }) {
  const resolvedParams = React.use(params);
  const { washerId } = resolvedParams;
  const { getSchedulesForWasher } = useWasherScheduleStore();
  const { washers } = useWasherStore();

  const washer = washers.find((w) => w.id === washerId);
  const schedules = getSchedulesForWasher(washerId);

  if (!washer) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Schedule for {washer.name}</h2>
          <p className="text-muted-foreground">Add or remove weekly work shifts.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddScheduleForm washerId={washerId} />
        </div>
        <div className="lg:col-span-2">
          <ScheduleList schedules={schedules} />
        </div>
      </div>
    </div>
  );
}
