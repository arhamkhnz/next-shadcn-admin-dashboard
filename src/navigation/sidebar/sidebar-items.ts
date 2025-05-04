import * as Icons from "lucide-react";
import { AlertTriangle, type LucideProps } from "lucide-react";

export const resolveIcon = (iconName: string): React.ComponentType<LucideProps> => {
  const icon = Icons[iconName as keyof typeof Icons];

  // Icon must be a valid React component
  if (typeof icon === "function" || typeof icon === "object") {
    return icon as React.ComponentType<LucideProps>;
  }

  return AlertTriangle;
};

export interface NavSubItem {
  title: string;
  url: string;
  icon: string;
  comingSoon?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: string;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Dashboards",
        url: "/dashboard",
        icon: "Home",
        subItems: [
          { title: "Default", url: `/dashboard/default`, icon: "ChartPie" },
          { title: "CRM", url: `/dashboard`, icon: "Grid2X2", comingSoon: true },
          { title: "Analytics", url: `/dashboard/analytics`, icon: "ChartLine", comingSoon: true },
          { title: "eCommerce", url: `/dashboard/e-commerce`, icon: "ShoppingBag", comingSoon: true },
          { title: "Academy", url: `/dashboard/academy`, icon: "BookA", comingSoon: true },
          { title: "Logistics", url: `/dashboard/logistics`, icon: "Forklift", comingSoon: true },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Email",
        url: "/email",
        icon: "Mail",
        comingSoon: true,
      },
      {
        title: "Chat",
        url: "/chat",
        icon: "MessageSquare",
        comingSoon: true,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: "Calendar",
        comingSoon: true,
      },
      {
        title: "Kanban",
        url: "/kanban",
        icon: "Kanban",
        comingSoon: true,
      },
      {
        title: "Invoice",
        url: "/invoice",
        icon: "ReceiptText",
        comingSoon: true,
      },
      {
        title: "Users",
        url: "/users",
        icon: "Users",
        comingSoon: true,
      },
      {
        title: "Roles",
        url: "/roles",
        icon: "Lock",
        comingSoon: true,
      },
      {
        title: "Auth Screens",
        url: "/auth",
        icon: "Fingerprint",
        comingSoon: true,
      },
    ],
  },
  {
    id: 3,
    label: "Misc",
    items: [
      {
        title: "Others",
        url: "/others",
        icon: "SquareArrowUpRight",
        comingSoon: true,
      },
    ],
  },
];
