"use client";

import { type CSSProperties, useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useIsLg } from "@/hooks/use-lg";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [showContact, setShowContact] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const isLg = useIsLg();
  const isMobile = useIsMobile();

  const activeConversation = conversations.find((c) => c.id === chat.selected) ?? conversations[0];

  return (
    <>
      <div
        className="grid h-[calc(100svh-var(--header-height))] min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden shadow-sm transition-[grid-template-columns] duration-300 ease-out *:min-h-0 *:min-w-0 md:grid-cols-[22.5rem_minmax(0,1fr)] md:*:first:border-r lg:grid-cols-[22.5rem_minmax(0,1fr)_var(--profile-width)]"
        style={
          {
            "--profile-width": showContact ? "20rem" : "0rem",
          } as CSSProperties
        }
      >
        <ChatConversationList
          conversations={conversations}
          className={cn(
            "transition-transform duration-300 ease-out will-change-transform max-md:col-start-1 max-md:row-start-1",
            showThread && "max-md:pointer-events-none max-md:-translate-x-full",
          )}
          onSelectConversation={() => setShowThread(true)}
        />
        <ChatThread
          contact={activeConversation.contact}
          messages={activeConversation.messages}
          showBackButton={isMobile}
          onBack={() => setShowThread(false)}
          onOpenContact={() => setShowContact(true)}
          className={cn(
            "transition-transform duration-300 ease-out will-change-transform max-md:col-start-1 max-md:row-start-1",
            showThread ? "max-md:translate-x-0" : "max-md:pointer-events-none max-md:translate-x-full",
          )}
        />
        <div
          aria-hidden={!showContact}
          className={cn(
            "hidden overflow-hidden border-l transition-colors duration-300 lg:block",
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

      {/* Tablet/Mobile: Sheet */}
      {!isLg && (
        <Sheet open={showContact} onOpenChange={setShowContact}>
          <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
            <SheetTitle className="sr-only">Contact profile</SheetTitle>
            <SheetDescription className="sr-only">View contact details and activity</SheetDescription>
            <ChatProfileDetails contact={activeConversation.contact} onClose={() => setShowContact(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
