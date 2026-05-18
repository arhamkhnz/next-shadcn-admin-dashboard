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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, getInitials } from "@/lib/utils";

import { accounts, type MailNavItem, mailNavigation } from "./data";

export function MailSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [selectedAccount, setSelectedAccount] = React.useState(accounts[0]);

  return (
    <Sidebar collapsible="icon" className="absolute inset-y-0 h-full **:data-[sidebar=sidebar]:bg-background">
      <SidebarHeader className="gap-3 py-3 pb-1">
        <div className="flex items-center justify-between">
          {isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={accountTriggerClassName}
                  aria-label={`Open ${selectedAccount.label} menu`}
                >
                  <AccountMarker account={selectedAccount} isSelected />
                </Button>
              </DropdownMenuTrigger>
              <AccountMenuContent
                selectedAccountId={selectedAccount.id}
                onSelectAccount={setSelectedAccount}
                showAccounts
                side="right"
                align="start"
              />
            </DropdownMenu>
          ) : (
            <>
              <ToggleGroup
                type="single"
                value={String(selectedAccount.id)}
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
                    className={accountTriggerClassName}
                    value={String(account.id)}
                    aria-label={`Select ${account.label}`}
                  >
                    <AccountMarker account={account} />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Open account menu">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <AccountMenuContent selectedAccountId={selectedAccount.id} onSelectAccount={setSelectedAccount} />
              </DropdownMenu>
            </>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-1.5 group-data-[state=collapsed]:hidden">
          <div className="font-medium text-sm leading-none">{selectedAccount.label}</div>
          <div className="truncate text-muted-foreground text-sm leading-none">{selectedAccount.email}</div>
        </div>

        <Button size={isCollapsed ? "icon-sm" : "sm"} variant="outline" className="group-data-[state=expanded]:w-full">
          <PenLine data-icon="inline-start" />
          <span className="group-data-[state=collapsed]:hidden">New email</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">{mailNavigation.navMain.map(renderNavItem)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-normal">Folders</SidebarGroupLabel>
          <SidebarMenu className="gap-1">{mailNavigation.folders.map(renderNavItem)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-1">{mailNavigation.navFooter.map(renderNavItem)}</SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function renderNavItem(nav: MailNavItem) {
  return (
    <SidebarMenuItem key={nav.id}>
      <SidebarMenuButton className="[&_svg]:size-3.5" size="sm" isActive={nav.isActive} tooltip={nav.title}>
        <nav.icon />
        <span className="font-medium">{nav.title}</span>
      </SidebarMenuButton>
      {nav.label && <SidebarMenuBadge className="font-medium">{nav.label}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

const accountTriggerClassName = cn(
  "relative size-7 min-w-7 rounded-sm p-0 transition-colors",
  "bg-primary text-primary-foreground text-xs hover:bg-primary/90 hover:text-primary-foreground",
  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  "data-[state=on]:ring data-[state=on]:ring-green-600",
  "focus-visible:border-transparent focus-visible:ring-0",
);

type Account = (typeof accounts)[number];

function AccountMarker({ account, isSelected = false }: { account: Account; isSelected?: boolean }) {
  return (
    <>
      {getInitials(account.label).slice(0, 1)}
      <span
        className={cn(
          "absolute right-0 bottom-0 z-10 hidden size-2.5 items-center justify-center rounded-full bg-green-600 text-primary-foreground ring-[1.25px] ring-background group-data-[state=on]/toggle:flex",
          isSelected && "flex",
        )}
      >
        <Check className="size-2" />
      </span>
    </>
  );
}

function AccountMenuContent({
  selectedAccountId,
  onSelectAccount,
  showAccounts = false,
  ...props
}: {
  selectedAccountId: number;
  onSelectAccount: (account: Account) => void;
  showAccounts?: boolean;
} & Pick<React.ComponentProps<typeof DropdownMenuContent>, "align" | "side">) {
  return (
    <DropdownMenuContent className="w-56" {...props}>
      {showAccounts && (
        <>
          <DropdownMenuLabel>Accounts</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup
              value={String(selectedAccountId)}
              onValueChange={(value) => {
                const account = accounts.find((item) => item.id === Number(value));

                if (account) {
                  onSelectAccount(account);
                }
              }}
            >
              {accounts.map((account) => (
                <DropdownMenuRadioItem key={account.id} value={String(account.id)}>
                  <div className="flex min-w-0 flex-col">
                    <span>{account.label}</span>
                    <span className="truncate text-muted-foreground text-xs">{account.email}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </>
      )}
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
  );
}
