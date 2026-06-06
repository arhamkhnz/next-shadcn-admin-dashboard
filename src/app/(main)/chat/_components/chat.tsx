"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { ChatContact } from "./chat-contact";
import { ChatConversations } from "./chat-conversations";
import { ChatView } from "./chat-view";
import type { Contact, Conversation, Message } from "./data";

interface ChatProps {
  conversations: Conversation[];
  contact: Contact;
  messages: Message[];
}

export function Chat({ conversations, contact, messages }: ChatProps) {
  const [showContact, setShowContact] = useState(true);

  return (
    <div
      className="grid h-[calc(100svh-var(--header-height))] min-h-0 min-w-0 flex-1 overflow-hidden shadow-sm transition-[grid-template-columns] duration-300 ease-out"
      style={{
        gridTemplateColumns: showContact ? "22.5rem minmax(0, 1fr) 20rem" : "22.5rem minmax(0, 1fr) 0rem",
      }}
    >
      <div className="min-h-0 border-r">
        <ChatConversations conversations={conversations} />
      </div>
      <div className="min-h-0 min-w-0">
        <ChatView
          contact={contact}
          messages={messages}
          isContactOpen={showContact}
          onToggleContact={() => setShowContact((value) => !value)}
        />
      </div>
      <div
        aria-hidden={!showContact}
        className={cn(
          "min-h-0 min-w-0 overflow-hidden border-l transition-colors duration-300",
          !showContact && "pointer-events-none border-l-transparent",
        )}
      >
        <div
          className={cn(
            "h-full w-80 transition-[opacity,transform] duration-300 ease-out",
            showContact ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
          )}
        >
          <ChatContact contact={contact} />
        </div>
      </div>
    </div>
  );
}
