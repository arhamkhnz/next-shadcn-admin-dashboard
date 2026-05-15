"use client";

import * as React from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { setClientCookie } from "@/lib/cookie.client";
import { cn } from "@/lib/utils";

import type { Mail } from "./data";
import { MailDisplay } from "./mail-display";
import { MailInbox } from "./mail-inbox";
import {
  DEFAULT_MAIL_COLLAPSED,
  DEFAULT_MAIL_LAYOUT,
  MAIL_COLLAPSED_COOKIE,
  MAIL_DETAIL_PANEL_ID,
  MAIL_LAYOUT_COOKIE,
  MAIL_LIST_PANEL_ID,
  MAIL_NAV_PANEL_ID,
  MAIL_SIDEBAR_COLLAPSED_SIZE,
} from "./mail-layout-config";
import { MailSidebar } from "./mail-sidebar";
import { useMail } from "./use-mail";

interface MailProps {
  accounts: {
    id: number;
    label: string;
    email: string;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
}

export function MailComponent({
  accounts,
  mails,
  defaultLayout = [...DEFAULT_MAIL_LAYOUT],
  defaultCollapsed = DEFAULT_MAIL_COLLAPSED,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const collapsedSize = Number.parseInt(MAIL_SIDEBAR_COLLAPSED_SIZE, 10);

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      onLayoutChanged={(layout) => {
        const sizes = [layout[MAIL_NAV_PANEL_ID], layout[MAIL_LIST_PANEL_ID], layout[MAIL_DETAIL_PANEL_ID]];
        setClientCookie(MAIL_LAYOUT_COOKIE, JSON.stringify(sizes));
      }}
      className="h-full"
    >
      <ResizablePanel
        id={MAIL_NAV_PANEL_ID}
        defaultSize={defaultCollapsed ? MAIL_SIDEBAR_COLLAPSED_SIZE : `${defaultLayout[0]}%`}
        collapsedSize={MAIL_SIDEBAR_COLLAPSED_SIZE}
        collapsible={true}
        minSize="15%"
        maxSize="22%"
        onResize={(size) => {
          const shouldCollapse = size.inPixels <= collapsedSize + 1;
          setIsCollapsed(shouldCollapse);
          setClientCookie(MAIL_COLLAPSED_COOKIE, JSON.stringify(shouldCollapse));
        }}
        className={cn(isCollapsed && "min-w-12.5 transition-all duration-300 ease-in-out")}
      >
        <MailSidebar isCollapsed={isCollapsed} accounts={accounts} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id={MAIL_LIST_PANEL_ID} defaultSize={`${defaultLayout[1]}%`} minSize="30%" className="min-h-0">
        <MailInbox mails={mails} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id={MAIL_DETAIL_PANEL_ID} defaultSize={`${defaultLayout[2]}%`} minSize="30%" className="min-h-0">
        <MailDisplay mail={mails.find((item) => item.id === mail.selected) || null} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
