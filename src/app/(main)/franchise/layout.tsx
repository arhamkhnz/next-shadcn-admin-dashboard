import { ReactNode } from "react";

import { FranchiseSidebar } from "@/app/(main)/franchise/_components/franchise-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function FranchiseLayout({ children }: { children: ReactNode }) {
  // Use default values for sidebar state and preferences
  const defaultOpen = true;
  const sidebarVariant = "inset";
  const sidebarCollapsible = "icon";
  const contentLayout = "centered";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <FranchiseSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
      <SidebarInset
        data-content-layout={contentLayout}
        className={cn(
          "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
          "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
        )}
      >
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              {/* You can add a franchise-specific search or controls here */}
            </div>
            <div className="flex items-center gap-2">
              {/* Add franchise-specific layout controls, theme switcher, or account switcher here if needed */}
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
