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
} from "lucide-react"

export interface NavItem {
  title: string
  label?: string
  icon: LucideIcon
  variant: "default" | "ghost"
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

export const sidebarItems: SidebarItem[] = [
  { heading: "Apps & Pages" },
  {
    title: "Inbox",
    icon: Inbox,
    variant: "default",
    route: "home",
  },
  {
    title: "Invoice",
    icon: Receipt,
    variant: "ghost",
    children: [{ title: "List Preview", route: "about" }],
  },
  {
    title: "Auth",
    icon: Receipt,
    variant: "ghost",
    children: [{ title: "Unauthorized", route: "unauthorized" }],
  },
  {
    title: "Drafts",
    icon: File,
    variant: "ghost",
    route: "drafts",
  },
  {
    title: "Sent",
    icon: Send,
    variant: "ghost",
    route: "sent",
  },
  {
    title: "Junk",
    icon: ArchiveX,
    variant: "ghost",
    route: "junk",
  },
  {
    title: "Trash",
    icon: Trash2,
    variant: "ghost",
    route: "trash",
  },
  {
    title: "Archive",
    icon: Archive,
    variant: "ghost",
    route: "archive",
  },
  {
    title: "Social",
    icon: Users2,
    variant: "ghost",
    route: "social",
  },
  {
    title: "Updates",
    icon: AlertCircle,
    variant: "ghost",
    route: "updates",
  },
  {
    title: "Forums",
    icon: MessagesSquare,
    variant: "ghost",
    route: "forums",
  },
  {
    title: "Shopping",
    icon: ShoppingCart,
    variant: "ghost",
    route: "shopping",
  },
  {
    title: "Promotions",
    icon: Archive,
    variant: "ghost",
    route: "promotions",
  },
  { heading: "Billing" },
]
