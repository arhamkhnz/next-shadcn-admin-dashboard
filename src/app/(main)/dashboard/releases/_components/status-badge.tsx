import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  if (status === "live") {
    return (
      <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
        Live
      </Badge>
    );
  }

  if (status === "upcoming") {
    return (
      <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400">
        Upcoming
      </Badge>
    );
  }

  return <Badge variant="secondary">{status}</Badge>;
}
