import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  Receipt,
  LucideIcon,
  PanelsTopLeft,
} from "lucide-react"

export interface NavItem {
  title: string
  label?: string
  icon: LucideIcon
  route?: string
  children?: ChildNavItem[]
}

export interface ChildNavItem {
  title: string
  label?: string
  route: string
}

export interface NavHeader {
  heading: string
}

export type SidebarItem = NavItem | NavHeader

const basePath = "/dashboard"

export const sidebarItems: SidebarItem[] = [
  { heading: "Overview" },
  {
    title: "Dashboard",
    icon: PanelsTopLeft,
    route: basePath,
  },
  { heading: "Apps & Pages" },
  {
    title: "Inbox",
    icon: Inbox,
    route: `${basePath}/about`,
  },
  {
    title: "Invoice",
    icon: Receipt,
    children: [{ title: "List Preview", route: "about" }],
  },
  {
    title: "Auth",
    icon: Receipt,
    children: [{ title: "Unauthorized", route: "unauthorized" }],
  },
  {
    title: "Drafts",
    icon: File,
    route: "drafts",
  },
  {
    title: "Sent",
    icon: Send,
    route: "sent",
  },
  {
    title: "Junk",
    icon: ArchiveX,
    route: "junk",
  },
  {
    title: "Trash",
    icon: Trash2,
    route: "trash",
  },
  {
    title: "Archive",
    icon: Archive,
    route: "archive",
  },
  {
    title: "Social",
    icon: Users2,
    route: "social",
  },
  {
    title: "Updates",
    icon: AlertCircle,
    route: "updates",
  },
  {
    title: "Forums",
    icon: MessagesSquare,
    route: "forums",
  },
  {
    title: "Shopping",
    icon: ShoppingCart,
    route: "shopping",
  },
  {
    title: "Promotions",
    icon: Archive,
    route: "promotions",
  },
  { heading: "Billing" },
]
