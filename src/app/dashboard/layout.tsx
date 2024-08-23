"use client"

import React, { ReactNode, useState } from "react"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import useRouteChange from "@/hooks/useRouteChange"
import useScreenSize from "@/hooks/useScreenSize"
import { cn } from "@/lib/utils"

import { AccountSwitcher } from "./components/account-switcher"
import Sidebar from "./components/sidebar"
import { UserNav } from "./components/user-nav"

interface LayoutProps {
  readonly children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const isMediumOrSmaller = useScreenSize()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useRouteChange(() => {
    setIsMobileNavOpen(false)
  })

  return (
    <main>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen items-stretch">
        <ResizablePanel
          defaultSize={18}
          collapsedSize={4}
          collapsible
          minSize={18}
          maxSize={18}
          onCollapse={() => {
            setIsCollapsed(true)
          }}
          onExpand={() => {
            setIsCollapsed(false)
          }}
          className={cn("hidden lg:block", isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
        >
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
            <AccountSwitcher isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <Sidebar isCollapsed={isCollapsed} />
        </ResizablePanel>
        <ResizableHandle className="hidden lg:flex" withHandle />

        <ResizablePanel defaultSize={!isMediumOrSmaller ? 82 : 100}>
          <div className="flex items-center justify-between px-4 py-2 lg:justify-end">
            <Button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              variant="default"
              className="size-9 p-1 md:flex lg:hidden"
            >
              <Menu className="size-6" />
            </Button>

            <div className="flex gap-2">
              <div className="md:block lg:hidden">
                <AccountSwitcher isCollapsed />
              </div>
              <UserNav />
            </div>
          </div>
          <Separator />
          <div className="p-4">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent className="px-2 py-3" side="left">
          <SheetHeader>
            <SheetTitle className="text-left">Studio Admin</SheetTitle>
          </SheetHeader>
          <Sidebar isMobileSidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </main>
  )
}
