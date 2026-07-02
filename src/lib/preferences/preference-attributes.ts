"use client";

import type { PreferenceKey, PreferenceValueMap } from "./preferences-config";

type DomPreferenceKey = Exclude<PreferenceKey, "theme_mode">;

const PREFERENCE_ATTRIBUTES = {
  theme_preset: "data-theme-preset",
  font: "data-font",
  content_layout: "data-content-layout",
  navbar_style: "data-navbar-style",
  sidebar_variant: "data-sidebar-variant",
  sidebar_collapsible: "data-sidebar-collapsible",
} satisfies Record<DomPreferenceKey, `data-${string}`>;

export function applyPreferenceAttribute<K extends DomPreferenceKey>(key: K, value: PreferenceValueMap[K]): void {
  document.documentElement.setAttribute(PREFERENCE_ATTRIBUTES[key], value);
}
