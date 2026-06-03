"use client";

import { CheckCircle2, FileText, Menu, Plus, SlidersHorizontal, Sparkles, Zap } from "lucide-react";

import { attachedFiles, BrandMark, CodeBlock, FileIcon, MiniIconButton, salesRows, suggestions } from "./data";

export function ChatMessages() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="ml-auto flex max-w-3xl items-center gap-4 rounded-xl bg-[#f1efff] px-4 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#242936] font-semibold text-white text-xs">
            AK
          </div>
          <p className="min-w-0 flex-1 font-medium text-[#303642]">
            Can you analyze our Q2 sales data and show key insights?
          </p>
          <span className="text-[#7c8494] text-sm">10:24 AM</span>
          <CheckCircle2 className="size-4 text-[#6157ed]" />
        </div>

        <div className="flex gap-5">
          <BrandMark className="mt-1 size-12 shrink-0 bg-white text-[#6157ed] ring-1 ring-[#e4e7f0]" />
          <article className="min-w-0 flex-1 pt-3">
            <p className="mb-5 text-[#2f3542]">
              Certainly! I've analyzed your Q2 sales data. Here are the key insights:
            </p>

            <div className="space-y-4">
              <section>
                <h2 className="mb-2 font-semibold text-[#2b303b] text-lg">Q2 Sales Overview</h2>
                <p className="text-[#343b49] leading-7">
                  Total sales for Q2 reached $2.45M, a 28.6% increase compared to Q1.
                  <br />
                  April and May showed strong growth, while June saw a slight dip.
                </p>
              </section>

              <div className="overflow-hidden rounded-lg border border-[#dfe4ec]">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#fbfcfe] text-left text-[#3a414f]">
                    <tr>
                      {["Month", "Sales (USD)", "vs Previous Month", "vs Q1 Average"].map((heading) => (
                        <th
                          key={heading}
                          className="border-[#e5e8ef] border-r border-b px-4 py-3 font-semibold last:border-r-0"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salesRows.map((row) => (
                      <tr key={row[0]} className="last:font-semibold">
                        {row.map((cell, index) => (
                          <td
                            key={`${row[0]}-${cell}`}
                            className="border-[#e5e8ef] border-r border-b px-4 py-3 last:border-r-0 last:border-b-0"
                          >
                            <span
                              className={index > 1 ? (cell.startsWith("-") ? "text-[#e65c5a]" : "text-[#3aa56b]") : ""}
                            >
                              {cell}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <section>
                <h3 className="mb-2 font-semibold text-[#2b303b] text-lg">Top Performing Products</h3>
                <ul className="list-disc space-y-1 pl-5 text-[#343b49]">
                  <li>Product A: $678K (27.7% of total sales)</li>
                  <li>Product B: $512K (20.9% of total sales)</li>
                  <li>Product C: $421K (17.2% of total sales)</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 font-semibold text-[#2b303b]">Sales Trend</h3>
                <p className="text-[#343b49]">The overall trend shows consistent growth with a peak in May.</p>
                <CodeBlock />
              </section>
            </div>
          </article>
        </div>

        <div className="ml-19 grid gap-0 overflow-hidden rounded-xl border border-[#d9deea] border-dashed md:grid-cols-3">
          {attachedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-4 border-[#d9deea] border-b border-dashed bg-white p-4 last:border-r-0 md:border-r md:border-b-0"
            >
              <FileIcon type={file.type} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[#303642]">{file.name}</p>
                <p className="text-[#7c8494] text-sm">{file.detail}</p>
              </div>
              <CheckCircle2 className="size-5 shrink-0 text-[#65ba77]" />
            </div>
          ))}
          <button className="flex items-center justify-center gap-3 p-4 text-[#6157ed]">
            <Plus className="size-5" />
            <span className="font-semibold">Add file</span>
            <span className="text-[#8d95a4] text-xs">Max 20MB per file</span>
          </button>
        </div>

        <div className="ml-19 flex flex-wrap items-center gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = [SlidersHorizontal, FileText, Menu, Zap][index];
            return (
              <button
                key={suggestion}
                className="flex h-12 items-center gap-3 rounded-lg border border-[#e3e7f0] bg-white px-4 font-semibold text-[#404756] text-sm"
              >
                {Icon && <Icon className="size-5 text-[#6157ed]" />}
                {suggestion}
              </button>
            );
          })}
          <MiniIconButton icon={Sparkles} label="Refresh" />
        </div>
      </div>
    </div>
  );
}
