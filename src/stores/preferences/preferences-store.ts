/* eslint-disable */
import { createStore } from "zustand/vanilla";

import type { ContentLayout, NavbarStyle, SidebarVariant, SidebarCollapsible } from "@/types/preferences/layout";
import type { ThemeMode, ThemePreset } from "@/types/preferences/theme";

export type PreferencesState = {
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  contentLayout: ContentLayout;
  navbarStyle: NavbarStyle;
  sidebarVariant: SidebarVariant;
  sidebarCollapsible: SidebarCollapsible;
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setContentLayout: (layout: ContentLayout) => void;
  setNavbarStyle: (style: NavbarStyle) => void;
  setSidebarVariant: (variant: SidebarVariant) => void;
  setSidebarCollapsible: (mode: SidebarCollapsible) => void;
};

export const createPreferencesStore = (init?: Partial<PreferencesState>) =>
  createStore<PreferencesState>()((set) => ({
    themeMode: init?.themeMode ?? "light",
    themePreset: init?.themePreset ?? "default",
    contentLayout: init?.contentLayout ?? "centered",
    navbarStyle: init?.navbarStyle ?? "sticky",
    sidebarVariant: init?.sidebarVariant ?? "inset",
    sidebarCollapsible: init?.sidebarCollapsible ?? "offcanvas",
    setThemeMode: (mode) => set({ themeMode: mode }),
    setThemePreset: (preset) => set({ themePreset: preset }),
    setContentLayout: (layout) => set({ contentLayout: layout }),
    setNavbarStyle: (style) => set({ navbarStyle: style }),
    setSidebarVariant: (variant) => set({ sidebarVariant: variant }),
    setSidebarCollapsible: (mode) => set({ sidebarCollapsible: mode }),
  }));
