"use client";
/* eslint-disable */
import { createContext, useContext, useState, useEffect } from "react";

import { useStore, type StoreApi } from "zustand";

import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/types/preferences/layout";
import { THEME_PRESET_VALUES } from "@/types/preferences/theme";

import { createPreferencesStore, PreferencesState } from "./preferences-store";

const PreferencesStoreContext = createContext<StoreApi<PreferencesState> | null>(null);

export const PreferencesStoreProvider = ({
  children,
  themeMode,
  themePreset,
  contentLayout,
  navbarStyle,
}: {
  children: React.ReactNode;
  themeMode: PreferencesState["themeMode"];
  themePreset: PreferencesState["themePreset"];
  contentLayout: PreferencesState["contentLayout"];
  navbarStyle: PreferencesState["navbarStyle"];
}) => {
  const [store] = useState<StoreApi<PreferencesState>>(() =>
    createPreferencesStore({ themeMode, themePreset, contentLayout, navbarStyle }),
  );

  useEffect(() => {
    const root = document.documentElement;

    const domMode = root.classList.contains("dark")
      ? ("dark" as PreferencesState["themeMode"])
      : ("light" as PreferencesState["themeMode"]);

    const domPresetAttr = root.getAttribute("data-theme-preset");
    const domContentLayoutAttr = root.getAttribute("data-content-layout");
    const domNavbarStyleAttr = root.getAttribute("data-navbar-style");
    const domSidebarVariantAttr = root.getAttribute("data-sidebar-variant");
    const domSidebarCollapsibleAttr = root.getAttribute("data-sidebar-collapsible");

    const safePreset =
      domPresetAttr && THEME_PRESET_VALUES.includes(domPresetAttr as PreferencesState["themePreset"])
        ? (domPresetAttr as PreferencesState["themePreset"])
        : undefined;

    const safeContentLayout =
      domContentLayoutAttr && CONTENT_LAYOUT_VALUES.includes(domContentLayoutAttr as PreferencesState["contentLayout"])
        ? (domContentLayoutAttr as PreferencesState["contentLayout"])
        : undefined;

    const safeNavbarStyle =
      domNavbarStyleAttr && NAVBAR_STYLE_VALUES.includes(domNavbarStyleAttr as PreferencesState["navbarStyle"])
        ? (domNavbarStyleAttr as PreferencesState["navbarStyle"])
        : undefined;

    const safeSidebarVariant =
      domSidebarVariantAttr &&
      SIDEBAR_VARIANT_VALUES.includes(domSidebarVariantAttr as PreferencesState["sidebarVariant"])
        ? (domSidebarVariantAttr as PreferencesState["sidebarVariant"])
        : undefined;

    const safeSidebarCollapsible =
      domSidebarCollapsibleAttr &&
      SIDEBAR_COLLAPSIBLE_VALUES.includes(domSidebarCollapsibleAttr as PreferencesState["sidebarCollapsible"])
        ? (domSidebarCollapsibleAttr as PreferencesState["sidebarCollapsible"])
        : undefined;

    store.setState((prev) => ({
      ...prev,
      themeMode: domMode,
      themePreset: safePreset ?? prev.themePreset,
      contentLayout: safeContentLayout ?? prev.contentLayout,
      navbarStyle: safeNavbarStyle ?? prev.navbarStyle,
      sidebarVariant: safeSidebarVariant ?? prev.sidebarVariant,
      sidebarCollapsible: safeSidebarCollapsible ?? prev.sidebarCollapsible,
    }));
  }, [store]);

  return <PreferencesStoreContext.Provider value={store}>{children}</PreferencesStoreContext.Provider>;
};

export const usePreferencesStore = <T,>(selector: (state: PreferencesState) => T): T => {
  const store = useContext(PreferencesStoreContext);
  if (!store) throw new Error("Missing PreferencesStoreProvider");
  return useStore(store, selector);
};
