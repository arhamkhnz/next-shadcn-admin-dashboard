import {
  Activity,
  Building2,
  Calendar,
  ChartBar,
  CheckSquare,
  FileBarChart,
  Handshake,
  type LucideIcon,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "CRM",
    items: [
      {
        id: "crm",
        title: "Overview",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        id: "leads",
        title: "Leads",
        url: "/dashboard/crm/leads",
        icon: UserPlus,
      },
      {
        id: "contacts",
        title: "Contacts",
        url: "/dashboard/crm/contacts",
        icon: Users,
      },
      {
        id: "companies",
        title: "Companies",
        url: "/dashboard/crm/companies",
        icon: Building2,
      },
      {
        id: "deals",
        title: "Deals",
        url: "/dashboard/crm/deals",
        icon: Handshake,
      },
      {
        id: "activities",
        title: "Activities",
        url: "/dashboard/crm/activities",
        icon: Activity,
      },
      {
        id: "reports",
        title: "Reports",
        url: "/dashboard/crm/reports",
        icon: FileBarChart,
      },
    ],
  },
  {
    id: 2,
    label: "Workspace",
    items: [
      {
        id: "tasks",
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        id: "calendar",
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        id: "chat",
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
    ],
  },
];
