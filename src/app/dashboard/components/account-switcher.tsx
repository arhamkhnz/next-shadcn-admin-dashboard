"use client"

import * as React from "react"

import { SiGmail, SiVercel, SiIcloud } from "@icons-pack/react-simple-icons"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AccountSwitcherProps {
  readonly isCollapsed: boolean
}

const accounts = [
  {
    label: "Alicia Vercel",
    email: "alicia@example.com",
    icon: <SiVercel size={36} />,
  },
  {
    label: "Alicia Gmail",
    email: "alicia@gmail.com",
    icon: <SiGmail size={36} />,
  },
  {
    label: "Alicia Cloud",
    email: "alicia@me.com",
    icon: <SiIcloud size={36} />,
  },
]

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(accounts[0].email)

  return (
    <Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 focus:ring-0 focus:ring-offset-0",
          isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {accounts.find((account) => account.email === selectedAccount)?.icon}
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {accounts.find((account) => account.email === selectedAccount)?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.email} value={account.email}>
            <div className="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {account.icon}
              {account.email}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
