"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PlusCircleIcon, MailIcon, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { resolveIcon, type NavGroup, type NavMainItem } from "@/navigation/sidebar/sidebar-items";

interface NavMainProps {
  items: NavGroup[];
}

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">Soon</span>
);

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();

  const renderIcon = (iconName: string) => {
    const Icon = resolveIcon(iconName);
    return <Icon />;
  };

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(sub.url));
    }
    return path === url;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["subItems"]) => {
    return subItems?.some((sub) => path.startsWith(sub.url)) ?? false;
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <PlusCircleIcon />
                <span>Quick Create</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <MailIcon />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isSubmenuOpen(item.subItems)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      {item.subItems ? (
                        <SidebarMenuButton
                          disabled={item.comingSoon}
                          isActive={isItemActive(item.url, item.subItems)}
                          tooltip={item.title}
                        >
                          {item.icon && renderIcon(item.icon)}
                          <span>{item.title}</span>
                          {item.comingSoon && <IsComingSoon />}
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      ) : (
                        <Link aria-disabled={item.comingSoon} href={item.url}>
                          <SidebarMenuButton
                            disabled={item.comingSoon}
                            isActive={isItemActive(item.url)}
                            tooltip={item.title}
                          >
                            {item.icon && renderIcon(item.icon)}
                            <span>{item.title}</span>
                            {item.comingSoon && <IsComingSoon />}
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </CollapsibleTrigger>
                    {item.subItems && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                aria-disabled={subItem.comingSoon}
                                isActive={isItemActive(subItem.url)}
                                asChild
                              >
                                <a href={subItem.url}>
                                  {renderIcon(subItem.icon)}
                                  <span>{subItem.title}</span>
                                  {subItem.comingSoon && <IsComingSoon />}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
