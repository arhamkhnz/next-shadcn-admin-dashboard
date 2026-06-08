"use client";

import {
  AlarmClock,
  ArrowLeft,
  Copy,
  Flag,
  Link,
  MoreHorizontal,
  Paperclip,
  PhoneCall,
  Send,
  Smile,
  Sparkles,
  Tag,
  Type,
  UserRound,
} from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";

import { type Contact, currentUser, type Message } from "./data";

interface ChatThreadProps {
  contact: Contact;
  messages: Message[];
  onOpenContact?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function ChatThread({ contact, messages, onOpenContact, onBack, showBackButton, className }: ChatThreadProps) {
  return (
    <div className={cn("flex h-full flex-col py-3", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Back to conversations"
                onClick={onBack}
              >
                <ArrowLeft />
              </Button>
            )}
            <Avatar className="size-8">
              <AvatarFallback className="bg-background text-foreground">{getInitials(contact.name)}</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
            <div>
              <div className="font-medium text-sm">{contact.name}</div>
              <div className="text-muted-foreground text-xs leading-3">{contact.role}</div>
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
                <Button variant="ghost" size="icon-sm" aria-label="Snooze">
                  <AlarmClock />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Snooze</TooltipContent>
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
      </div>

      <ScrollArea
        type="hover"
        className="min-h-0 flex-1 [&_[data-orientation=vertical][data-slot=scroll-area-scrollbar]]:w-1.5"
      >
        <div className="flex flex-col gap-6 px-2 py-8">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground text-xs">May 6, 2026</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {messages.map((message) => {
            const isOutbound = message.side === "out";
            const senderName = isOutbound ? currentUser.name : contact.name;

            return (
              <div key={message.id} className={cn("flex items-end gap-2", isOutbound && "flex-row-reverse")}>
                <Avatar className="shrink-0">
                  <AvatarFallback
                    className={cn(
                      "bg-muted text-foreground text-xs",
                      isOutbound && "bg-primary text-primary-foreground",
                    )}
                  >
                    {getInitials(senderName)}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "flex max-w-md flex-col gap-2 rounded-xl px-4 py-3 text-sm",
                    isOutbound ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  <div
                    className={cn(
                      "text-muted-foreground/75 text-xs",
                      isOutbound && "text-right text-primary-foreground/75",
                    )}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-2">
        <Tabs defaultValue="reply" className="rounded-md border">
          <TabsList
            variant="line"
            className="w-full justify-start gap-2 border-b px-3 **:data-[slot=tabs-trigger]:border-x-0 **:data-[slot=tabs-trigger]:px-6 group-data-horizontal/tabs:h-10"
          >
            <TabsTrigger value="reply" className="flex-none px-1">
              Reply
            </TabsTrigger>
            <TabsTrigger value="note" className="flex-none px-1">
              Internal note
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reply" className="m-0">
            <MessageComposer placeholder="Type your message..." />
          </TabsContent>
          <TabsContent value="note" className="m-0">
            <MessageComposer placeholder="Write an internal note..." />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MessageComposer({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex flex-col gap-4 px-3 pb-2">
      <Textarea placeholder={placeholder} className="border-0 px-0 py-0.5 text-sm shadow-none focus-visible:ring-0" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Format">
            <Type />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Emoji">
            <Smile />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Attach file">
            <Paperclip />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Insert link">
            <Link />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="AI assist">
            <Sparkles />
          </Button>
        </div>

        <Button size="icon-sm">
          <Send />
        </Button>
      </div>
    </div>
  );
}
