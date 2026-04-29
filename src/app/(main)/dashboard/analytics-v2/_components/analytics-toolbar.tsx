import { CalendarDays, Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AnalyticsToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 xl:col-span-12">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Select defaultValue="last-4-weeks">
          <SelectTrigger>
            <CalendarDays />
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-4-weeks">Last 4 weeks</SelectItem>
              <SelectItem value="last-3-months">Last 3 months</SelectItem>
              <SelectItem value="year-to-date">Year to date</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button size="icon" variant="outline" aria-label="More analytics actions">
          <Ellipsis />
        </Button>
      </div>
    </div>
  );
}
