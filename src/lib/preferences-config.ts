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
export type PreferenceKey =
  | "theme_mode"
  | "theme_preset"
  | "content_layout"
  | "navbar_style"
  | "sidebar_variant"
  | "sidebar_collapsible";

export type PreferencePersistence = "none" | "client-cookie" | "server-cookie" | "localStorage";

export const PREFERENCE_DEFAULTS = {
  theme_mode: "light",
  theme_preset: "default",
  content_layout: "centered",
  navbar_style: "sticky",
  sidebar_variant: "inset",
  sidebar_collapsible: "icon",
} as const satisfies {
  theme_mode: "light" | "dark";
  theme_preset: "default" | "brutalist" | "soft-pop" | "tangerine";
  content_layout: "centered" | "full-width";
  navbar_style: "sticky" | "scroll";
  sidebar_variant: "inset" | "sidebar" | "floating";
  sidebar_collapsible: "icon" | "offcanvas";
};

export const PREFERENCE_PERSISTENCE: Record<PreferenceKey, PreferencePersistence> = {
  theme_mode: "none",
  theme_preset: "none",
  content_layout: "none",
  navbar_style: "none",
  sidebar_variant: "server-cookie",
  sidebar_collapsible: "server-cookie",
};
