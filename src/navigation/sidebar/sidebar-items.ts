import {
  LayoutDashboard,
  Disc3,
  BadgeDollarSign,
  FileAudio,
  Ticket,
  Settings,
  BarChart3,
  Users,
  Music4,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: "Label",
    items: [
      {
        title: "Releases",
        url: "/dashboard/releases",
        icon: Disc3,
      },
      {
        title: "Artists",
        url: "/dashboard/artists",
        icon: Users,
        isNew: true,
      },
      {
        title: "Royalties",
        url: "/dashboard/royalties",
        icon: BadgeDollarSign,
      },
      {
        title: "Catalogue",
        url: "/dashboard/catalogue",
        icon: Music4,
        comingSoon: true,
      },
    ],
  },
  {
    id: 3,
    label: "A&R",
    items: [
      {
        title: "Demo Submissions",
        url: "/dashboard/demos",
        icon: FileAudio,
      },
      {
        title: "Support Tickets",
        url: "/dashboard/tickets",
        icon: Ticket,
      },
    ],
  },
  {
    id: 4,
    label: "Account",
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
