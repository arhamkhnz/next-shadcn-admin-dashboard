import {
  User,
  Users,
  ChartPie,
  UserPen,
  Logs,
  AlertTriangle,
  LucideIcon,
  MessagesSquare,
  Calendar,
  History,
  Home,
  Grid2X2,
  ChartLine,
  ShoppingBag,
  BookA,
  Forklift,
  Mail,
  MessageSquare,
  Kanban,
  ReceiptText,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
} from "lucide-react";

export const ICON_MAP = {
  User,
  Users,
  ChartPie,
  UserPen,
  Logs,
  MessagesSquare,
  Calendar,
  History,
  Home,
  Grid2X2,
  ChartLine,
  ShoppingBag,
  BookA,
  Forklift,
  Mail,
  MessageSquare,
  Kanban,
  ReceiptText,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
};

export const resolveIcon = (iconName: keyof typeof ICON_MAP | undefined): LucideIcon => {
  if (!iconName) return AlertTriangle;
  return ICON_MAP[iconName] || AlertTriangle;
};

export interface NavSubItem {
  title: string;
  path: string;
  icon?: keyof typeof ICON_MAP;
  comingSoon?: boolean;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: keyof typeof ICON_MAP;
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
        path: "/dashboard",
        icon: "Home",
        subItems: [
          { title: "Default", path: `/dashboard/default`, icon: "ChartPie" },
          { title: "CRM", path: `/dashboard/crm`, icon: "Grid2X2", comingSoon: true },
          { title: "Analytics", path: `/dashboard/analytics`, icon: "ChartLine", comingSoon: true },
          { title: "eCommerce", path: `/dashboard/e-commerce`, icon: "ShoppingBag", comingSoon: true },
          { title: "Academy", path: `/dashboard/academy`, icon: "BookA", comingSoon: true },
          { title: "Logistics", path: `/dashboard/logistics`, icon: "Forklift", comingSoon: true },
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
        path: "/email",
        icon: "Mail",
        comingSoon: true,
      },
      {
        title: "Chat",
        path: "/chat",
        icon: "MessageSquare",
        comingSoon: true,
      },
      {
        title: "Calendar",
        path: "/calendar",
        icon: "Calendar",
        comingSoon: true,
      },
      {
        title: "Kanban",
        path: "/kanban",
        icon: "Kanban",
        comingSoon: true,
      },
      {
        title: "Invoice",
        path: "/invoice",
        icon: "ReceiptText",
        comingSoon: true,
      },
      {
        title: "Users",
        path: "/users",
        icon: "Users",
        comingSoon: true,
      },
      {
        title: "Roles",
        path: "/roles",
        icon: "Lock",
        comingSoon: true,
      },
      {
        title: "Auth Screens",
        path: "/auth",
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
        path: "/others",
        icon: "SquareArrowUpRight",
        comingSoon: true,
      },
    ],
  },
];
