"use client";

import { type FocusEvent, type PointerEvent, useEffect, useRef, useState } from "react";

import { ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import { Bar, BarChart, type BarShapeProps, CartesianGrid, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const performanceHighlights = [
  {
    className: "G11A",
    start: 1.25,
    duration: 1.45,
    subject: "Pure Math",
    score: 84,
    people: [
      { initials: "AM", name: "Amina Malik", role: "Lead Teacher" },
      { initials: "LS", name: "Liam Scott", role: "Teaching Assistant" },
      { initials: "NK", name: "Nora Khan", role: "Student" },
    ],
  },
  {
    className: "G11B",
    start: 0.72,
    duration: 1.75,
    subject: "Literature",
    score: 78,
    people: [{ initials: "IR", name: "Isla Reed", role: "Lead Teacher" }],
  },
  {
    className: "G11C",
    start: 1.35,
    duration: 1.9,
    subject: "Physics",
    score: 80,
    people: [
      { initials: "SK", name: "Samir Khan", role: "Lead Teacher" },
      { initials: "MJ", name: "Maya Jensen", role: "Lab Technician" },
      { initials: "AT", name: "Alex Torres", role: "Student" },
    ],
  },
  {
    className: "G11D",
    start: 2.22,
    duration: 1.66,
    subject: "History",
    score: 73,
    people: [
      { initials: "RP", name: "Ravi Patel", role: "Lead Teacher" },
      { initials: "EH", name: "Elena Hart", role: "Student" },
    ],
  },
];

const chartConfig = {
  duration: {
    label: "Score",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type PerformanceHighlight = (typeof performanceHighlights)[number];
type PerformancePerson = PerformanceHighlight["people"][number];

function getPersonKey(className: string, initials: string) {
  return `${className}-${initials}`;
}

const peopleLookup = new Map(
  performanceHighlights.flatMap((highlight) =>
    highlight.people.map((person) => [getPersonKey(highlight.className, person.initials), { highlight, person }]),
  ),
);

function getPersonElementAtPoint(clientX: number, clientY: number) {
  return document.elementsFromPoint(clientX, clientY).find((element): element is HTMLElement => {
    return element instanceof HTMLElement && Boolean(element.dataset.personKey);
  });
}

type HoveredPerson = {
  className: string;
  person: PerformancePerson;
  subject: string;
  x: number;
  y: number;
};

function PersonIdentityCard({ hovered }: { hovered: HoveredPerson }) {
  return createPortal(
    <div
      className="pointer-events-none fixed z-50 grid min-w-36 -translate-x-1/2 -translate-y-[calc(100%+8px)] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
      role="tooltip"
      style={{ left: hovered.x, top: hovered.y }}
    >
      <div className="font-medium">{hovered.person.name}</div>
      <div className="grid gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{hovered.person.role}</span>
          <span className="font-medium text-foreground tabular-nums">{hovered.className}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{hovered.subject}</span>
          <span className="font-medium text-foreground tabular-nums">{hovered.person.initials}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PerformanceHighlightBar({ height = 0, payload, width = 0, x = 0, y = 0 }: BarShapeProps) {
  const highlight = payload as PerformanceHighlight | undefined;

  if (!highlight?.people?.length) {
    return null;
  }

  const barWidth = Number(width) || 0;
  const barHeight = Math.min(32, Number(height) || 0);
  const barX = Number(x) || 0;
  const barY = (Number(y) || 0) + ((Number(height) || 0) - barHeight) / 2;
  const radius = barHeight / 2;
  const fillWidth = Math.max(barWidth * (highlight.score / 100), 86);
  const avatarSize = 22;
  const avatarStart = barX + 8;
  const avatarY = barY + (barHeight - avatarSize) / 2 - 1.5;
  const labelX = avatarStart + highlight.people.length * 14 + 14;

  return (
    <g>
      <rect
        fill="color-mix(in oklch, var(--color-duration) 18%, transparent)"
        height={barHeight}
        pointerEvents="none"
        rx={radius}
        width={barWidth}
        x={barX}
        y={barY}
      />
      <rect
        fill="var(--color-duration)"
        height={barHeight}
        pointerEvents="none"
        rx={radius}
        width={fillWidth}
        x={barX}
        y={barY}
      />

      {highlight.people.map((person, index) => {
        const avatarX = avatarStart + index * 14;

        return (
          <foreignObject
            height={avatarSize + 4}
            key={getPersonKey(highlight.className, person.initials)}
            overflow="visible"
            style={{ overflow: "visible" }}
            width={avatarSize + 4}
            x={avatarX - 2}
            y={avatarY}
          >
            <button
              aria-label={`${person.name}, ${person.role}`}
              className="flex size-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-person-key={getPersonKey(highlight.className, person.initials)}
              type="button"
            >
              <Avatar className="size-5 bg-muted" size="sm">
                <AvatarFallback className="text-foreground">{person.initials}</AvatarFallback>
              </Avatar>
            </button>
          </foreignObject>
        );
      })}

      <text
        dominantBaseline="middle"
        pointerEvents="none"
        x={labelX}
        y={barY + barHeight / 2 + 0.5}
        className="fill-primary-foreground font-medium text-xs"
      >
        {highlight.subject}
      </text>

      <text
        dominantBaseline="middle"
        fill="var(--foreground)"
        fontSize={11}
        pointerEvents="none"
        textAnchor="end"
        x={barX + barWidth - 10}
        y={barY + barHeight / 2 + 0.5}
        className="font-medium tabular-nums"
      >
        {highlight.score}%
      </text>
    </g>
  );
}

export function PerformanceHighlights() {
  const hideTimeoutRef = useRef<number>(0);
  const [hovered, setHovered] = useState<HoveredPerson | null>(null);

  useEffect(() => {
    return () => window.clearTimeout(hideTimeoutRef.current);
  }, []);

  const showPersonFromElement = (element: HTMLElement) => {
    const key = element.dataset.personKey;
    const match = key ? peopleLookup.get(key) : undefined;

    if (!match) {
      return;
    }

    window.clearTimeout(hideTimeoutRef.current);
    const avatar = element.getBoundingClientRect();

    setHovered((current) => {
      if (current?.className === match.highlight.className && current.person.initials === match.person.initials) {
        return current;
      }

      return {
        className: match.highlight.className,
        person: match.person,
        subject: match.highlight.subject,
        x: avatar.left + avatar.width / 2,
        y: avatar.top,
      };
    });
  };

  const hidePerson = () => {
    window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setHovered(null);
    }, 80);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = getPersonElementAtPoint(event.clientX, event.clientY);

    if (element) {
      showPersonFromElement(element);
      return;
    }

    hidePerson();
  };

  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    const element = event.target instanceof HTMLElement ? event.target.closest("[data-person-key]") : null;

    if (element instanceof HTMLElement) {
      showPersonFromElement(element);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Performance Highlights</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          View Insights <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent onFocusCapture={handleFocusCapture} onPointerLeave={hidePerson} onPointerMove={handlePointerMove}>
        <ChartContainer config={chartConfig} className="aspect-auto h-70 min-h-70 w-full">
          <BarChart
            accessibilityLayer
            data={performanceHighlights}
            layout="vertical"
            margin={{ bottom: 0, left: 0, right: 8, top: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis
              axisLine={false}
              domain={[0, 4]}
              tickFormatter={(value) => ["Mon", "Tue", "Wed", "Thu", "Fri"][Number(value)] ?? ""}
              tickLine={false}
              tickMargin={10}
              ticks={[0, 1, 2, 3, 4]}
              type="number"
            />
            <YAxis axisLine={false} dataKey="className" tickLine={false} tickMargin={10} type="category" width={45} />
            <Bar dataKey="start" fill="transparent" isAnimationActive={false} stackId="timeline" />
            <Bar dataKey="duration" isAnimationActive={false} shape={PerformanceHighlightBar} stackId="timeline" />
          </BarChart>
        </ChartContainer>
        {hovered ? <PersonIdentityCard hovered={hovered} /> : null}
      </CardContent>
    </Card>
  );
}
