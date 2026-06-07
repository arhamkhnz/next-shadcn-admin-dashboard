"use client";

import { ChevronDown, Filter, PanelRightClose, PanelRightOpen, Pin } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getInitials } from "@/lib/utils";

import type { Conversation } from "./data";
import { useChat } from "./use-chat";

interface ChatConversationsProps {
  conversations: Conversation[];
  onSelectConversation?: (conversation: Conversation) => void;
}

export function ChatConversations({ conversations, onSelectConversation }: ChatConversationsProps) {
  const [chat, setChat] = useChat();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const conversationGroups = conversations.reduce<
    Array<{ group: Conversation["group"]; conversations: Conversation[] }>
  >((groups, conversation) => {
    const group = groups.find((item) => item.group === conversation.group);
    if (group) {
      group.conversations.push(conversation);
    } else {
      groups.push({ group: conversation.group, conversations: [conversation] });
    }
    return groups;
  }, []);

  return (
    <div className="flex h-full flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-4 px-2 py-0.5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="[&_svg]:transition-transform [&_svg]:duration-300"
          >
            {isCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
          <Separator orientation="vertical" className="mr-1.5 h-4 data-vertical:self-center" />
          <h1 className="font-medium text-xl leading-none">Inbox</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <Filter />
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="all">
        <TabsList variant="line" className="w-full border-b px-0 **:data-[slot=tabs-trigger]:border-x-0">
          <TabsTrigger value="all">
            All
            <span className="text-muted-foreground text-xs">(24)</span>
          </TabsTrigger>
          <TabsTrigger value="open">
            Open
            <span className="text-muted-foreground text-xs">(18)</span>
          </TabsTrigger>
          <TabsTrigger value="snoozed">
            Snoozed
            <span className="text-muted-foreground text-xs">(2)</span>
          </TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea
          type="hover"
          className="h-full min-h-0 flex-1 overflow-hidden [&_[data-orientation=vertical][data-slot=scroll-area-scrollbar]]:w-1.5"
        >
          <div className="flex flex-col gap-3 pt-0">
            {conversationGroups.map(({ group, conversations }) => (
              <Collapsible key={group} defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-1 px-3 py-2 font-medium text-muted-foreground text-xs hover:text-foreground [&[data-state=open]>svg]:rotate-180">
                  {group}
                  <ChevronDown className="size-3 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-1 px-2">
                    {conversations.map((conversation) => {
                      const isSelected = chat.selected === conversation.id;

                      return (
                        <button
                          key={conversation.id}
                          type="button"
                          className={cn(
                            "w-full overflow-hidden rounded-lg px-2.5 py-2.5 text-left ring-inset transition-colors",
                            isSelected ? "bg-muted ring-1 ring-border" : "hover:bg-muted/75",
                          )}
                          onClick={(event) => {
                            event.currentTarget.blur();
                            setChat({ selected: conversation.id });
                            onSelectConversation?.(conversation);
                          }}
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <Avatar className="shrink-0 **:data-[slot=avatar-badge]:size-2">
                              <AvatarFallback
                                className={cn(
                                  "text-foreground text-xs transition-colors duration-400",
                                  isSelected && "bg-background/50",
                                )}
                              >
                                {getInitials(conversation.name)}
                              </AvatarFallback>
                              {conversation.isOnline && <AvatarBadge className="bg-green-600 dark:bg-green-800" />}
                            </Avatar>

                            <div className="w-0 flex-1 overflow-hidden">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div className="truncate font-medium text-sm leading-5">{conversation.name}</div>
                                <span className="text-nowrap text-muted-foreground text-xs leading-5">
                                  {conversation.time}
                                </span>
                              </div>
                              <div className="flex min-w-0 items-end gap-2">
                                <div className="w-0 flex-1 overflow-hidden">
                                  <div className="truncate font-medium text-foreground/90 text-xs leading-4">
                                    {conversation.subject}
                                  </div>
                                  <div className="truncate text-muted-foreground text-xs leading-4">
                                    {conversation.preview}
                                  </div>
                                </div>

                                {conversation.group === "Pinned" && (
                                  <div className="grid size-5 place-items-center">
                                    <Pin className="size-3 fill-current opacity-70" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
