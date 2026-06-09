"use client";

import { ArrowUpDown, Bot, ChevronDown, Plus, Search, SlidersHorizontal, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function KanbanToolbar() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <div className="relative sm:w-48">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder="Search deals" className="h-9 pl-8" />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="lg" className="h-9 justify-start">
            <SlidersHorizontal data-icon="inline-start" />
            Filter
          </Button>
        </TooltipTrigger>
        <TooltipContent>Filter deals</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="lg" className="h-9 justify-start">
            <ArrowUpDown data-icon="inline-start" />
            Sort
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sort deals</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="lg" className="h-9 justify-start">
            <UsersRound data-icon="inline-start" />
            Group
          </Button>
        </TooltipTrigger>
        <TooltipContent>Group by</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="lg" className="h-9 justify-start">
            <Bot data-icon="inline-start" />
            Automate
          </Button>
        </TooltipTrigger>
        <TooltipContent>Automations</TooltipContent>
      </Tooltip>
      <div className="flex">
        <Button size="lg" className="h-9 rounded-r-none bg-blue-600 px-3 text-white hover:bg-blue-700">
          <Plus data-icon="inline-start" />
          Add deal
        </Button>
        <Button
          size="icon-lg"
          aria-label="Open add deal menu"
          className="h-9 rounded-l-none border-white/20 border-l bg-blue-600 text-white hover:bg-blue-700"
        >
          <ChevronDown />
        </Button>
      </div>
    </div>
  );
}
