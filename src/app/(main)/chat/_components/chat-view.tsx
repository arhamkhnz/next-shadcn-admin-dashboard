"use client";

import { CheckCircle2, Clock3, MoreHorizontal, PanelRight, Tag, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";

import { agentName, type Contact, type Message } from "./data";

interface ChatViewProps {
  contact: Contact;
  messages: Message[];
  isContactOpen?: boolean;
  onToggleContact?: () => void;
}

export function ChatView({ contact, messages, isContactOpen = true, onToggleContact }: ChatViewProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-2 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarFallback className="bg-background">{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
          </div>
          <div>
            <div className="font-semibold text-sm">{contact.name}</div>
            <div className="text-muted-foreground text-xs">Active · Lead</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {[
            { icon: Users, label: "Assign" },
            { icon: Clock3, label: "Snooze" },
            { icon: Tag, label: "Tag" },
            { icon: CheckCircle2, label: "Resolve" },
            { icon: MoreHorizontal, label: "More" },
          ].map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={label}>
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isContactOpen ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label={isContactOpen ? "Hide profile" : "Show profile"}
                onClick={onToggleContact}
              >
                <PanelRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isContactOpen ? "Hide profile" : "Show profile"}</TooltipContent>
          </Tooltip>
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
