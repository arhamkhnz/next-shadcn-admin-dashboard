"use client";

import { Bot } from "lucide-react";

import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatSettings } from "./chat-settings";

export function ChatComponent() {
  return (
    <main className="h-full min-h-0 overflow-hidden bg-[#fafbff] text-[#242936]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr] xl:grid-cols-[minmax(720px,1fr)_360px]">
        <section className="flex min-w-0 flex-col bg-white">
          <ChatHeader />
          <ChatMessages />
          <ChatComposer />
        </section>

        <aside className="hidden min-w-0 flex-col border-[#e7eaf1] border-l bg-white xl:flex">
          <div className="flex h-20 items-center justify-center border-[#e7eaf1] border-b px-6">
            <div className="grid w-full grid-cols-2 text-center font-semibold">
              <button className="border-[#6157ed] border-b-2 py-5 text-[#6157ed]">Settings</button>
              <button className="py-5 text-[#444b58]">Utilities</button>
            </div>
          </div>

          <ChatSettings />

          <div className="border-[#eceff5] border-t px-6 py-5">
            <button className="flex items-center gap-3 text-[#7c8494] text-sm">
              <Bot className="size-5" />
              Provide feedback
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
