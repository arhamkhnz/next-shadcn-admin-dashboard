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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";

import { folderMailNavLinks, footerMailNavLinks, quickMailNavLinks } from "./data";
import { MailNav } from "./mail-nav";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: {
    id: number;
    label: string;
    email: string;
  }[];
}

export function MailSidebar({ isCollapsed, accounts }: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState(accounts[0]);

  return (
    <div className="flex h-full flex-col gap-3 px-2 py-3">
      {isCollapsed ? (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "relative rounded-sm bg-primary text-primary-foreground text-xs hover:bg-primary/90 hover:text-primary-foreground",
                  "data-[state=open]:bg-primary data-[state=open]:text-primary-foreground",
                  "focus-visible:border-transparent focus-visible:ring-0",
                )}
                aria-label={selectedAccount ? `Open ${selectedAccount.label} menu` : "Open account menu"}
              >
                {selectedAccount ? getInitials(selectedAccount.label).slice(0, 1) : null}
                <span className="absolute right-0 bottom-0 z-10 flex size-2.5 items-center justify-center rounded-full bg-green-600 text-primary-foreground ring-[1.25px] ring-background">
                  <Check className="size-2" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-52">
              <DropdownMenuLabel>Accounts</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={selectedAccount ? String(selectedAccount.id) : ""}
                  onValueChange={(value) => {
                    const account = accounts.find((item) => item.id === Number(value));

                    if (account) {
                      setSelectedAccount(account);
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
      ) : (
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
      )}

      <Separator />

      {selectedAccount && !isCollapsed && (
        <div className="flex flex-col gap-1.5">
          <div className="font-medium text-sm leading-none">{selectedAccount.label}</div>
          <div className="truncate text-muted-foreground text-sm leading-none">{selectedAccount.email}</div>
        </div>
      )}

      <div className={cn(isCollapsed && "flex justify-center")}>
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon-sm" variant="outline" aria-label="New email">
                <PenLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New email</TooltipContent>
          </Tooltip>
        ) : (
          <Button size="sm" variant="outline" className="w-full">
            <PenLine data-icon="inline-start" />
            New email
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className={cn(isCollapsed ? "space-y-0" : "space-y-3")}>
          <MailNav isCollapsed={isCollapsed} links={quickMailNavLinks} />

          <div className="space-y-1.5">
            <div className={cn("mx-2.5 text-muted-foreground text-xs leading-none", isCollapsed && "hidden")}>
              Folders
            </div>
            <MailNav isCollapsed={isCollapsed} links={folderMailNavLinks} />
          </div>
        </div>

        <div className="mt-auto">
          <MailNav isCollapsed={isCollapsed} links={footerMailNavLinks} />
        </div>
      </div>
    </div>
  );
}
