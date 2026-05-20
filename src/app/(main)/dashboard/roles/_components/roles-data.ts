import type { LucideIcon } from "lucide-react";
import { BarChart3, Code2, CreditCard, FileText, Folder, Settings, ShieldCheck, UsersRound } from "lucide-react";

export type PermissionState = "granted" | "partial" | "none";
export type AccessLevel = "Full Access" | "High" | "Medium" | "Low";
export type RoleKind = "System" | "Custom";

export const permissions = [
  { key: "users", label: "Users", detailLabel: "User Management", icon: UsersRound },
  { key: "projects", label: "Projects", detailLabel: "Project Management", icon: Folder },
  { key: "billing", label: "Billing", detailLabel: "Billing & Invoices", icon: CreditCard },
  { key: "reports", label: "Reports", detailLabel: "Reports & Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", detailLabel: "System Settings", icon: Settings },
  { key: "security", label: "Security", detailLabel: "Security & Roles", icon: ShieldCheck },
  { key: "api", label: "API", detailLabel: "API Access", icon: Code2 },
  { key: "auditLogs", label: "Audit Logs", detailLabel: "Audit Logs", icon: FileText },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  detailLabel: string;
  icon: LucideIcon;
}>;

export type PermissionKey = (typeof permissions)[number]["key"];

export type RoleRow = {
  name: string;
  kind: RoleKind;
  description: string;
  members: {
    visible: string[];
    hidden: number;
    total: number;
  };
  accessLevel: AccessLevel;
  created: string;
  permissions: Record<PermissionKey, PermissionState>;
};

export const roleRows: RoleRow[] = [
  {
    name: "Super Admin",
    kind: "System",
    description: "Full access to all features and settings",
    members: { visible: ["AK", "NS"], hidden: 3, total: 6 },
    accessLevel: "Full Access",
    created: "Jan 15, 2024",
    permissions: {
      users: "granted",
      projects: "granted",
      billing: "granted",
      reports: "granted",
      settings: "granted",
      security: "granted",
      api: "granted",
      auditLogs: "granted",
    },
  },
  {
    name: "Admin",
    kind: "System",
    description: "Manage users, projects, billing and settings",
    members: { visible: ["MR", "JT"], hidden: 2, total: 4 },
    accessLevel: "High",
    created: "Feb 02, 2024",
    permissions: {
      users: "granted",
      projects: "granted",
      billing: "granted",
      reports: "granted",
      settings: "granted",
      security: "granted",
      api: "partial",
      auditLogs: "granted",
    },
  },
  {
    name: "Manager",
    kind: "Custom",
    description: "Manage projects and team members",
    members: { visible: ["SO", "RP"], hidden: 5, total: 7 },
    accessLevel: "Medium",
    created: "Feb 18, 2024",
    permissions: {
      users: "granted",
      projects: "granted",
      billing: "none",
      reports: "none",
      settings: "granted",
      security: "none",
      api: "none",
      auditLogs: "granted",
    },
  },
  {
    name: "Editor",
    kind: "Custom",
    description: "Create and edit projects and content",
    members: { visible: ["ET", "LY"], hidden: 8, total: 10 },
    accessLevel: "Medium",
    created: "Mar 01, 2024",
    permissions: {
      users: "none",
      projects: "granted",
      billing: "none",
      reports: "none",
      settings: "none",
      security: "none",
      api: "none",
      auditLogs: "granted",
    },
  },
  {
    name: "Viewer",
    kind: "System",
    description: "View-only access to projects and data",
    members: { visible: ["VA", "DN"], hidden: 12, total: 14 },
    accessLevel: "Low",
    created: "Mar 08, 2024",
    permissions: {
      users: "none",
      projects: "granted",
      billing: "none",
      reports: "none",
      settings: "none",
      security: "none",
      api: "none",
      auditLogs: "granted",
    },
  },
  {
    name: "Billing Manager",
    kind: "Custom",
    description: "Manage billing, invoices and subscriptions",
    members: { visible: ["BM", "CW"], hidden: 2, total: 4 },
    accessLevel: "High",
    created: "Mar 14, 2024",
    permissions: {
      users: "none",
      projects: "none",
      billing: "granted",
      reports: "none",
      settings: "none",
      security: "none",
      api: "none",
      auditLogs: "granted",
    },
  },
  {
    name: "Support Agent",
    kind: "Custom",
    description: "Help users and manage tickets",
    members: { visible: ["SA", "KO"], hidden: 4, total: 6 },
    accessLevel: "Low",
    created: "Mar 22, 2024",
    permissions: {
      users: "granted",
      projects: "none",
      billing: "none",
      reports: "granted",
      settings: "none",
      security: "none",
      api: "none",
      auditLogs: "granted",
    },
  },
  {
    name: "Developer",
    kind: "Custom",
    description: "Access API and developer resources",
    members: { visible: ["DV", "PH"], hidden: 3, total: 5 },
    accessLevel: "Medium",
    created: "Apr 03, 2024",
    permissions: {
      users: "none",
      projects: "none",
      billing: "none",
      reports: "none",
      settings: "none",
      security: "none",
      api: "granted",
      auditLogs: "none",
    },
  },
  {
    name: "Auditor",
    kind: "Custom",
    description: "View audit logs and compliance data",
    members: { visible: ["AD", "FI"], hidden: 2, total: 4 },
    accessLevel: "Low",
    created: "Apr 12, 2024",
    permissions: {
      users: "none",
      projects: "none",
      billing: "none",
      reports: "none",
      settings: "none",
      security: "none",
      api: "none",
      auditLogs: "granted",
    },
  },
  {
    name: "Read Only",
    kind: "System",
    description: "Read-only access to all data",
    members: { visible: ["RO", "MS"], hidden: 6, total: 8 },
    accessLevel: "Low",
    created: "Apr 26, 2024",
    permissions: {
      users: "none",
      projects: "none",
      billing: "none",
      reports: "none",
      settings: "none",
      security: "none",
      api: "none",
      auditLogs: "none",
    },
  },
];

export const selectedRole = roleRows[0];
export const selectedPermissions = permissions.filter(
  (permission) => selectedRole.permissions[permission.key] === "granted",
);

export const tabFilters = [
  { label: "All Roles", value: "all", count: 12 },
  { label: "System", value: "system", count: 6 },
  { label: "Custom", value: "custom", count: 6 },
  { label: "Archived", value: "archived", count: 3 },
];
