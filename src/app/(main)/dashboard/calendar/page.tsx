import type { ReactNode } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calendarDays = [
  { day: "31", muted: true },
  {
    day: "1",
    events: [
      { time: "10:00 AM", title: "One-on-one...", color: "team" },
      { time: "1:30 PM", title: "Project sync", color: "focus" },
    ],
  },
  {
    day: "2",
    events: [
      { time: "9:30 AM", title: "Deep work", color: "work" },
      { time: "12:00 PM", title: "Lunch with Ol...", color: "personal" },
    ],
  },
  { day: "3", events: [{ time: "11:00 AM", title: "Design review", color: "team" }] },
  { day: "4", events: [{ time: "9:00 AM", title: "Marketing standup", color: "pink" }] },
  { day: "5" },
  { day: "6" },
  {
    day: "7",
    events: [
      { time: "11:00 AM", title: "Content planning", color: "work" },
      { time: "3:00 PM", title: "Focus block", color: "focus", icon: true },
    ],
  },
  {
    day: "8",
    events: [
      { time: "10:00 AM", title: "Client call", color: "personal" },
      { time: "2:00 PM", title: "Design sync", color: "team" },
    ],
  },
  {
    day: "9",
    events: [
      { time: "9:30 AM", title: "Deep work", color: "work" },
      { time: "1:00 PM", title: "Team retro", color: "soft" },
    ],
  },
  {
    day: "10",
    events: [
      { time: "12:00 PM", title: "Lunch & learn", color: "personal" },
      { time: "3:30 PM", title: "Focus block", color: "focus", icon: true },
    ],
  },
  { day: "11", events: [{ time: "10:00 AM", title: "Product demo", color: "team" }] },
  { day: "12" },
  { day: "13", events: [{ time: "All day", title: "Family time", color: "personal", calendar: true }] },
  {
    day: "14",
    events: [
      { time: "11:00 AM", title: "Leadership sync", color: "team" },
      { time: "2:30 PM", title: "Content review", color: "work" },
    ],
  },
  {
    day: "15",
    events: [
      { time: "9:30 AM", title: "Deep work", color: "work" },
      { time: "3:00 PM", title: "Focus block", color: "focus", icon: true },
    ],
  },
  {
    day: "16",
    events: [
      { time: "10:00 AM", title: "UX research", color: "pink" },
      { time: "1:00 PM", title: "Stakeholder call", color: "personal" },
    ],
  },
  {
    day: "17",
    events: [
      { time: "11:00 AM", title: "Design critique", color: "team" },
      { time: "2:30 PM", title: "Docs review", color: "work" },
    ],
  },
  {
    day: "18",
    active: true,
    events: [
      { time: "Good Friday", title: "All day", color: "focus", stacked: true },
      { time: "5:30 PM", title: "Team dinner", color: "personal" },
    ],
  },
  { day: "19" },
  { day: "20", events: [{ time: "10:00 AM", title: "Hike", color: "personal", dot: true }] },
  {
    day: "21",
    events: [
      { time: "11:00 AM", title: "Content planning", color: "work" },
      { time: "4:00 PM", title: "Brand workshop", color: "pink" },
    ],
  },
  {
    day: "22",
    events: [
      { time: "10:00 AM", title: "Sales call", color: "personal" },
      { time: "1:30 PM", title: "Deep work", color: "work" },
    ],
  },
  {
    day: "23",
    events: [
      { time: "3:00 PM", title: "Focus block", color: "focus", icon: true },
      { time: "5:30 PM", title: "Yoga class", color: "pink" },
    ],
  },
  {
    day: "24",
    events: [
      { time: "10:00 AM", title: "Product review", color: "team" },
      { time: "12:00 PM", title: "Lunch with team", color: "personal" },
    ],
  },
  {
    day: "25",
    events: [
      { time: "9:30 AM", title: "Sprint planning", color: "work" },
      { time: "2:00 PM", title: "Design sync", color: "team" },
    ],
  },
  { day: "26" },
  { day: "27", events: [{ time: "All day", title: "Reset day", color: "personal", calendar: true }] },
  {
    day: "28",
    events: [
      { time: "11:00 AM", title: "Leadership sync", color: "team" },
      { time: "2:30 PM", title: "Content review", color: "work" },
    ],
  },
  {
    day: "29",
    events: [
      { time: "9:30 AM", title: "Deep work", color: "work" },
      { time: "12:00 PM", title: "Client call", color: "personal" },
    ],
  },
  {
    day: "30",
    events: [
      { time: "10:00 AM", title: "Stakeholder call", color: "personal" },
      { time: "3:00 PM", title: "Focus block", color: "focus", icon: true },
    ],
  },
  { day: "1", muted: true, events: [{ time: "All day", title: "Labor Day", color: "gray" }] },
  { day: "2", muted: true },
  { day: "3", muted: true },
  { day: "4", muted: true },
];

