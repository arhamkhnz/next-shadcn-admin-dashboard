import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const allowedVariants = ["inset", "sidebar", "floating"] as const;
export type SidebarVariant = (typeof allowedVariants)[number];

export const allowedCollapsibles = ["icon", "offcanvas"] as const;
export type SidebarCollapsible = (typeof allowedCollapsibles)[number];

export const allowedContentLayouts = ["centered", "full-width"] as const;
export type ContentLayout = (typeof allowedContentLayouts)[number];

export function getSidebarVariant(cookieStore: ReadonlyRequestCookies): SidebarVariant {
  const value = cookieStore.get("sidebar_variant")?.value;
  return allowedVariants.includes(value as SidebarVariant) ? (value as SidebarVariant) : "inset";
}

export function getSidebarCollapsible(cookieStore: ReadonlyRequestCookies): SidebarCollapsible {
  const value = cookieStore.get("sidebar_collapsible")?.value;
  return allowedCollapsibles.includes(value as SidebarCollapsible) ? (value as SidebarCollapsible) : "icon";
}

export function getContentLayout(cookieStore: ReadonlyRequestCookies): ContentLayout {
  const value = cookieStore.get("content_layout")?.value;
  return allowedContentLayouts.includes(value as ContentLayout) ? (value as ContentLayout) : "centered";
}