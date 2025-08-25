import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";

/**
 * Converts an array of objects to a CSV string.
 * @param data The data to convert.
 * @param columns The columns to include in the CSV.
 * @returns A CSV string.
 */
function convertToCSV<TData>(data: TData[], columns: (keyof TData)[]): string {
  const header = columns.join(",");
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = String(row[col] ?? "");
        // Escape commas and quotes
        if (value.includes(",") ?? value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",");
  });
  return [header, ...rows].join("\n");
}

/**
 * Exports the data from a TanStack Table to a CSV file.
 * @param table The TanStack Table instance.
 * @param filename The desired filename for the downloaded CSV.
 */
export function exportToCSV<TData>(table: Table<TData>, filename: string) {
  try {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    if (!data.length) {
      toast.warning("No data to export.");
      return;
    }

    const columnKeys = table
      .getVisibleLeafColumns()
      .map((col) => col.id)
      .filter((id) => id !== "actions"); // Exclude actions column

    const csv = convertToCSV(data, columnKeys as (keyof TData)[]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data exported successfully!");
  } catch (error) {
    console.error("Failed to export data to CSV:", error);
    toast.error("Failed to export data. Please try again.");
  }
}
