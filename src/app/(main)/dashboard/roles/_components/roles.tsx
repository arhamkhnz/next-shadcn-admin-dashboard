"use client";

import { useState } from "react";

import { ListFilter, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { RoleDetailsSheetContent } from "./role-details-panel";
import { RolesTable } from "./roles-table";

export function Roles() {
  const [detailsOpen, setDetailsOpen] = useState(true);

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col gap-4 px-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-2xl leading-none tracking-tight">Roles</h1>
          <p className="text-muted-foreground text-sm leading-none">
            Manage roles and their permissions across the platform.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="h-7 sm:w-80 lg:w-96">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput className="h-7" placeholder="Search roles..." />
          </InputGroup>
          <Button size="sm" variant="outline">
            <ListFilter data-icon="inline-start" />
            Filter
          </Button>
          <Button size="sm">
            <Plus data-icon="inline-start" />
            Create Role
          </Button>
        </div>
      </div>

      <Separator className="mb-0" />

      <div className="grid xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="all">
            <TabsList
              variant="line"
              className="w-full justify-start gap-4 border-b px-4 *:data-[slot=tabs-trigger]:flex-none"
            >
              <TabsTrigger value="all">All Roles</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-between gap-6 px-4">
            <div className="flex items-center gap-2">
              <Select defaultValue="All">
                <SelectTrigger size="sm">
                  <span className="text-muted-foreground">Access Level:</span>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Full Access">Full Access</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue="All">
                <SelectTrigger size="sm">
                  <span className="text-muted-foreground">Role Type:</span>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue="Active">
                <SelectTrigger size="sm">
                  <span className="text-muted-foreground">Status:</span>
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  <SelectGroup>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => setDetailsOpen((value) => !value)}>
                {detailsOpen ? "Close role details" : "Open role details"}
              </Button>
            </div>

            <Button size="sm" variant="outline">
              <SlidersHorizontal data-icon="inline-start" />
              More Filters
            </Button>
          </div>

          <div className="px-4">
            <RolesTable />
          </div>
        </div>

        <aside
          className={cn(
            "overflow-hidden border-border border-l transition-[width] duration-200 ease-out",
            detailsOpen ? "w-full xl:w-100" : "w-0 border-l-0",
          )}
        >
          <div className="w-full xl:w-100">
            <RoleDetailsSheetContent onClose={() => setDetailsOpen(false)} />
          </div>
        </aside>
      </div>
    </div>
  );
}
