"use client";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MailNavProps {
  isCollapsed: boolean;
  links: readonly {
    id: string;
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost" | "secondary";
  }[];
}

export function MailNav({ links, isCollapsed }: MailNavProps) {
  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2">
        {links.map((link) =>
          isCollapsed ? (
            <Tooltip key={link.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "size-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                >
                  <link.icon className="size-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={link.id}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start px-2",
              )}
            >
              <div className="flex items-center gap-1.5">
                <link.icon className="size-3.5" />
                <span className="font-medium text-xs">{link.title}</span>
              </div>
              {link.label && (
                <span className={cn("ml-auto", link.variant === "default" && "text-background dark:text-white")}>
                  {link.label}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
