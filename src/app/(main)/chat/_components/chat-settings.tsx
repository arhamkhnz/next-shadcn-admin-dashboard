"use client";

import { ChevronDown, MoreHorizontal, Sun, Upload, Zap } from "lucide-react";

import { FileIcon, SettingsSlider, sideDocuments } from "./data";

export function ChatSettings() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
      <section className="space-y-5">
        <h2 className="font-semibold text-[#2b303b]">Model</h2>
        <button className="flex w-full items-center gap-4 rounded-xl border border-[#e5e8ef] bg-white p-4 text-left">
          <div className="flex size-10 items-center justify-center rounded-full text-[#d76a3f]">
            <Sun className="size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#303642]">Claude 3.5 Sonnet</p>
            <p className="text-[#8b93a1] text-sm">Most intelligent</p>
          </div>
          <ChevronDown className="size-5 text-[#657083]" />
        </button>
      </section>

      <section className="mt-8 space-y-8">
        <SettingsSlider label="Temperature" value="w-[42%]" knobClass="left-[40%]" output="0.4" />
        <SettingsSlider label="Max Tokens" value="w-[68%]" knobClass="left-[66%]" output="4096" />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-semibold text-[#2b303b]">Memory</h2>
        <div className="rounded-xl border border-[#e5e8ef] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#303642]">Workspace Memory</p>
              <p className="text-[#7c8494] text-sm">Stores context across chats</p>
            </div>
            <span className="flex h-6 w-11 items-center rounded-full bg-[#6157ed] p-1">
              <span className="ml-auto size-4 rounded-full bg-white" />
            </span>
          </div>
          <button className="mt-5 flex items-center gap-2 font-semibold text-[#6157ed]">
            View memory
            <ChevronDown className="size-4 -rotate-90" />
          </button>
          <div className="my-5 h-px bg-[#eceff5]" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#303642]">Chat Memory</p>
              <p className="text-[#7c8494] text-sm">Uses context in this chat only</p>
            </div>
            <span className="flex h-6 w-11 items-center rounded-full bg-[#d9dde6] p-1">
              <span className="size-4 rounded-full bg-white" />
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-[#2b303b]">Attached Documents</h2>
          <button className="flex items-center gap-2 rounded-lg bg-[#f1efff] px-3 py-2 font-semibold text-[#6157ed] text-sm">
            <Upload className="size-4" />
            Upload
          </button>
        </div>
        <div className="rounded-xl border border-[#e5e8ef] bg-white p-2">
          {sideDocuments.map((file) => (
            <div key={file.name} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#f7f8fb]">
              <FileIcon type={file.type} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#303642] text-sm">{file.name}</p>
                <p className="text-[#7c8494] text-xs">{file.detail}</p>
              </div>
              <MoreHorizontal className="size-5 text-[#858d9b]" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-[#f1efff] p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-[#303642]">
          <Zap className="size-5 text-[#e0a522]" />
          Tips
        </div>
        <p className="text-[#424a58] text-sm leading-6">
          Upload relevant documents or add context to get more accurate and tailored responses.
        </p>
        <button className="mt-5 flex items-center gap-2 font-semibold text-[#6157ed] text-sm">
          Learn more about best practices
          <ChevronDown className="size-4 -rotate-90" />
        </button>
      </section>
    </div>
  );
}
