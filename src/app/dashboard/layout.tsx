"use client"

import React, { ReactNode, useState, useRef } from "react"

import { Menu, ArrowLeftToLine } from "lucide-react"
import { ImperativePanelHandle } from "react-resizable-panels"

import { Button } from "@/components/ui/button"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import appConfig from "@/constants/appConfig"
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
  const panelRef = useRef<ImperativePanelHandle | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useRouteChange(() => {
    setIsMobileNavOpen(false)
  })

  const handleTogglePanel = () => {
    if (panelRef.current) {
      if (isCollapsed) {
        panelRef.current.expand()
      } else {
        panelRef.current.collapse()
      }
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <main>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen items-stretch">
        <ResizablePanel
          ref={panelRef}
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
          className={cn(
            "hidden lg:block border-r !overflow-visible",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div className={cn("flex h-[52px] items-center relative", isCollapsed ? "h-[52px] justify-center" : "px-2")}>
            <h1>{!isCollapsed ? appConfig.appName : appConfig.appShortName}</h1>

            <Button
              className="absolute right-[-12px] size-6 rounded-full border-none bg-gray-200"
              variant="outline"
              size="icon"
              onClick={handleTogglePanel}
            >
              <span className="transition-transform duration-300 ease-in-out">
                <ArrowLeftToLine className={cn("size-4 transform", isCollapsed ? "rotate-180" : "rotate-0")} />
              </span>
            </Button>
          </div>
          <Separator />
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
            <AccountSwitcher isCollapsed={isCollapsed} />
          </div>
          <Sidebar isCollapsed={isCollapsed} />
        </ResizablePanel>

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
            <SheetTitle className="text-left">{appConfig.appName}</SheetTitle>
          </SheetHeader>
          <Sidebar isMobileSidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </main>
  )
}
