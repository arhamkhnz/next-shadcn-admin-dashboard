"use client";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
                <Button asChild variant={link.variant} size="icon-sm">
                  <Link href="#">
                    <link.icon />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && <span className="ml-auto">{link.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              key={link.id}
              asChild
              variant={link.variant}
              size="sm"
              className="justify-start gap-1.5 px-2 text-xs"
            >
              <Link href="#">
                <link.icon />
                {link.title}
                {link.label && (
                  <span className={cn("ml-auto", link.variant === "default" && "text-background dark:text-white")}>
                    {link.label}
                  </span>
                )}
              </Link>
            </Button>
          ),
        )}
      </nav>
    </div>
  );
}
