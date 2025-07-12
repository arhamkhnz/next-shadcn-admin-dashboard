export const allowedThemeModes = ["light", "dark"] as const;
export type ThemeMode = (typeof allowedThemeModes)[number];

export const allowedThemePresets = ["default", "brutalist", "tangerine", "soft-pop"] as const;
export type ThemePreset = (typeof allowedThemePresets)[number];

export const allowedSidebarVariants = ["inset", "sidebar", "floating"] as const;
export type SidebarVariant = (typeof allowedSidebarVariants)[number];

export const allowedSidebarCollapsibles = ["icon", "offcanvas"] as const;
export type SidebarCollapsible = (typeof allowedSidebarCollapsibles)[number];

export const allowedContentLayouts = ["centered", "full-width"] as const;
export type ContentLayout = (typeof allowedContentLayouts)[number];
