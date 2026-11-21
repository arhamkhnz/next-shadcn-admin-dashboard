import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { KpiCards } from "./_components/kpi-cards";

const departments = [
  "Finance",
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Human resources",
  "Operations",
  "Support",
];

export const metadata: Metadata = {
  title: "HR Dashboard",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight">Good morning, Arham</h1>
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
    </div>
  );
}
