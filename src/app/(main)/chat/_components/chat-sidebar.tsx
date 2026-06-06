"use client";

import { ChevronDown } from "lucide-react";
import { siFacebook, siInstagram, siWhatsapp } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn, getInitials } from "@/lib/utils";

import { channelItems, currentUser, navItems, viewItems } from "./data";

const channelBrandIcons = {
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  facebook: siFacebook,
} as const;

export function ChatSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="offcanvas"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! **:data-[sidebar=sidebar]:bg-background"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton className="[&_svg]:size-3.5" size="sm" isActive={item.isActive} tooltip={item.title}>
                  <item.icon />
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.label && <SidebarMenuBadge className="font-medium">{item.label}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-normal">Channels</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {channelItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton className="[&_svg]:size-3.5" size="sm" isActive={item.isActive} tooltip={item.title}>
                  {item.id in channelBrandIcons ? (
                    <SimpleIcon icon={channelBrandIcons[item.id as keyof typeof channelBrandIcons]} />
                  ) : (
                    <item.icon />
                  )}
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.label && <SidebarMenuBadge className="font-medium">{item.label}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-normal">Views</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {viewItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton className="[&_svg]:size-3.5" size="sm" isActive={item.isActive} tooltip={item.title}>
                  <item.icon />
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.label && <SidebarMenuBadge className="font-medium">{item.label}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-auto w-full justify-start gap-3 p-2", isCollapsed && "justify-center")}
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-background text-xs">{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="truncate font-semibold text-sm">{currentUser.name}</div>
                    <div className="truncate text-muted-foreground text-xs">{currentUser.company}</div>
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold">{currentUser.name}</div>
              <div className="text-muted-foreground text-xs">{currentUser.company}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
