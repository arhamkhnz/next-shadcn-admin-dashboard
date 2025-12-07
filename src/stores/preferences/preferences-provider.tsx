"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { useStore, type StoreApi } from "zustand";

import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/lib/preferences/layout";
import { THEME_PRESET_VALUES } from "@/lib/preferences/theme";

import { createPreferencesStore, PreferencesState } from "./preferences-store";

const PreferencesStoreContext = createContext<StoreApi<PreferencesState> | null>(null);

function getSafeValue<T extends string>(raw: string | null, allowed: readonly T[]): T | undefined {
  if (!raw) return undefined;
  return allowed.includes(raw as T) ? (raw as T) : undefined;
}

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

    const safePreset = getSafeValue<PreferencesState["themePreset"]>(domPresetAttr, THEME_PRESET_VALUES);

    const safeContentLayout = getSafeValue<PreferencesState["contentLayout"]>(
      domContentLayoutAttr,
      CONTENT_LAYOUT_VALUES,
    );

    const safeNavbarStyle = getSafeValue<PreferencesState["navbarStyle"]>(domNavbarStyleAttr, NAVBAR_STYLE_VALUES);

    const safeSidebarVariant = getSafeValue<PreferencesState["sidebarVariant"]>(
      domSidebarVariantAttr,
      SIDEBAR_VARIANT_VALUES,
    );

    const safeSidebarCollapsible = getSafeValue<PreferencesState["sidebarCollapsible"]>(
      domSidebarCollapsibleAttr,
      SIDEBAR_COLLAPSIBLE_VALUES,
    );

    store.setState((prev) => ({
      ...prev,
      themeMode: domMode,
      themePreset: safePreset ?? prev.themePreset,
      contentLayout: safeContentLayout ?? prev.contentLayout,
      navbarStyle: safeNavbarStyle ?? prev.navbarStyle,
      sidebarVariant: safeSidebarVariant ?? prev.sidebarVariant,
      sidebarCollapsible: safeSidebarCollapsible ?? prev.sidebarCollapsible,
    }));

    store.setState({ bootstrapped: true });
  }, [store]);

  // NOTE: I personally don't like this guard, but keeping it for now while exploring SSR‑friendly ways to avoid flicker.
  // If you ever come across a clean solution that keeps SSR intact and removes UI flicker, feel free to suggest.
  const bootstrapped = useStore(store, (s) => s.bootstrapped);
  if (!bootstrapped) return null;

  return <PreferencesStoreContext.Provider value={store}>{children}</PreferencesStoreContext.Provider>;
};

export const usePreferencesStore = <T,>(selector: (state: PreferencesState) => T): T => {
  const store = useContext(PreferencesStoreContext);
  if (!store) throw new Error("Missing PreferencesStoreProvider");
  return useStore(store, selector);
};
