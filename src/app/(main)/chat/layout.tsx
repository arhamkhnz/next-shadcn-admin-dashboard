import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { ChatSidebar } from "./_components/chat-sidebar";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative h-full">
      <SidebarProvider className="h-full min-h-0">
        <ChatSidebar />
        <div className="size-full">{children}</div>
      </SidebarProvider>
    </div>
  );
}
