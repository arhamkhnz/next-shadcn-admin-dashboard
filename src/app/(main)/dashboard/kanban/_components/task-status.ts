import { Circle, CircleCheck, CircleDashed, CircleDot, CircleEllipsis, type LucideIcon } from "lucide-react";

import type { ColumnId } from "./types";

export const statusIcons: Record<ColumnId, LucideIcon> = {
  ideas: CircleDashed,
  planned: Circle,
  building: CircleDot,
  qa: CircleEllipsis,
  shipped: CircleCheck,
};
