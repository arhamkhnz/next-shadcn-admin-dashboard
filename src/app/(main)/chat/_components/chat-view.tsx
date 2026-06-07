"use client";

import { Archive, Copy, Flag, MoreHorizontal, PhoneCall, Tag, UserRound } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";

import { agentName, type Contact, type Message } from "./data";

interface ChatViewProps {
  contact: Contact;
  messages: Message[];
  onOpenContact?: () => void;
}

export function ChatView({ contact, messages, onOpenContact }: ChatViewProps) {
  return (
    <div className="flex h-full flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-background">{getInitials(contact.name)}</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <div>
            <div className="font-medium text-sm">{contact.name}</div>
            <div className="text-muted-foreground text-xs leading-3">Sustainability Manager</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Call">
                <PhoneCall />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Call</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Tag">
                <Tag />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tag</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Archive">
                <Archive />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={onOpenContact}>
                  <UserRound />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy />
                  Copy email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag />
                  Mark priority
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">Block contact</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 py-4">
          <div className="flex justify-center">
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground text-xs">May 6, 2026</span>
          </div>

          {messages.map((message) => {
            const isOutbound = message.side === "out";
            const senderName = isOutbound ? agentName : contact.name;

            return (
              <div key={message.id} className={cn("flex items-end gap-3", isOutbound && "flex-row-reverse")}>
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="bg-background text-xs">{getInitials(senderName)}</AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "max-w-md rounded-2xl px-4 py-3 text-sm",
                    isOutbound ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  <div className={cn("mt-2 text-xs opacity-70", isOutbound && "text-right")}>{message.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button type="button" className="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary text-sm">
            Reply
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 font-medium text-muted-foreground text-sm hover:bg-muted"
          >
            Internal note
          </button>
        </div>
        <div className="flex items-end gap-2 rounded-lg border bg-muted/30 p-3">
          <textarea
            placeholder="Type your message..."
            className="min-h-[60px] flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <Button size="sm">Send</Button>
        </div>
      </div>
    </div>
  );
}
