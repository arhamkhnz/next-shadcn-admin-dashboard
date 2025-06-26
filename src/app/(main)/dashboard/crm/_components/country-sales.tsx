"use client";

import React from "react";

import { ArrowDownRight, ArrowUpRight, DollarSign, EllipsisVertical } from "lucide-react";
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import { countries, projects } from "./types";

const data = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 300 },
  { name: "Apr", value: 150 },
  { name: "May", value: 150 },
  { name: "Jun", value: 400 },
  { name: "July", value: 100 },
  { name: "Aug", value: 300 },
  { name: "Sep", value: 300 },
  { name: "Oct", value: 150 },
  { name: "Nov", value: 150 },
  { name: "Dec", value: 400 },
];

export function CountrySales() {
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Sales by Countries</CardTitle>
            <CardDescription>Monthly Sales Overview</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                <EllipsisVertical className="text-muted-foreground h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last Week</DropdownMenuItem>
              <DropdownMenuItem>Last Month</DropdownMenuItem>
              <DropdownMenuItem>Last Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        {/* <CardContent className="p-4 flex-1 gap-4" > */}

        {countries.map((country) => (
          <div key={country.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={country.flag} alt={country.name} className="h-6 w-6 scale-125 rounded-full object-cover" />
              <div>
                <p className="text-foreground text-sm font-medium">{country.sales}</p>
                <p className="text-muted-foreground text-xs">{country.name}</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${country.isPositive ? "text-green-600" : "text-red-500"}`}
            >
              {country.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {country.change}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ProjectStatus Component
export function ProjectStatus() {
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">Project Status</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                <EllipsisVertical className="text-muted-foreground h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>Update</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* <CardContent className="flex-grow flex flex-col"> */}
      <CardContent className="flex-1 p-4">
        {/* Top Earnings Row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">$4,3742</p>
              <p className="text-muted-foreground text-sm">Your Earnings</p>
            </div>
          </div>
          <div className="text-sm font-medium text-green-600">+10.2%</div>
        </div>

        {/* Simple Line Graph (Mock SVG) */}
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" hide />
              <YAxis hide />

              <Area
                type="stepAfter"
                dataKey="value"
                stroke="#f97316"
                fill="url(#orangeGradient)"
                strokeWidth={4}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Sources */}
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex w-full flex-col gap-2 text-sm">
          {/* Row 1: Donates */}
          <div className="flex w-full items-center justify-between">
            <p className="font-medium text-gray-800">Donates</p>
            <div className="flex min-w-[120px] justify-end gap-3">
              <span className="font-medium text-gray-400">$756.26</span>
              <span className="text-red-500">-139.34</span>
            </div>
          </div>

          {/* Row 2: Podcasts */}
          <div className="flex w-full items-center justify-between">
            <p className="font-medium text-gray-800">Podcasts</p>
            <div className="flex min-w-[120px] justify-end gap-3">
              <span className="font-medium text-gray-400">$2,207.03</span>
              <span className="text-green-600">+576.24</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// ActiveProject Component
export function ActiveProjects() {
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Active Projects</CardTitle>
            <CardDescription>Average 72% completed</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted rounded-full border-none p-1 outline-none focus:ring-0 focus:outline-none">
                <EllipsisVertical className="text-muted-foreground h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>Update</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* <CardContent className="flex flex-col gap-4 pt-2"> */}
      <CardContent className="flex-1 p-4">
        {projects.map((project) => (
          <div key={project.name} className="flex items-start gap-3">
            <img src={project.icon} alt={project.name} className="mt-1 h-6 w-6" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-muted-foreground text-xs">{project.desc}</p>
                </div>
                <div className="flex w-full items-end justify-end [&_.bg-primary]:bg-indigo-600">
                  <Progress
                    value={project.percent}
                    className="h-2 w-20"
                    // barClassName={project.color}
                    style={{
                      // Overriding progress fill color using inline style + CSS variable
                      ["--progress-color" as any]: "#4f46e5",
                    }}
                  />{" "}
                </div>
                <span className="text-muted-foreground text-sm">{project.percent}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
