import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bot,
  CheckCircle2,
  ChevronDown,
  Copy,
  FileSpreadsheet,
  FileText,
  Globe2,
  Menu,
  Mic,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Upload,
  Zap,
} from "lucide-react";

const chatHistory = [
  { title: "Q2 Sales Analysis", description: "Analyzed sales data and trends", time: "10:24 AM", active: true },
  { title: "Marketing Campaign Ideas", description: "Brainstormed campaign concepts", time: "Yesterday" },
  { title: "Customer Segmentation", description: "Segmented users by behavior", time: "May 22" },
  { title: "Pricing Strategy Review", description: "Reviewed pricing models", time: "May 21" },
  { title: "Product Roadmap Planning", description: "Outlined roadmap priorities", time: "May 20" },
] as const;

const savedPrompts = [
  "Data Analysis Template",
  "SEO Content Brief Generator",
  "Market Research Summary",
  "SWOT Analysis Framework",
  "Blog Post Outline",
] as const;

const salesRows = [
  ["April", "$760,240", "+18.7%", "+22.1%"],
  ["May", "$865,420", "+13.8%", "+31.4%"],
  ["June", "$824,340", "-4.7%", "+18.2%"],
  ["Total", "$2,449,100", "+28.6%", "+23.9%"],
] as const;

const attachedFiles = [
  { name: "Sales_Q2_2024.csv", detail: "24.6 KB", type: "sheet" },
  { name: "Q2_Sales_Report.pdf", detail: "1.2 MB", type: "pdf" },
] as const;

const sideDocuments = [
  { name: "Q2 Sales Report.pdf", detail: "1.2 MB", type: "pdf" },
  { name: "Sales Data Dictionary.pdf", detail: "890 KB", type: "pdf" },
  { name: "Product Catalog.csv", detail: "532 KB", type: "sheet" },
] as const;

const suggestions = ["Visualize this data", "Compare to Q1", "Show by region", "What drove growth?"] as const;

function MiniIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      className="flex size-10 items-center justify-center rounded-lg border border-[#e4e7f0] bg-white text-[#626a7a]"
      aria-label={label}
    >
      <Icon className="size-5" />
    </button>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-[#6157ed] text-white ${className}`}>
      <Sparkles className="size-5" />
    </div>
  );
}

function FileIcon({ type }: { type: "pdf" | "sheet" }) {
  return (
    <div
      className={`flex size-9 items-center justify-center rounded-lg ${type === "sheet" ? "bg-[#edf9ef] text-[#21a95a]" : "bg-[#fff0ef] text-[#f0645d]"}`}
    >
      {type === "sheet" ? <FileSpreadsheet className="size-5" /> : <FileText className="size-5" />}
    </div>
  );
}

