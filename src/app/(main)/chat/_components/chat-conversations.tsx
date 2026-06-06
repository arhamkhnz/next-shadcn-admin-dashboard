"use client";

import { Filter, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import type { Conversation } from "./data";
import { useChat } from "./use-chat";

interface ChatConversationsProps {
  conversations: Conversation[];
  onSelectConversation?: (conversation: Conversation) => void;
}

const tabs = [
  { id: "all", label: "All", count: 24 },
  { id: "open", label: "Open", count: 18 },
  { id: "snoozed", label: "Snoozed", count: 2 },
  { id: "closed", label: "Closed" },
];

export function ChatConversations({ conversations, onSelectConversation }: ChatConversationsProps) {
  const [chat, setChat] = useChat();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-4 px-2">
        <h1 className="font-medium text-xl leading-none">Inbox</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <Filter />
          </Button>
        </div>
      </div>

      <div className="px-2">
        <Separator />
      </div>

      <div className="px-2">
        <InputGroup className="h-7 w-full rounded-md">
          <InputGroupInput className="h-7" placeholder="Search conversations..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex gap-1 px-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
              index === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.count && <span className="ml-1.5 text-xs opacity-70">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-1 pt-0">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={cn(
                  "group relative w-full border-transparent border-y p-3 text-left transition-colors",
                  "hover:bg-muted/60",
                  chat.selected === conversation.id &&
                    "border-border bg-muted/70 before:absolute before:-inset-y-px before:left-0 before:w-0.5 before:bg-primary",
                )}
                onClick={(event) => {
                  event.currentTarget.blur();
                  setChat({ selected: conversation.id });
                  onSelectConversation?.(conversation);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-background text-xs">
                        {getInitials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-sm">{conversation.name}</span>
                          {conversation.isUnread && <span className="size-2 shrink-0 rounded-full bg-blue-600" />}
                        </div>
                        <div
                          className={cn(
                            "truncate font-medium text-sm",
                            conversation.isUnread ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {conversation.subject}
                        </div>
                      </div>
                      <span className="shrink-0 text-muted-foreground text-xs">{conversation.time}</span>
                    </div>
                    <p className="truncate text-muted-foreground text-xs">{conversation.preview}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
