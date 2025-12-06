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

export const PREFERENCE_PERSISTENCE: Record<PreferenceKey, PreferencePersistence> = {
  theme_mode: "none",
  theme_preset: "none",
  content_layout: "server-cookie",
  navbar_style: "server-cookie",
  sidebar_variant: "server-cookie",
  sidebar_collapsible: "server-cookie",
};
