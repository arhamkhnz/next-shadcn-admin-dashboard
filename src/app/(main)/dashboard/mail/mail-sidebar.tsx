"use client";

import * as React from "react";

import { Check, EllipsisVertical, LogOut, PenLine, Settings2, UserPlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, getInitials } from "@/lib/utils";

import { accounts, folderMailNavLinks, footerMailNavLinks, quickMailNavLinks } from "./_components/data";

export function MailSidebar() {
  const [selectedAccount, setSelectedAccount] = React.useState(accounts[0]);

  return (
    <Sidebar collapsible="icon" className="absolute inset-y-0 h-full">
      <SidebarHeader className="gap-3 py-3 pb-1">
        <div className="flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={selectedAccount ? String(selectedAccount.id) : ""}
            onValueChange={(value) => {
              const account = accounts.find((item) => item.id === Number(value));

              if (account) {
                setSelectedAccount(account);
              }
            }}
            spacing={2}
          >
            {accounts.map((account) => (
              <ToggleGroupItem
                key={account.id}
                className={cn(
                  "relative size-7 min-w-7 rounded-sm p-0 transition-colors",
                  "bg-primary text-primary-foreground text-xs hover:bg-primary/90 hover:text-primary-foreground",
                  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                  "data-[state=on]:ring data-[state=on]:ring-green-600",
                  "focus-visible:border-transparent focus-visible:ring-0",
                )}
                value={String(account.id)}
                aria-label={`Select ${account.label}`}
              >
                {getInitials(account.label).slice(0, 1)}
                <span className="absolute right-0 bottom-0 z-10 hidden size-2.5 items-center justify-center rounded-full bg-green-600 text-primary-foreground ring-[1.25px] ring-background group-data-[state=on]/toggle:flex">
                  <Check className="size-2" />
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open account menu">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Accounts</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserPlus />
                  Add account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UsersRound />
                  Manage accounts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings2 />
                  Account settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        {selectedAccount && (
          <div className="flex flex-col gap-1.5">
            <div className="font-medium text-sm leading-none">{selectedAccount.label}</div>
            <div className="truncate text-muted-foreground text-sm leading-none">{selectedAccount.email}</div>
          </div>
        )}

        <Button size="sm" variant="outline" className="w-full">
          <PenLine data-icon="inline-start" />
          New email
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {quickMailNavLinks.map((nav) => (
              <SidebarMenuItem key={nav.id}>
                <SidebarMenuButton className="[&_svg]:size-3.5" size="sm">
                  <nav.icon />
                  <span className="font-medium">{nav.title}</span>
                </SidebarMenuButton>
                {nav.label && <SidebarMenuBadge className="font-medium">{nav.label}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-normal">Folders</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {folderMailNavLinks.map((nav) => (
              <SidebarMenuItem key={nav.id}>
                <SidebarMenuButton className="[&_svg]:size-3.5" size="sm">
                  <nav.icon />
                  <span className="font-medium">{nav.title}</span>
                </SidebarMenuButton>
                {nav.label && <SidebarMenuBadge className="font-medium">{nav.label}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-1">
          {footerMailNavLinks.map((nav) => (
            <SidebarMenuItem key={nav.id}>
              <SidebarMenuButton className="[&_svg]:size-3.5" size="sm">
                <nav.icon />
                <span className="font-medium">{nav.title}</span>
              </SidebarMenuButton>
              {nav.label && <SidebarMenuBadge className="font-medium">{nav.label}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
