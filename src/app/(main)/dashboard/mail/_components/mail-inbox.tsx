"use client";

import { Ellipsis, Plus, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Mail } from "./data";
import { MailList } from "./mail-list";

interface MailInboxProps {
  mails: Mail[];
}

export function MailInbox({ mails }: MailInboxProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-2 py-3">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-medium text-xl leading-none">Inbox</h1>
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

      <Separator />

      <InputGroup className="w-full">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex-1">
          <TabsTrigger value="all">All Mails</TabsTrigger>
          <TabsTrigger value="unread">Unread (125)</TabsTrigger>
          <TabsTrigger value="others">Others (5)</TabsTrigger>
          <Button
            variant="outline"
            className="ml-1 size-6.25 rounded-md border-0 border-transparent bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground dark:border dark:border-input dark:bg-input/30 dark:text-foreground"
          >
            <Plus />
          </Button>
        </TabsList>
      </Tabs>

      <MailList items={mails} />
    </div>
  );
}
