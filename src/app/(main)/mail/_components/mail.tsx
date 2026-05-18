"use client";

import * as React from "react";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";
import { setClientCookie } from "@/lib/cookie.client";

import type { Mail } from "./data";
import { MailInbox } from "./mail-inbox";
import {
  DEFAULT_MAIL_LAYOUT,
  MAIL_DETAIL_PANEL_ID,
  MAIL_LAYOUT_COOKIE,
  MAIL_LIST_PANEL_ID,
} from "./mail-layout-config";
import { MailView } from "./mail-view";
import { useMail } from "./use-mail";

interface MailProps {
  mails: Mail[];
  defaultLayout: number[] | undefined;
}

export function MailComponent({ mails, defaultLayout = [...DEFAULT_MAIL_LAYOUT] }: MailProps) {
  const { isMobile } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex size-full items-center justify-center text-muted-foreground text-sm">Loading mail...</div>
    );
  }

  return isMobile ? (
    <MailMobileLayout mails={mails} />
  ) : (
    <MailDesktopLayout mails={mails} defaultLayout={defaultLayout} />
  );
}

function MailMobileLayout({ mails }: Pick<MailProps, "mails">) {
  const [mail] = useMail();
  const [isMailOpen, setIsMailOpen] = React.useState(false);
  const selectedMail = mails.find((item) => item.id === mail.selected) || null;

  return (
    <>
      <MailInbox mails={mails} onSelectMail={() => setIsMailOpen(true)} />

      <Drawer open={isMailOpen} onOpenChange={setIsMailOpen}>
        <DrawerContent>
          <DrawerTitle className="sr-only">Mail message</DrawerTitle>
          <DrawerDescription className="sr-only">Read the selected email message</DrawerDescription>
          <MailView mail={selectedMail} onClose={() => setIsMailOpen(false)} />
        </DrawerContent>
      </Drawer>
    </>
  );
}

function MailDesktopLayout({ mails, defaultLayout = [...DEFAULT_MAIL_LAYOUT] }: MailProps) {
  const [mail] = useMail();

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      onLayoutChanged={(layout) => {
        const sizes = [layout[MAIL_LIST_PANEL_ID], layout[MAIL_DETAIL_PANEL_ID]];
        setClientCookie(MAIL_LAYOUT_COOKIE, JSON.stringify(sizes));
      }}
      className="h-full"
    >
      <ResizablePanel id={MAIL_LIST_PANEL_ID} defaultSize={`${defaultLayout[0]}%`} minSize="30%" className="min-h-0">
        <MailInbox mails={mails} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id={MAIL_DETAIL_PANEL_ID} defaultSize={`${defaultLayout[1]}%`} minSize="30%" className="min-h-0">
        <MailView mail={mails.find((item) => item.id === mail.selected) || null} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
