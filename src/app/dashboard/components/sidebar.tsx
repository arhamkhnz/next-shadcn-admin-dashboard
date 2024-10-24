import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import initials from "initials"
import { Circle } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import useVariantBasedOnRoute from "@/hooks/useVariantBasedOnRoute"
import { cn } from "@/lib/utils"
import { sidebarItems, SidebarItem, NavItem, NavHeader } from "@/navigation/sidebar/sidebarItems"

type GetVariantFunction = (route: string) => "default" | "ghost"

function SidebarHeading({
  heading,
  isMobileSidebar = false,
  isCollapsed,
}: {
  readonly heading: string
  readonly isMobileSidebar: boolean
  readonly isCollapsed: boolean
}) {
  return isCollapsed ? (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="flex size-9 items-center justify-center rounded-md bg-gray-200">
          <span className="text-sm uppercase text-zinc-500">{initials(heading)}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {heading}
      </TooltipContent>
    </Tooltip>
  ) : (
    <h4 className={cn("px-3 text-zinc-500 text-sm mt-2 mb-1 uppercase text-left", isMobileSidebar && "px-1")}>
      {heading}
    </h4>
  )
}

function SidebarItemWithChildren({
  item,
  isCollapsed = false,
  getVariant,
}: {
  readonly item: NavItem
  readonly isCollapsed?: boolean
  readonly getVariant: GetVariantFunction
}) {
  const childRoutes = item.children?.map((child) => child.route || "") ?? []
  const currentPath = usePathname()
  const isActive = childRoutes.some((route) => currentPath.includes(route))

  return (
    <AccordionItem value={item.title} className="border-none">
      <AccordionTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: isCollapsed ? "icon" : "sm" }),
          isCollapsed && "hide-accordion-icon",
          "flex items-center justify-between hover:no-underline py-0 w-9 h-9",
          isActive && "bg-accent",
        )}
      >
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex size-9 items-center justify-center">
                <item.icon className="size-4" />
                <span className="sr-only">{item.title}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {item.title}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center">
            <item.icon className="mr-2 size-4" />
            {item.title}
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent className="mt-1 flex flex-col gap-1 pb-0">
        {item.children?.map((child) =>
          isCollapsed ? (
            <Tooltip key={child.title} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={child.route || "#"}
                  className={cn(buttonVariants({ variant: getVariant(child.route), size: "icon" }), "h-9 w-9")}
                >
                  <span className="text-sm">{initials(child.title)}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {child.title}
                {child.label && <span className="ml-auto text-muted-foreground">{child.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={child.title}
              href={child.route || "#"}
              className={cn(
                buttonVariants({ variant: getVariant(child.route), size: "sm" }),
                "flex items-center justify-start py-0 px-4",
              )}
            >
              <Circle className={cn("mr-2 h-3 w-3")} />
              <div className={cn("text-sm duration-200")}>{child.title}</div>
              {child.label && <span className="ml-auto">{child.label}</span>}
            </Link>
          ),
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

function CollapsedSidebar({ item, getVariant }: { readonly item: NavItem; readonly getVariant: GetVariantFunction }) {
  if (item.children) {
    return <SidebarItemWithChildren item={item} isCollapsed getVariant={getVariant} />
  }

  const variant = getVariant(item.route ?? "")
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link href={item.route ?? "#"} className={cn(buttonVariants({ variant, size: "icon" }), "h-9 w-9")}>
          <item.icon className="size-4" />
          <span className="sr-only">{item.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {item.title}
        {item.label && <span className="ml-auto text-muted-foreground">{item.label}</span>}
      </TooltipContent>
    </Tooltip>
  )
}

function ExpandedSidebar({ item, getVariant }: { readonly item: NavItem; readonly getVariant: GetVariantFunction }) {
  if (item.children) {
    return <SidebarItemWithChildren item={item} getVariant={getVariant} />
  }

  const variant = getVariant(item.route ?? "")
  return (
    <Link
      href={item.route ?? "#"}
      className={cn(buttonVariants({ variant, size: "sm" }), "flex justify-start items-center")}
    >
      <item.icon className="mr-2 size-4" />
      {item.title}
      {item.label && <span className={cn("ml-auto")}>{item.label}</span>}
    </Link>
  )
}

interface NavProps {
  readonly isCollapsed: boolean
  readonly isMobileSidebar?: boolean
}

function isNavItem(item: SidebarItem): item is NavItem {
  return (item as NavItem).title !== undefined
}

export default function Sidebar({ isCollapsed, isMobileSidebar = false }: NavProps) {
  const getVariant = useVariantBasedOnRoute()
  return (
    <TooltipProvider delayDuration={0}>
      <Accordion type="single" collapsible>
        <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
          <nav
            className={cn(
              "grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2",
              isMobileSidebar && "p-0",
            )}
          >
            {sidebarItems.map((item: SidebarItem) => {
              if (isNavItem(item)) {
                if (isCollapsed) {
                  return <CollapsedSidebar key={item.title} item={item} getVariant={getVariant} />
                }
                return <ExpandedSidebar key={item.title} item={item} getVariant={getVariant} />
              }
              return (
                <SidebarHeading
                  isMobileSidebar={isMobileSidebar}
                  key={item.heading}
                  heading={item.heading}
                  isCollapsed={isCollapsed}
                />
              )
            })}
          </nav>
        </div>
      </Accordion>
    </TooltipProvider>
  )
}
