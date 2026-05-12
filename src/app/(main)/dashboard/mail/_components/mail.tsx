"use client";

import * as React from "react";

import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setClientCookie } from "@/lib/cookie.client";
import { cn } from "@/lib/utils";

import { AccountSwitcher } from "./account-switcher";
import type { Mail } from "./data";
import { MailDisplay } from "./mail-display";
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
import { MailList } from "./mail-list";
import { Nav } from "./nav";
import { useMail } from "./use-mail";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
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
      onLayoutChange={(layout) => {
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
        maxSize="20%"
        onResize={(size) => {
          const shouldCollapse = size.inPixels <= collapsedSize + 1;
          setIsCollapsed(shouldCollapse);
          setClientCookie(MAIL_COLLAPSED_COOKIE, JSON.stringify(shouldCollapse));
        }}
        className={cn(isCollapsed && "min-w-12.5 transition-all duration-300 ease-in-out")}
      >
        <div className={cn("flex h-13 items-center justify-center", isCollapsed ? "h-13" : "px-2")}>
          <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
        </div>
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Inbox",
              label: "128",
              icon: Inbox,
              variant: "default",
            },
            {
              title: "Drafts",
              label: "9",
              icon: File,
              variant: "ghost",
            },
            {
              title: "Sent",
              label: "",
              icon: Send,
              variant: "ghost",
            },
            {
              title: "Junk",
              label: "23",
              icon: ArchiveX,
              variant: "ghost",
            },
            {
              title: "Trash",
              label: "",
              icon: Trash2,
              variant: "ghost",
            },
            {
              title: "Archive",
              label: "",
              icon: Archive,
              variant: "ghost",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Social",
              label: "972",
              icon: Users2,
              variant: "ghost",
            },
            {
              title: "Updates",
              label: "342",
              icon: AlertCircle,
              variant: "ghost",
            },
            {
              title: "Forums",
              label: "128",
              icon: MessagesSquare,
              variant: "ghost",
            },
            {
              title: "Shopping",
              label: "8",
              icon: ShoppingCart,
              variant: "ghost",
            },
            {
              title: "Promotions",
              label: "21",
              icon: Archive,
              variant: "ghost",
            },
          ]}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id={MAIL_LIST_PANEL_ID} defaultSize={`${defaultLayout[1]}%`} minSize="30%" className="min-h-0">
        <Tabs defaultValue="all" className="h-full min-h-0">
          <div className="flex items-center px-4 py-2">
            <h1 className="font-bold text-xl">Inbox</h1>
            <TabsList className="ml-auto">
              <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                All mail
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="all" className="m-0 min-h-0">
            <MailList items={mails} />
          </TabsContent>
          <TabsContent value="unread" className="m-0 min-h-0">
            <MailList items={mails.filter((item) => !item.read)} />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id={MAIL_DETAIL_PANEL_ID} defaultSize={`${defaultLayout[2]}%`} minSize="30%" className="min-h-0">
        <MailDisplay mail={mails.find((item) => item.id === mail.selected) || null} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
