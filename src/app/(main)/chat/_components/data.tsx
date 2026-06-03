import type { LucideIcon } from "lucide-react";
import { Copy, FileSpreadsheet, FileText, Sparkles } from "lucide-react";

export const chatHistory = [
  {
    id: "1",
    title: "Q2 Sales Analysis",
    description: "Analyzed sales data and trends",
    time: "10:24 AM",
  },
  { id: "2", title: "Marketing Campaign Ideas", description: "Brainstormed campaign concepts", time: "Yesterday" },
  { id: "3", title: "Customer Segmentation", description: "Segmented users by behavior", time: "May 22" },
  { id: "4", title: "Pricing Strategy Review", description: "Reviewed pricing models", time: "May 21" },
  { id: "5", title: "Product Roadmap Planning", description: "Outlined roadmap priorities", time: "May 20" },
] as const;

export type ChatHistoryItem = (typeof chatHistory)[number];

export const savedPrompts = [
  "Data Analysis Template",
  "SEO Content Brief Generator",
  "Market Research Summary",
  "SWOT Analysis Framework",
  "Blog Post Outline",
] as const;

export const salesRows = [
  ["April", "$760,240", "+18.7%", "+22.1%"],
  ["May", "$865,420", "+13.8%", "+31.4%"],
  ["June", "$824,340", "-4.7%", "+18.2%"],
  ["Total", "$2,449,100", "+28.6%", "+23.9%"],
] as const;

export const attachedFiles = [
  { name: "Sales_Q2_2024.csv", detail: "24.6 KB", type: "sheet" as const },
  { name: "Q2_Sales_Report.pdf", detail: "1.2 MB", type: "pdf" as const },
] as const;

export const sideDocuments = [
  { name: "Q2 Sales Report.pdf", detail: "1.2 MB", type: "pdf" as const },
  { name: "Sales Data Dictionary.pdf", detail: "890 KB", type: "pdf" as const },
  { name: "Product Catalog.csv", detail: "532 KB", type: "sheet" as const },
] as const;

export const suggestions = ["Visualize this data", "Compare to Q1", "Show by region", "What drove growth?"] as const;

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-[#6157ed] text-white ${className}`}>
      <Sparkles className="size-5" />
    </div>
  );
}

export function MiniIconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      className="flex size-10 items-center justify-center rounded-lg border border-[#e4e7f0] bg-white text-[#626a7a]"
      aria-label={label}
    >
      <Icon className="size-5" />
    </button>
  );
}

export function FileIcon({ type }: { type: "pdf" | "sheet" }) {
  return (
    <div
      className={`flex size-9 items-center justify-center rounded-lg ${type === "sheet" ? "bg-[#edf9ef] text-[#21a95a]" : "bg-[#fff0ef] text-[#f0645d]"}`}
    >
      {type === "sheet" ? <FileSpreadsheet className="size-5" /> : <FileText className="size-5" />}
    </div>
  );
}

export function SettingsSlider({
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

export function CodeBlock() {
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
