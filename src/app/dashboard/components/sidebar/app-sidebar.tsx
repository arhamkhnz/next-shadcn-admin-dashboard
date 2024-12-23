"use client";

import * as React from "react";

import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart } from "lucide-react";

import { TeamSwitcher } from "@/app/dashboard/components/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { sidebarItems } from "@/navigation/sidebar/sidebarItems";

import SidebarFooterMenu from "./sidebarFooterMenu";
import SidebarNavigation from "./sidebarNavigation";
import SidebarProjects from "./sidebarProjects";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
};

const teams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation sidebarItems={sidebarItems} />
        <SidebarProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterMenu user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
