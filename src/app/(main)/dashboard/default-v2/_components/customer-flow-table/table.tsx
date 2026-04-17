"use client";

import { ArrowUpDown, Download, Funnel, LayoutList, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

import data from "../data.json";
import { ProposalSectionsTable } from "../proposal-sections-table/table";
import type { CustomerFlowRow } from "./schema";

type CustomerFlowTab = {
  value: string;
  data: CustomerFlowRow[];
};

function CustomerFlowTabContent({ value }: CustomerFlowTab) {
  if (value === "recent-customers") {
    return (
      <TabsContent value={value} className="grid gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <LayoutList data-icon="inline-start" />
              Group by Status
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <ArrowUpDown data-icon="inline-start" />
              Sort
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <SlidersHorizontal data-icon="inline-start" />
              View
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Funnel data-icon="inline-start" />
              Filter by Plan
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-8 rounded-[min(var(--radius-md),12px)] pl-8" placeholder="Search customers..." />
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              <Download data-icon="inline-start" />
              Export as CSV
            </Button>
          </div>
        </div>
        <ProposalSectionsTable data={data} showHeader={false} />
      </TabsContent>
    );
  }

  return (
    <TabsContent value={value}>
      <div className="py-8 text-muted-foreground text-sm">No information available.</div>
    </TabsContent>
  );
}

export function CustomerFlowTable({ tabs }: { tabs: CustomerFlowTab[] }) {
  return (
    <>
      {tabs.map((tab) => (
        <CustomerFlowTabContent key={tab.value} value={tab.value} data={tab.data} />
      ))}
    </>
  );
}
