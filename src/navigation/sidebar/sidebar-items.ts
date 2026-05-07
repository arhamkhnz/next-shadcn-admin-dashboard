import {
  AudioLines,
  ChartBar,
  Fingerprint,
  Gauge,
  LayoutDashboard,
  Mic,
  Radio,
  Settings,
  ShieldCheck,
  Users,
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
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
    ],
  },
  {
    id: 2,
    label: "Management",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Audio Posts",
        url: "/dashboard/audio-posts",
        icon: AudioLines,
      },
      {
        title: "Live Rooms",
        url: "/dashboard/coming-soon",
        icon: Radio,
      },
    ],
  },
  {
    id: 3,
    label: "Platform",
    items: [
      {
        title: "Moderation",
        url: "/dashboard/coming-soon",
        icon: ShieldCheck,
      },
      {
        title: "Settings",
        url: "/dashboard/coming-soon",
        icon: Settings,
      },
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
];
