// Sidebar Variant
export const SIDEBAR_VARIANT_OPTIONS = [
  { label: "Inset", value: "inset" },
  { label: "Sidebar", value: "sidebar" },
  { label: "Floating", value: "floating" },
] as const;
export const SIDEBAR_VARIANT_VALUES = SIDEBAR_VARIANT_OPTIONS.map((v) => v.value);
export type SidebarVariant = (typeof SIDEBAR_VARIANT_VALUES)[number];

// Sidebar Collapsible
export const SIDEBAR_COLLAPSIBLE_OPTIONS = [
  { label: "Icon", value: "icon" },
  { label: "Offcanvas", value: "offcanvas" },
] as const;
export const SIDEBAR_COLLAPSIBLE_VALUES = SIDEBAR_COLLAPSIBLE_OPTIONS.map((v) => v.value);
export type SidebarCollapsible = (typeof SIDEBAR_COLLAPSIBLE_VALUES)[number];

// Content Layout
export const CONTENT_LAYOUT_OPTIONS = [
  { label: "Centered", value: "centered" },
  { label: "Full Width", value: "full-width" },
] as const;
export const CONTENT_LAYOUT_VALUES = CONTENT_LAYOUT_OPTIONS.map((v) => v.value);
export type ContentLayout = (typeof CONTENT_LAYOUT_VALUES)[number];

// Navbar Behavior
export const NAVBAR_BEHAVIOR_OPTIONS = [
  { label: "Sticky", value: "sticky" },
  { label: "Offcanvas", value: "offcanvas" },
] as const;
export const NAVBAR_BEHAVIOR_VALUES = NAVBAR_BEHAVIOR_OPTIONS.map((v) => v.value);
export type NavbarBehavior = (typeof NAVBAR_BEHAVIOR_VALUES)[number];
