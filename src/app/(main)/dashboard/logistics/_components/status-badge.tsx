import { Badge } from "@/components/ui/badge";

import type { ShipmentStatus } from "./data";

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <Badge variant={status === "Delayed" ? "destructive" : "secondary"} className="rounded-full">
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}
