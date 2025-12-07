/**
 * PreferencePersistence controls how each preference is saved.
 *
 * "client-cookie"  → Cookie is written directly in the browser using document.cookie.
 *                    No server involvement.
 *
 * "server-cookie"  → Cookie is written using a Next.js Server Action
 *                    and stored through next/headers cookies().
 *
 * "localStorage"   → Value is saved in window.localStorage on the client.
 *
 * "none"           → Preference is not persisted anywhere and resets on refresh.
 */

import type { ContentLayout, NavbarStyle, SidebarVariant, SidebarCollapsible } from "./layout";
import type { ThemeMode, ThemePreset } from "./theme";

export type PreferencePersistence = "none" | "client-cookie" | "server-cookie" | "localStorage";

export type PreferenceValueMap = {
  theme_mode: ThemeMode;
  theme_preset: ThemePreset;
  content_layout: ContentLayout;
  navbar_style: NavbarStyle;
  sidebar_variant: SidebarVariant;
  sidebar_collapsible: SidebarCollapsible;
};

export type PreferenceKey = keyof PreferenceValueMap;

export const PREFERENCE_DEFAULTS: PreferenceValueMap = {
  theme_mode: "light",
  theme_preset: "default",
  content_layout: "centered",
  navbar_style: "sticky",
  sidebar_variant: "inset",
  sidebar_collapsible: "icon",
};

export const PREFERENCE_PERSISTENCE: Record<PreferenceKey, PreferencePersistence> = {
  theme_mode: "client-cookie",
  theme_preset: "client-cookie",
  content_layout: "client-cookie",
  navbar_style: "client-cookie",
  sidebar_variant: "client-cookie",
  sidebar_collapsible: "client-cookie",
};
