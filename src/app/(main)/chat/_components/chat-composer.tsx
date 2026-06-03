"use client";

import { ChevronDown, Globe2, Mic, Plus, Send, SlidersHorizontal } from "lucide-react";

import { MiniIconButton } from "./data";

export function ChatComposer() {
  return (
    <div className="border-[#eceff5] border-t bg-white px-6 pt-5 pb-4">
      <div className="rounded-2xl border border-[#dfe4f4] bg-white p-4 shadow-[0_1px_5px_rgba(37,43,61,0.06)]">
        <div className="mb-6 text-[#a1a8b5] text-lg">Message Aurelia AI...</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[#606878]">
            <MiniIconButton icon={Plus} label="Add" />
            <Globe2 className="size-5" />
            <button className="flex items-center gap-2 font-medium text-sm">
              <SlidersHorizontal className="size-5" />
              Tools
              <ChevronDown className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Mic className="size-5 text-[#606878]" />
            <button className="flex size-11 items-center justify-center rounded-lg bg-[#6157ed] text-white shadow-[0_4px_10px_rgba(97,87,237,0.3)]">
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[#9aa2af] text-xs">
        Aurelia AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
}
