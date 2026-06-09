"use client";

import { Gauge, Kanban, List, Table2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ViewTabs() {
  return (
    <Tabs defaultValue="board" className="min-w-0">
      <TabsList variant="line" className="h-10 gap-5 bg-transparent p-0">
        <TabsTrigger
          value="board"
          className="gap-2 px-0 data-active:text-blue-600 data-active:after:bg-blue-600 dark:data-active:text-blue-400 dark:data-active:after:bg-blue-400"
        >
          <Kanban />
          Board
        </TabsTrigger>
        <TabsTrigger value="list" className="gap-2 px-0">
          <List />
          List
        </TabsTrigger>
        <TabsTrigger value="table" className="gap-2 px-0">
          <Table2 />
          Table
        </TabsTrigger>
        <TabsTrigger value="forecast" className="gap-2 px-0">
          <Gauge />
          Forecast
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
