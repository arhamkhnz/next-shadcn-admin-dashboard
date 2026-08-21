"use client";

import * as React from "react";

import { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { differenceInCalendarDays, endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, XIcon } from "lucide-react";

import type { Activity } from "@/app/(main)/dashboard/crm/_components/activities/activity-schema";
import { getScheduleState, getTaskDueAt } from "@/app/(main)/dashboard/crm/_components/activities/activity-utils";
import { EventCalendarViews } from "@/components/calendar/event-calendar-views";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useActivityStore } from "../../crm/_components/activities/use-activity-store";
import { demoEvents } from "./events-data";

const today = new Date(2026, 7, 16);

interface CalendarTaskEvent {
  id: string;
  title: string;
  start: Date;
  allDay: boolean;
  url: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

function buildTaskCalendarEvents(tasks: Activity[]): CalendarTaskEvent[] {
  const openColors = {
    backgroundColor: "var(--color-sky-500)",
    borderColor: "var(--color-sky-600)",
    textColor: "white",
  };
  const overdueColors = {
    backgroundColor: "var(--color-red-500)",
    borderColor: "var(--color-red-600)",
    textColor: "white",
  };
  const completedColors = {
    backgroundColor: "var(--color-emerald-500)",
    borderColor: "var(--color-emerald-600)",
    textColor: "white",
  };

  return tasks
    .filter((task) => task.status !== "Canceled")
    .map((task) => {
      if (task.status === "Completed") {
        return {
          id: task.id,
          title: `${task.title} (Completed)`,
          start: task.completedAt ? parseISO(task.completedAt) : parseISO(getTaskDueAt(task)),
          allDay: true,
          url: `/dashboard/crm/tasks/${task.id}`,
          ...completedColors,
        };
      }
      const overdue = getScheduleState(task, today) === "Overdue";
      return {
        id: task.id,
        title: task.title,
        start: parseISO(getTaskDueAt(task)),
        allDay: false,
        url: `/dashboard/crm/tasks/${task.id}`,
        ...(overdue ? overdueColors : openColors),
      };
    });
}

const views = [
  { key: "dayGridMonth", label: "Month" },
  { key: "timeGridWeek", label: "Week" },
  { key: "timeGridDay", label: "Day" },
];

const calendars = [
  { key: "all", label: "All calendars" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "team", label: "Team" },
  { key: "focus", label: "Focus time" },
];

const plugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, multiMonthPlugin];

export function Calendar() {
  const controller = useCalendarController();
  const activities = useActivityStore((s) => s.activities);
  const [eventCount, setEventCount] = React.useState(0);
  const [selectedCalendar, setSelectedCalendar] = React.useState(calendars[0].key);

  const taskEvents = React.useMemo(
    () => buildTaskCalendarEvents(activities.filter((a) => a.type === "Task")),
    [activities],
  );
  const allEvents = React.useMemo(() => [...demoEvents, ...taskEvents], [taskEvents]);
  const [dateInfo, setDateInfo] = React.useState(() => {
    return {
      title: format(today, "MMMM yyyy"),
      days: differenceInCalendarDays(endOfMonth(today), startOfMonth(today)) + 1,
    };
  });
  const title = dateInfo.title;
  const days = dateInfo.days;

  return (
    <div className="flex flex-col overflow-hidden rounded-md border">
      <div className="flex flex-col gap-4 border-b bg-sidebar p-4 text-sidebar-foreground lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 shrink-0 flex-col gap-1">
          <div className="font-medium text-lg leading-none">{title}</div>
          <p className="text-muted-foreground text-sm">
            {days} days - {eventCount} events
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
            <SelectTrigger className="w-full sm:w-44">
              <CalendarIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.key} value={calendar.key}>
                    {calendar.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ButtonGroup>
            <Button size="icon" variant="outline" aria-label="Previous period" onClick={() => controller.prev()}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => controller.today()}>
              Today
            </Button>
            <Button size="icon" variant="outline" aria-label="Next period" onClick={() => controller.next()}>
              <ChevronRight />
            </Button>
          </ButtonGroup>
          <Select
            value={controller.view?.type ?? views[0].key}
            onValueChange={(value) => {
              controller.changeView(value);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                {views.map((v) => (
                  <SelectItem key={v.key} value={v.key}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <Plus />
            Add event
          </Button>
        </div>
      </div>

      <EventCalendarViews
        controller={controller}
        initialView={views[0].key}
        initialDate={today}
        plugins={[...plugins]}
        popoverCloseContent={() => <XIcon className="size-5 text-muted-foreground group-hover:text-foreground" />}
        events={allEvents}
        eventClick={(info) => {
          if (info.event.url) {
            info.jsEvent.preventDefault();
            window.location.href = info.event.url;
          }
        }}
        nowIndicator
        datesSet={(info) => {
          setDateInfo({
            title: info.view.title,
            days: differenceInCalendarDays(info.view.currentEnd, info.view.currentStart),
          });
          setEventCount(
            allEvents.filter((event) => {
              const start = new Date(event.start);

              return start >= info.start && start < info.end;
            }).length,
          );
        }}
      />
    </div>
  );
}
