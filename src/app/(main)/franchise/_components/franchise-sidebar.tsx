"use client";

import React, { useState } from "react";

import { ChevronLeft, ChevronRight, Command } from "lucide-react";

import { NavFranchise } from "@/app/(main)/franchise/_components/nav-franchise";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";

export function FranchiseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar {...props} collapsible={isCollapsed ? "icon" : "none"} variant="floating">
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="bg-primary/10 hover:bg-primary/20 transition-colors data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="/franchise" className="flex items-center gap-2">
                <div className="bg-primary flex items-center justify-center rounded-md p-1 shadow-sm">
                  <Command className="text-primary-foreground h-4 w-4" />
                </div>
                <span className="text-primary text-base font-semibold">{APP_CONFIG.name}</span>
                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-7 w-7"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSidebar();
                    }}
                  >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Franchise Menu</SidebarGroupLabel>
          <NavFranchise />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
