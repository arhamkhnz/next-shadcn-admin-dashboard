"use client";

import * as React from "react";

import { format, subDays } from "date-fns";
import { Bell, Calendar, ChevronDown, Plus, Search, Settings, Users } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rootUser } from "@/data/users";
import { cn } from "@/lib/utils";

const quickActions = [
  { label: "New Lead", icon: Users, color: "text-primary" },
  { label: "Send Email", icon: "email", color: "text-primary" },
  { label: "Schedule Call", icon: Calendar, color: "text-primary" },
  { label: "More Actions", icon: Settings, color: "text-muted-foreground" },
];

const timeRanges = [
  { label: "Today", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
  { label: "Custom", value: "custom" },
];

export function PageHeader() {
  const [activeTimeRange, setActiveTimeRange] = React.useState("month");
  const [searchQuery, setSearchQuery] = React.useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Card className="shadow-xs border-0">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-2xl tracking-tight">
                {getGreeting()}, {rootUser.name} 👋
              </h1>
              <p className="text-muted-foreground text-sm">Here's what's happening with your sales pipeline today.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads, contacts..."
                  className="w-64 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="size-4" />
              </Button>
              <Button size="icon">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 pb-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Tabs defaultValue="overview" className="hidden sm:block">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TimeRangeSelector activeRange={activeTimeRange} onRangeChange={setActiveTimeRange} />
              <QuickActions />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TimeRangeSelector({
  activeRange,
  onRangeChange,
}: {
  activeRange: string;
  onRangeChange: (value: string) => void;
}) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = subDays(to, 29);
    return { from, to };
  });

  const getRangeLabel = () => {
    if (activeRange === "custom" && dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "d MMM")} - ${format(dateRange.to, "d MMM yyyy")}`;
    }
    return timeRanges.find((r) => r.value === activeRange)?.label || "Select Range";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="size-4" />
          <span className="hidden sm:inline">{getRangeLabel()}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Time Range</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {timeRanges.map((range) => (
            <DropdownMenuItem
              key={range.value}
              onClick={() => {
                if (range.value !== "custom") {
                  onRangeChange(range.value);
                }
              }}
              className={cn("cursor-pointer", activeRange === range.value && "bg-accent text-accent-foreground")}
            >
              {range.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-2">
          <p className="text-muted-foreground mb-2 text-xs">Custom Range</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" size="sm">
                <Calendar className="mr-2 size-4" />
                {dateRange?.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                    : format(dateRange.from, "LLL dd, y")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(value) => {
                  setDateRange(value);
                  if (value?.from && value?.to) {
                    onRangeChange("custom");
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function QuickActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="size-4" />
          <span className="hidden sm:inline">Quick Actions</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Users className="mr-2 size-4" />
            <span>Add New Lead</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Calendar className="mr-2 size-4" />
            <span>Schedule Meeting</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Badge className="mr-2 size-4" />
            <span>Create Proposal</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Search className="mr-2 size-4" />
            <span>Export Reports</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer">
            <span>Hot Leads</span>
            <Badge variant="destructive" className="ml-auto">
              12
            </Badge>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <span>Stalled Deals</span>
            <Badge variant="secondary" className="ml-auto">
              8
            </Badge>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <span>Due Today</span>
            <Badge variant="outline" className="ml-auto">
              5
            </Badge>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
