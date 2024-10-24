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

export interface NavSubItem {
  title: string
  url: string
}

export interface NavMainItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
}

export interface NavGroup {
  label: string
  items: NavMainItem[]
}

const basePath = "/dashboard"

export const sidebarItems: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: basePath,
        icon: PanelsTopLeft,
        isActive: true,
      },
    ],
  },
  {
    label: "Apps & Pages",
    items: [
      {
        title: "Inbox",
        url: `${basePath}/inbox`,
        icon: Inbox,
      },
      {
        title: "Invoice",
        url: "#",
        icon: Receipt,
        items: [
          { title: "List", url: `${basePath}/invoice/list-preview` },
          { title: "View", url: `${basePath}/invoice/list-preview` },
          { title: "Add", url: `${basePath}/invoice/list-preview` },
          { title: "Edit", url: `${basePath}/invoice/list-preview` },
        ],
      },
      {
        title: "Auth",
        url: "#",
        icon: Receipt,
        items: [{ title: "Unauthorized", url: `${basePath}/auth/unauthorized` }],
      },
      {
        title: "Drafts",
        url: `${basePath}/drafts`,
        icon: File,
      },
      {
        title: "Sent",
        url: `${basePath}/sent`,
        icon: Send,
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        title: "Billing",
        url: `${basePath}/billing`,
        icon: Receipt,
      },
    ],
  },
]
