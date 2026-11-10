import { ChevronUp, Flame, type LucideIcon, Minus } from "lucide-react";

import type { TaskPriority } from "./types";

export const priorityBadgeConfig: Record<
  TaskPriority,
  { icon: LucideIcon; variant: "destructive" | "secondary"; className: string }
> = {
  Alta: {
    icon: Flame,
    variant: "destructive",
    className: "border-transparent",
  },
  Baixa: {
    icon: Minus,
    variant: "secondary",
    className: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  },
  Média: {
    icon: ChevronUp,
    variant: "secondary",
    className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
};