const eventStyles = {
  focus: "bg-orange-100/70 text-orange-600",
  gray: "bg-neutral-100 text-neutral-500",
  personal: "bg-emerald-100/70 text-emerald-600",
  pink: "bg-rose-100/70 text-rose-500",
  soft: "bg-indigo-100/60 text-indigo-500",
  team: "bg-violet-100/70 text-violet-600",
  work: "bg-blue-100/70 text-blue-600",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="flex items-center justify-between gap-6 border-neutral-200 border-b px-8 py-7">
        <div className="flex min-w-0 items-center gap-16">
          <div>
            <div className="flex items-center gap-2 font-semibold text-2xl">
              April 2025
              <ChevronIcon />
            </div>
            <p className="mt-1 text-neutral-500 text-sm">31 days - 22 events</p>
          </div>

          <div className="flex items-center gap-7 rounded-xl border border-neutral-200 bg-white px-3 py-3 shadow-sm">
            <button
              type="button"
              className="rounded-full bg-neutral-950 px-5 py-2.5 font-medium text-sm text-white shadow-sm"
            >
              All events
            </button>
            <LegendDot color="bg-blue-500" label="Work" />
            <LegendDot color="bg-emerald-500" label="Personal" />
            <LegendDot color="bg-violet-500" label="Team" />
            <LegendDot color="bg-orange-500" label="Focus time" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ToolbarButton icon={<CalendarIcon />}>All calendars</ToolbarButton>
          <ToolbarButton icon={<FilterIcon />} showChevron={false}>
            Filter
          </ToolbarButton>
          <div className="flex overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <button type="button" className="grid size-12 place-items-center border-neutral-200 border-r">
              <ArrowLeftIcon />
            </button>
            <button type="button" className="h-12 px-7 font-medium text-sm">
              Today
            </button>
            <button type="button" className="grid size-12 place-items-center border-neutral-200 border-l">
              <ArrowRightIcon />
            </button>
          </div>
          <ToolbarButton>Month</ToolbarButton>
          <button
            type="button"
            className="flex h-14 items-center gap-3 rounded-xl bg-neutral-950 px-7 font-semibold text-white shadow-lg shadow-neutral-900/20"
          >
            <PlusIcon />
            Add event
          </button>
        </div>
      </header>

      <section className="px-8 py-5">
        <div className="grid grid-cols-7 px-px pb-4 text-center text-neutral-500 text-sm">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-neutral-200">
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => (
              <div
                key={`${date.day}-${index}`}
                className="min-h-[200px] border-neutral-200 border-r border-b bg-white p-4 last:border-r-0"
              >
                <div
                  className={
                    date.active
                      ? "mb-4 grid size-7 place-items-center rounded-full bg-neutral-950 font-semibold text-sm text-white"
                      : `mb-5 font-medium text-sm ${date.muted ? "text-neutral-400" : "text-neutral-900"}`
                  }
                >
                  {date.day}
                </div>
                <div className="flex flex-col gap-3">
                  {date.events?.map((event) => (
                    <EventPill key={`${event.time}-${event.title}`} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <StatsCard />
        </div>
      </section>
    </main>
  );
}

function EventPill({
  event,
}: {
  event: {
    calendar?: boolean;
    color: keyof typeof eventStyles;
    dot?: boolean;
    icon?: boolean;
    stacked?: boolean;
    time: string;
    title: string;
  };
}) {
  return (
    <div
      className={`flex min-h-9 items-center justify-between gap-2 rounded-md px-3 font-semibold text-sm ${eventStyles[event.color]}`}
    >
      <span className={event.stacked ? "leading-tight" : "truncate"}>
        <span>{event.time}</span>
        <span className={event.stacked ? "block" : "ml-4"}>{event.title}</span>
      </span>
      {event.icon ? <TargetIcon /> : null}
      {event.calendar ? <CalendarTinyIcon /> : null}
      {event.dot ? <span className="size-2 rounded-full bg-emerald-400" /> : null}
    </div>
  );
}

function StatsCard() {
  return (
    <aside className="absolute top-4 right-5 w-[410px] rounded-2xl border border-neutral-200 bg-white/95 p-6 shadow-2xl shadow-neutral-900/10 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-sm">
          This month
          <ChevronIcon />
        </div>
        <MoreIcon />
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-7">
        <Metric icon={<CalendarIcon />} label="Total events" tone="blue" value="22" />
        <Metric icon={<ClockIcon />} label="Total time" tone="green" value="61h 30m" />
        <Metric icon={<UsersIcon />} label="Meetings" tone="purple" value="9" />
        <Metric icon={<TargetIcon />} label="Focus blocks" tone="orange" value="4" />
      </div>
    </aside>
  );
}

function Metric({
  icon,
  label,
  tone,
  value,
}: {
  icon: ReactNode;
  label: string;
  tone: "blue" | "green" | "orange" | "purple";
  value: string;
}) {
  const tones = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-violet-100 text-violet-600",
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`grid size-11 place-items-center rounded-full ${tones[tone]}`}>{icon}</div>
      <div>
        <div className="font-semibold text-xl">{value}</div>
        <div className="text-neutral-500 text-sm">{label}</div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-neutral-600 text-sm">
      <span className={`size-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function ToolbarButton({
  children,
  icon,
  showChevron = true,
}: {
  children: ReactNode;
  icon?: ReactNode;
  showChevron?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex h-12 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 font-medium text-neutral-700 text-sm shadow-sm"
    >
      {icon}
      {children}
      {showChevron ? <ChevronIcon /> : null}
    </button>
  );
}

function ChevronIcon() {
  return (
    <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 2.8v3.4M13.5 2.8v3.4M4 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarTinyIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 2.8v2.4M11 2.8v2.4M3.5 7h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10 6.5V10l2.4 2.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 15c.5-2.4 2-3.6 4-3.6s3.5 1.2 4 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M13 8.5a2 2 0 1 0 0-4M13.5 11.8c1.5.3 2.5 1.3 2.9 3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 6h10M7 10h6M9 14h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 4.5v.1M10 10v.1M10 15.5v.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4l1.6-1.6M12.4 3.6H14M12.4 3.6V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
