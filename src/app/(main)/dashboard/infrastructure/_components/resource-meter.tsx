import { cn } from "@/lib/utils";

export function ResourceMeter({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "danger";
}) {
  return (
    <span className="min-w-20">
      <span className="mb-1 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-muted-foreground">{label}</span>
        <span className="font-medium text-muted-foreground">{value}%</span>
      </span>
      <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
        <span
          className={cn("block h-full rounded-full", tone === "danger" ? "bg-destructive" : "bg-primary")}
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}
