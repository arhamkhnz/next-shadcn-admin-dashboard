import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AttendanceOverview } from "./_components/attendance-overview";
import { departments } from "./_components/data";
import { EmployeeTenure } from "./_components/employee-tenure";
import { GenderDistribution } from "./_components/gender-distribution";
import { HiringPipeline } from "./_components/hiring-pipeline";
import { KpiCards } from "./_components/kpi-cards";
import { OvertimeOverview } from "./_components/overtime-overview";

export const metadata: Metadata = {
  title: "Open Source HR Dashboard with shadcn/ui",
  description:
    "Explore an open source HR dashboard with workforce metrics, attendance, overtime, employee tenure, and a hiring pipeline.",
  alternates: {
    canonical: "/dashboard/hr",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Good morning, Arham</h1>
          <p className="text-muted-foreground text-sm">Here’s what’s happening with your team today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger size="sm" aria-label="Department">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="button" size="sm">
            <Plus data-icon="inline-start" />
            Add employee
          </Button>
        </div>
      </header>
      <KpiCards />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <AttendanceOverview />
        <OvertimeOverview />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <EmployeeTenure />
        <GenderDistribution />
        <HiringPipeline />
      </div>
    </div>
  );
}
