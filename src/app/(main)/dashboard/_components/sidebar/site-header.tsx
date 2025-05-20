import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { SidebarVariant, SidebarCollapsible } from "@/lib/layout-preferences";

import LayoutControls from "./layout-controls";

type SiteHeaderProps = {
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
};

export function SiteHeader({ variant, collapsible }: SiteHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-base font-medium">Documents</h1>
        </div>
        <LayoutControls variant={variant} collapsible={collapsible} />
      </div>
    </header>
  );
}
