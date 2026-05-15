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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

      <div className="flex flex-1 flex-col">
        <div className="space-y-3">
          <MailNav isCollapsed={isCollapsed} links={quickMailNavLinks} />

          <div className="space-y-1.5">
            <div className="mx-2.5 text-muted-foreground text-xs leading-none">Folders</div>
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
