import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { MailSidebar } from "./mail-sidebar";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative h-full">
      <SidebarProvider className="h-full min-h-0">
        <MailSidebar />
        <div>
          {/* <SidebarTrigger /> */}
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
