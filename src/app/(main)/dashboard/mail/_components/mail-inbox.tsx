"use client";

import { Ellipsis, PanelLeftOpen, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

import type { Mail } from "./data";
import { MailList } from "./mail-list";

interface MailInboxProps {
  mails: Mail[];
  onOpenSidebar?: () => void;
  onSelectMail?: (mail: Mail) => void;
}

export function MailInbox({ mails, onOpenSidebar, onSelectMail }: MailInboxProps) {
  const pinnedMails = mails.filter((mail) => mail.isPinned);
  const unpinnedMails = mails.filter((mail) => !mail.isPinned);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center">
          {onOpenSidebar ? (
            <>
              <Button variant="ghost" size="icon-sm" aria-label="Open mailbox navigation" onClick={onOpenSidebar}>
                <PanelLeftOpen />
              </Button>
              <Separator className="mr-3 ml-1 h-4 data-vertical:self-center" orientation="vertical" />
            </>
          ) : null}
          <h1 className="font-medium text-xl leading-none">Inbox</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <SlidersHorizontal />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <RotateCcw />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis />
          </Button>
        </div>
      </div>

      <div className="px-2">
        <Separator />
      </div>

      <div className="px-2">
        <InputGroup className="h-7 w-full rounded-md">
          <InputGroupInput className="h-7" placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <MailList
          groups={[
            {
              id: "pinned",
              title: "Pinned",
              items: pinnedMails,
            },
            {
              id: "inbox",
              title: "Inbox",
              items: unpinnedMails,
            },
          ]}
          onSelectMail={onSelectMail}
        />
      </div>
    </div>
  );
}
