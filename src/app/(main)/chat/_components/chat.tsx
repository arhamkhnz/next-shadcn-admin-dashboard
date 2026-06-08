"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { ChatConversationList } from "./chat-conversation-list";
import { ChatProfileDetails } from "./chat-profile-details";
import { ChatThread } from "./chat-thread";
import type { Conversation } from "./data";
import { useChat } from "./use-chat";

interface ChatProps {
  conversations: Conversation[];
}

export function Chat({ conversations }: ChatProps) {
  const [chat] = useChat();
  const [showContact, setShowContact] = useState(true);

  const activeConversation = conversations.find((c) => c.id === chat.selected) ?? conversations[0];

  return (
    <div
      className="grid h-[calc(100svh-var(--header-height))] min-h-0 min-w-0 flex-1 overflow-hidden shadow-sm transition-[grid-template-columns] duration-300 ease-out *:min-h-0 *:min-w-0 *:first:border-r"
      style={{
        gridTemplateColumns: showContact ? "22.5rem minmax(0, 1fr) 20rem" : "22.5rem minmax(0, 1fr) 0rem",
      }}
    >
      <ChatConversationList conversations={conversations} />
      <ChatThread
        contact={activeConversation.contact}
        messages={activeConversation.messages}
        onOpenContact={() => setShowContact(true)}
      />
      <div
        aria-hidden={!showContact}
        className={cn(
          "overflow-hidden border-l transition-colors duration-300",
          !showContact && "pointer-events-none border-l-transparent",
        )}
      >
        <div
          className={cn(
            "h-full w-80 transition-[opacity,transform] duration-300 ease-out",
            showContact ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
          )}
        >
          <ChatProfileDetails contact={activeConversation.contact} onClose={() => setShowContact(false)} />
        </div>
      </div>
    </div>
  );
}
