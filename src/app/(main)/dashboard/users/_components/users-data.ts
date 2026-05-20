import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CodeXml,
  Megaphone,
  Palette,
  ShieldCheck,
  ShieldX,
  SquareUserRound,
} from "lucide-react";

export type UserStatus = "Active" | "Inactive" | "Away";

export type UserRow = {
  avatarTone: string;
  email: string;
  joinedDate: string;
  lastActive: string;
  name: string;
  role: string;
  status: UserStatus;
  twoFa: boolean;
};

export const users: UserRow[] = [
  {
    name: "Liam Smith",
    email: "liam.smith@novara.com",
    role: "Project Manager",
    status: "Active",
    joinedDate: "24 Jun 2024, 9:23 AM",
    lastActive: "Just now",
    twoFa: true,
    avatarTone: "bg-amber-500/15 text-amber-100",
  },
  {
    name: "Noah Anderson",
    email: "noah.anderson@novara.com",
    role: "UX Designer",
    status: "Active",
    joinedDate: "15 Mar 2023, 2:45 PM",
    lastActive: "5m ago",
    twoFa: true,
    avatarTone: "bg-rose-500/15 text-rose-100",
  },
  {
    name: "Isabella Garcia",
    email: "isabella.garcia@novara.com",
    role: "Front-End Developer",
    status: "Inactive",
    joinedDate: "10 Apr 2022, 11:30 AM",
    lastActive: "14d ago",
    twoFa: false,
    avatarTone: "bg-orange-500/15 text-orange-100",
  },
  {
    name: "William Clark",
    email: "william.clark@novara.com",
    role: "Product Owner",
    status: "Active",
    joinedDate: "28 Feb 2023, 6:15 PM",
    lastActive: "1h ago",
    twoFa: true,
    avatarTone: "bg-emerald-500/15 text-emerald-100",
  },
  {
    name: "James Hall",
    email: "james.hall@novara.com",
    role: "Business Analyst",
    status: "Active",
    joinedDate: "19 May 2024, 7:55 AM",
    lastActive: "2h ago",
    twoFa: true,
    avatarTone: "bg-amber-500/15 text-amber-100",
  },
  {
    name: "Benjamin Lewis",
    email: "benjamin.lewis@novara.com",
    role: "Data Analyst",
    status: "Active",
    joinedDate: "03 Jan 2024, 12:05 PM",
    lastActive: "1d ago",
    twoFa: true,
    avatarTone: "bg-violet-500/15 text-violet-100",
  },
  {
    name: "Amelia Davis",
    email: "amelia.davis@novara.com",
    role: "UX Designer",
    status: "Away",
    joinedDate: "21 Jul 2023, 8:40 PM",
    lastActive: "3h ago",
    twoFa: true,
    avatarTone: "bg-fuchsia-500/15 text-fuchsia-100",
  },
  {
    name: "Emma Johnson",
    email: "emma.johnson@novara.com",
    role: "Marketing Specialist",
    status: "Active",
    joinedDate: "16 Sep 2023, 3:25 PM",
    lastActive: "6m ago",
    twoFa: true,
    avatarTone: "bg-rose-500/15 text-rose-100",
  },
  {
    name: "Olivia Brown",
    email: "olivia.brown@novara.com",
    role: "Product Designer",
    status: "Active",
    joinedDate: "04 Nov 2022, 9:50 AM",
    lastActive: "12m ago",
    twoFa: true,
    avatarTone: "bg-fuchsia-500/15 text-fuchsia-100",
  },
  {
    name: "Ava Williams",
    email: "ava.williams@novara.com",
    role: "Software Engineer",
    status: "Active",
    joinedDate: "30 Dec 2023, 4:35 PM",
    lastActive: "30m ago",
    twoFa: true,
    avatarTone: "bg-orange-500/15 text-orange-100",
  },
];

export const roleMeta: Record<string, { className: string; icon: LucideIcon }> = {
  "Project Manager": { className: "text-amber-300", icon: BriefcaseBusiness },
  "UX Designer": { className: "text-fuchsia-300", icon: Palette },
  "Front-End Developer": { className: "text-orange-300", icon: CodeXml },
  "Product Owner": { className: "text-emerald-300", icon: SquareUserRound },
  "Business Analyst": { className: "text-amber-300", icon: BarChart3 },
  "Data Analyst": { className: "text-violet-300", icon: BarChart3 },
  "Marketing Specialist": { className: "text-rose-300", icon: Megaphone },
  "Product Designer": { className: "text-fuchsia-300", icon: Palette },
  "Software Engineer": { className: "text-orange-300", icon: CodeXml },
};

export const statusMeta: Record<UserStatus, { badgeClass: string; dotClass: string }> = {
  Active: {
    badgeClass: "border-emerald-500/15 bg-emerald-500/10 text-emerald-300",
    dotClass: "bg-emerald-400",
  },
  Inactive: {
    badgeClass: "border-rose-500/15 bg-rose-500/10 text-rose-300",
    dotClass: "bg-rose-400",
  },
  Away: {
    badgeClass: "border-amber-500/15 bg-amber-500/10 text-amber-300",
    dotClass: "bg-amber-400",
  },
};

export const twoFaMeta = {
  enabled: {
    badgeClass: "border-emerald-500/15 bg-emerald-500/10 text-emerald-300",
    icon: ShieldCheck,
  },
  disabled: {
    badgeClass: "border-white/10 bg-white/[0.03] text-muted-foreground",
    icon: ShieldX,
  },
} as const;
