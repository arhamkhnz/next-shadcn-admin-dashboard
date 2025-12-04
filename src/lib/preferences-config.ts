export type PreferenceKey = "theme_mode" | "theme_preset";

export const PERSISTED_PREFERENCES: Record<PreferenceKey, boolean> = {
  theme_mode: false,
  theme_preset: false,
};

export const PREFERENCE_COOKIE_KEYS: Record<PreferenceKey, string> = {
  theme_mode: "theme_mode",
  theme_preset: "theme_preset",
};
