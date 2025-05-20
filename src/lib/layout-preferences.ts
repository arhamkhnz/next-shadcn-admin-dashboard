import { cookies } from "next/headers";

export const allowedVariants = ["inset", "sidebar", "floating"] as const;
export type SidebarVariant = (typeof allowedVariants)[number];

export const allowedCollapsibles = ["icon", "offcanvas"] as const;
export type SidebarCollapsible = (typeof allowedCollapsibles)[number];

export async function getSidebarVariant(): Promise<SidebarVariant> {
  const cookieStore = await cookies();
  const value = cookieStore.get("sidebar_variant")?.value;
  return allowedVariants.includes(value as SidebarVariant) ? (value as SidebarVariant) : "inset";
}

export async function getSidebarCollapsible(): Promise<SidebarCollapsible> {
  const cookieStore = await cookies();
  const value = cookieStore.get("sidebar_collapsible")?.value;
  return allowedCollapsibles.includes(value as SidebarCollapsible) ? (value as SidebarCollapsible) : "icon";
}
