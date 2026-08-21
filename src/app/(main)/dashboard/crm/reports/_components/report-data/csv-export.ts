"use client";

import { format } from "date-fns";

export type CsvCellValue = string | number | null | undefined;

function escapeCsvValue(value: CsvCellValue): string {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

export function buildCsv(headers: readonly string[], rows: readonly CsvCellValue[][]): string {
  const lines = [headers.map(escapeCsvValue).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeCsvValue).join(","));
  }
  return `\uFEFF${lines.join("\r\n")}`;
}

export function buildReportFilename(reportSlug: string, from: Date, to: Date): string {
  return `crm-${reportSlug}-report_${format(from, "yyyy-MM-dd")}_to_${format(to, "yyyy-MM-dd")}.csv`;
}

export function downloadCsvFile(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