function PromptRow({ prompt }: { prompt: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[#596172] text-sm hover:bg-[#f6f7fb]">
      <FileText className="size-4 shrink-0 text-[#8790a3]" />
      <span className="truncate">{prompt}</span>
    </button>
  );
}

function SettingsSlider({
  label,
  value,
  knobClass,
  output,
}: {
  label: string;
  value: string;
  knobClass: string;
  output: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#2b303b]">{label}</span>
        <span className="rounded-lg border border-[#e4e7ef] bg-white px-4 py-2 font-medium text-[#4e5667] text-sm">
          {output}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-[#e3e6ee]">
        <div className={`absolute inset-y-0 left-0 rounded-full bg-[#6157ed] ${value}`} />
        <span
          className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-[#6157ed] shadow-[0_1px_4px_rgba(97,87,237,0.4)] ${knobClass}`}
        />
      </div>
      <div className="flex justify-between text-[#8c94a3] text-xs">
        <span>Focused</span>
        <span>Creative</span>
      </div>
    </div>
  );
}

function CodeBlock() {
  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-[#171c25] text-[#c8d2e1] text-sm shadow-[0_2px_8px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between px-4 py-3 text-[#dce5f2] text-xs">
        <span>SQL</span>
        <button className="flex items-center gap-2 font-semibold">
          <Copy className="size-4" />
          Copy code
        </button>
      </div>
      <pre className="overflow-x-auto px-4 pb-4 font-mono text-[13px] leading-6">
        <code>{`SELECT
  DATE_TRUNC('month', order_date) AS month,
  SUM(sales) AS total_sales
FROM sales
WHERE order_date BETWEEN '2024-04-01' AND '2024-06-30'
GROUP BY 1
ORDER BY 1;`}</code>
      </pre>
    </div>
  );
}

function Composer() {
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

export default function TestChatTwoPage() {
  return (
    <main className="h-dvh min-h-[760px] overflow-hidden bg-[#fafbff] text-[#242936]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(720px,1fr)_360px]">
        <aside className="hidden min-w-0 flex-col border-[#e6e9f1] border-r bg-white lg:flex">
          <div className="flex h-24 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <BrandMark className="size-11" />
              <span className="font-semibold text-[#242936] text-xl">Aurelia AI</span>
            </div>
            <MiniIconButton icon={PanelLeft} label="Collapse sidebar" />
          </div>

          <div className="px-5">
            <button className="flex h-12 w-full items-center justify-between rounded-lg bg-[#6157ed] px-4 font-semibold text-white shadow-[0_3px_9px_rgba(97,87,237,0.22)]">
              <span className="flex items-center gap-3">
                <Plus className="size-5" />
                New Chat
              </span>
              <span className="rounded-md bg-white/10 px-2 py-1 text-xs">N</span>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-base">Chat History</h2>
              <Plus className="size-5 text-[#6a7282]" />
            </div>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat.title}
                  className={`w-full rounded-lg px-3 py-3 text-left ${"active" in chat && chat.active ? "bg-[#f0efff]" : "hover:bg-[#f7f8fb]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold text-[#2b303b] text-sm">{chat.title}</p>
                    <span className="shrink-0 text-[#7b8493] text-sm">{chat.time}</span>
                  </div>
                  <p className="mt-1 truncate text-[#6c7483] text-sm">{chat.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-10 mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-base">Saved Prompts</h2>
              <Plus className="size-5 text-[#6a7282]" />
            </div>
            <div className="space-y-1">
              {savedPrompts.map((prompt) => (
                <PromptRow key={prompt} prompt={prompt} />
              ))}
            </div>
            <button className="mt-4 flex items-center gap-2 px-2 text-[#6c7483] text-sm">
              View all saved prompts
              <ChevronDown className="size-4 -rotate-90" />
            </button>
          </div>

          <div className="border-[#edf0f5] border-t p-6">
            <div className="rounded-xl border border-[#e4e7ef] bg-white p-5">
              <div className="flex items-center gap-3">
                <BrandMark className="size-9" />
                <span className="font-semibold">Team Plan</span>
              </div>
              <div className="my-4 h-px bg-[#edf0f5]" />
              <p className="mb-3 text-[#667085] text-sm">8 of 20K messages used</p>
              <div className="h-1.5 rounded-full bg-[#e5e8f0]">
                <div className="h-full w-[28%] rounded-full bg-[#6157ed]" />
              </div>
              <button className="mt-5 h-11 w-full rounded-lg border border-[#e2e6ef] font-medium text-[#4f5868] text-sm">
                Manage Plan
              </button>
            </div>
            <button className="mt-7 flex items-center gap-2 text-[#6f7787] text-sm">
              <Plus className="size-4" />
              Invite members
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col bg-white">
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
                                    className={
                                      index > 1 ? (cell.startsWith("-") ? "text-[#e65c5a]" : "text-[#3aa56b]") : ""
                                    }
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
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className="flex h-12 items-center gap-3 rounded-lg border border-[#e3e7f0] bg-white px-4 font-semibold text-[#404756] text-sm"
                  >
                    {[SlidersHorizontal, FileText, Menu, Zap][index] &&
                      (() => {
                        const Icon = [SlidersHorizontal, FileText, Menu, Zap][index];
                        return <Icon className="size-5 text-[#6157ed]" />;
                      })()}
                    {suggestion}
                  </button>
                ))}
                <MiniIconButton icon={Sparkles} label="Refresh" />
              </div>
            </div>
          </div>

          <Composer />
        </section>

        <aside className="hidden min-w-0 flex-col border-[#e7eaf1] border-l bg-white xl:flex">
          <div className="flex h-20 items-center justify-center border-[#e7eaf1] border-b px-6">
            <div className="grid w-full grid-cols-2 text-center font-semibold">
              <button className="border-[#6157ed] border-b-2 py-5 text-[#6157ed]">Settings</button>
              <button className="py-5 text-[#444b58]">Utilities</button>
            </div>
          </div>

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
