import { Check, Minus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { AccessLevel, PermissionState } from "./roles-data";

const avatarColors = [
  "bg-orange-500/15 text-orange-700 dark:bg-orange-400/15 dark:text-orange-200",
  "bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200",
  "bg-pink-500/15 text-pink-700 dark:bg-pink-400/15 dark:text-pink-200",
  "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
];

export function MemberStack({ members, hidden }: { members: string[]; hidden: number }) {
  return (
    <AvatarGroup>
      {members.map((member, index) => (
        <Avatar key={member} size="sm">
          <AvatarFallback className={avatarColors[index % avatarColors.length]}>{member}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount className="size-6 text-xs">+{hidden}</AvatarGroupCount>
    </AvatarGroup>
  );
}

export function AccessBadge({ level }: { level: AccessLevel }) {
  return (
    <Badge
      className={cn(
        "w-fit rounded-md border px-2",
        level === "Full Access" && "border-primary/30 bg-primary/10 text-primary",
        level === "High" && "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        level === "Medium" && "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        level === "Low" && "border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300",
      )}
      variant="outline"
    >
      {level}
    </Badge>
  );
}

export function PermissionStatus({ status, size = "default" }: { status: PermissionState; size?: "default" | "sm" }) {
  const Icon = status === "granted" ? Check : Minus;

  return (
    <span
      title={status}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        size === "default" ? "size-7" : "size-4",
        status === "granted" && "bg-green-500/20 text-green-700 dark:bg-green-500/25 dark:text-green-300",
        status === "partial" && "bg-primary/20 text-primary",
        status === "none" && "bg-muted text-muted-foreground",
      )}
    >
      <Icon className={size === "default" ? "size-4" : "size-3"} />
    </span>
  );
}
