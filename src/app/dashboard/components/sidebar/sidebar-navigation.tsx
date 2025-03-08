"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavGroup, NavMainItem, resolveIcon, ICON_MAP } from "@/navigation/sidebar/sidebar-items";

interface SidebarNavigationProps {
  sidebarItems: NavGroup[];
}

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">Coming Soon</span>
);

export default function SidebarNavigation({ sidebarItems }: SidebarNavigationProps) {
  const path = usePathname();

  const renderIcon = (iconName: keyof typeof ICON_MAP | undefined): React.ReactNode => {
    const Icon = resolveIcon(iconName);
    return <Icon />;
  };

  const isActive = (itemPath: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems) {
      return subItems.some((subItem) => path.startsWith(subItem.path));
    }
    return path === itemPath;
  };

  const isCollapsibleInitiallyOpen = (item: NavMainItem) => {
    return item.subItems?.some((subItem) => path.startsWith(subItem.path)) ?? false;
  };

  return (
    <>
      {sidebarItems.map((navGroup) => (
        <SidebarGroup key={navGroup.id}>
          {navGroup.label && <SidebarGroupLabel>{navGroup.label}</SidebarGroupLabel>}
          <SidebarMenu>
            {navGroup.items.map((item) => (
              <Collapsible
                defaultOpen={isCollapsibleInitiallyOpen(item)}
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    {item.subItems ? (
                      <SidebarMenuButton
                        isActive={isActive(item.path, item.subItems)}
                        tooltip={item.title}
                        className="whitespace-nowrap"
                      >
                        {renderIcon(item.icon)}
                        <span>{item.title}</span>
                        {item.comingSoon && <IsComingSoon />}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    ) : (
                      <Link href={item.path}>
                        <SidebarMenuButton
                          disabled={item.comingSoon}
                          isActive={isActive(item.path)}
                          tooltip={item.title}
                        >
                          {renderIcon(item.icon)}
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
                              isActive={isActive(subItem.path)}
                              asChild
                            >
                              <a href={subItem.path}>
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
        </SidebarGroup>
      ))}
    </>
  );
}
