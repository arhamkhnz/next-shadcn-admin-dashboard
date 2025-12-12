import type { PreferenceValueMap } from "@/lib/preferences/preferences-config";

declare global {
  interface Window {
    __PREFERENCES__?: {
      themeMode?: PreferenceValueMap["theme_mode"];
      themePreset?: PreferenceValueMap["theme_preset"];
      contentLayout?: PreferenceValueMap["content_layout"];
      navbarStyle?: PreferenceValueMap["navbar_style"];
      sidebarVariant?: PreferenceValueMap["sidebar_variant"];
      sidebarCollapsible?: PreferenceValueMap["sidebar_collapsible"];
    };
  }
}
