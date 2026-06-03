"use client";

import { Bell, ChevronDown, Search, Sun } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-[#e7eaf1] border-b px-6">
      <button className="flex items-center gap-2 font-semibold text-[#2a303b] text-lg">
        Acme Analytics Workspace
        <ChevronDown className="size-4 text-[#6f7787]" />
      </button>
      <div className="flex items-center gap-5">
        <button className="hidden h-10 items-center gap-3 rounded-lg border border-[#e1e5ed] px-4 text-[#697284] text-sm md:flex">
          <Search className="size-4" />
          Search
          <span className="rounded bg-[#f1f3f8] px-1.5 py-0.5 text-xs">K</span>
        </button>
        <Sun className="size-5 text-[#697284]" />
        <Bell className="size-5 text-[#697284]" />
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#242936] font-semibold text-white text-xs">
            AK
          </div>
          <ChevronDown className="size-4 text-[#697284]" />
        </div>
      </div>
    </header>
  );
}
