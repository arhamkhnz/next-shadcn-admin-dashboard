import { ReactNode } from "react";

import { AppSidebar } from "@/app/dashboard/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import SidebarBreadcrumbs from "./components/sidebar/sidebar-breadcrumbs";

interface LayoutProps {
  readonly children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="bg-sidebar">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="m-2 mx-auto max-w-screen-2xl md:rounded-xl md:border">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <SidebarBreadcrumbs />
            </div>
          </header>
          <div className="p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
