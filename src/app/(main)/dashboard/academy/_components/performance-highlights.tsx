"use client";

import { ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

function PerformanceHighlightBar({
  height = 0,
  payload,
  width = 0,
  x = 0,
  y = 0,
}: {
  height?: number;
  payload?: PerformanceHighlight;
  width?: number;
  x?: number;
  y?: number;
}) {
  if (!payload) {
    return null;
  }

  const barHeight = Math.min(32, height);
  const barY = y + (height - barHeight) / 2;
  const radius = barHeight / 2;
  const fillWidth = Math.max(width * (payload.score / 100), 86);
  const avatarSize = 22;
  const avatarStart = x + 8;
  const avatarY = barY + (barHeight - avatarSize) / 2 - 1.5;
  const labelX = avatarStart + payload.people.length * 14 + 14;

  return (
    <g>
      <rect
        fill="color-mix(in oklch, var(--color-duration) 18%, transparent)"
        height={barHeight}
        rx={radius}
        width={width}
        x={x}
        y={barY}
      />
      <rect fill="var(--color-duration)" height={barHeight} rx={radius} width={fillWidth} x={x} y={barY} />

      {payload.people.map((person, index) => {
        const avatarX = avatarStart + index * 14;

        return (
          <foreignObject
            height={avatarSize + 4}
            key={person.initials}
            overflow="visible"
            width={avatarSize + 4}
            x={avatarX - 2}
            y={avatarY}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={person.name}
                  className="flex size-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  type="button"
                >
                  <Avatar className="size-5 bg-muted" size="sm">
                    <AvatarFallback className="text-foreground">{person.initials}</AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                <div className="grid gap-1">
                  <p>{person.name}</p>
                  <p>{person.role}</p>
                  <p>
                    {payload.className} · {payload.subject}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </foreignObject>
        );
      })}

      <text
        dominantBaseline="middle"
        x={labelX}
        y={barY + barHeight / 2 + 0.5}
        className="fill-primary-foreground font-medium text-xs"
      >
        {payload.subject}
      </text>

      <text
        dominantBaseline="middle"
        fill="var(--foreground)"
        fontSize={11}
        textAnchor="end"
        x={x + width - 10}
        y={barY + barHeight / 2 + 0.5}
        className="font-medium tabular-nums"
      >
        {payload.score}%
      </text>
    </g>
  );
}

export function PerformanceHighlights() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Performance Highlights</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          View Insights <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-70 w-full">
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
            <Bar dataKey="start" fill="transparent" stackId="timeline" />
            <Bar dataKey="duration" shape={<PerformanceHighlightBar />} stackId="timeline" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
