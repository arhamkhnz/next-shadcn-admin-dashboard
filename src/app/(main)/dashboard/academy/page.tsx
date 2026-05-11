import { BarChart3, Plus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { KpiCards } from "./_components/kpi-cards";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Academy Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Good morning, Admin. Here's a quick overview of today's activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:w-fit">
          <Button size="sm">
            <Plus />
            New Announcement
          </Button>
          <Button size="sm" variant="outline">
            <BarChart3 />
            View Results
          </Button>
          <Button size="sm" variant="outline">
            <UserPlus />
            Add Student
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <KpiCards />
        </div>
      </div>
    </div>
  );
}
