"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { type StoreApi, useStore } from "zustand";

import { type FontKey, fontRegistry } from "@/lib/fonts/registry";
import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/lib/preferences/layout";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES } from "@/lib/preferences/theme";
import { applyThemeMode, subscribeToSystemTheme } from "@/lib/preferences/theme-utils";

import { createPreferencesStore, type PreferencesState } from "./preferences-store";

const PreferencesStoreContext = createContext<StoreApi<PreferencesState> | null>(null);

const FONT_VALUES = Object.keys(fontRegistry) as FontKey[];

function getSafeValue<T extends string>(raw: string | null, allowed: readonly T[]): T | undefined {
  if (!raw) return undefined;
  return allowed.includes(raw as T) ? (raw as T) : undefined;
}

function readDomState(): Partial<PreferencesState> {
  const root = document.documentElement;

  const modeAttr = getSafeValue(root.getAttribute("data-theme-mode"), THEME_MODE_VALUES);
  const resolved = root.classList.contains("dark") ? "dark" : "light";

  return {
    themeMode: modeAttr ?? resolved,
    resolvedThemeMode: resolved,
    themePreset: getSafeValue(root.getAttribute("data-theme-preset"), THEME_PRESET_VALUES),
    font: getSafeValue(root.getAttribute("data-font"), FONT_VALUES),
    contentLayout: getSafeValue(root.getAttribute("data-content-layout"), CONTENT_LAYOUT_VALUES),
    navbarStyle: getSafeValue(root.getAttribute("data-navbar-style"), NAVBAR_STYLE_VALUES),
    sidebarVariant: getSafeValue(root.getAttribute("data-sidebar-variant"), SIDEBAR_VARIANT_VALUES),
    sidebarCollapsible: getSafeValue(root.getAttribute("data-sidebar-collapsible"), SIDEBAR_COLLAPSIBLE_VALUES),
  };
}

export const PreferencesStoreProvider = ({
  children,
  themeMode,
  themePreset,
  font,
  contentLayout,
  navbarStyle,
}: {
  children: React.ReactNode;
  themeMode: PreferencesState["themeMode"];
  themePreset: PreferencesState["themePreset"];
  font: PreferencesState["font"];
  contentLayout: PreferencesState["contentLayout"];
  navbarStyle: PreferencesState["navbarStyle"];
}) => {
  const [store] = useState<StoreApi<PreferencesState>>(() =>
    createPreferencesStore({ themeMode, themePreset, font, contentLayout, navbarStyle }),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    let unsubscribeMedia: () => void = () => undefined;

    const domState = readDomState();
    store.setState((prev) => ({ ...prev, ...domState, isSynced: true }));

    const applyFromMode = (mode: PreferencesState["themeMode"]) => {
      unsubscribeMedia();

      if (mode === "system") {
        const resolved = applyThemeMode("system");
        store.setState((prev) => ({ ...prev, resolvedThemeMode: resolved }));

        unsubscribeMedia = subscribeToSystemTheme((nextResolved) => {
          applyThemeMode("system");
          store.setState((prev) => ({ ...prev, resolvedThemeMode: nextResolved }));
        });
      } else {
        const resolved = applyThemeMode(mode);
        store.setState((prev) => ({ ...prev, resolvedThemeMode: resolved }));
      }
    };

    const startMode = domState.themeMode ?? store.getState().themeMode;
    applyFromMode(startMode);

    const unsubscribeTheme = store.subscribe(
      (state) => state.themeMode,
      (mode) => applyFromMode(mode),
    );

    return () => {
      unsubscribeMedia();
      unsubscribeTheme();
    };
  }, [store]);

  return <PreferencesStoreContext.Provider value={store}>{children}</PreferencesStoreContext.Provider>;
};

export const usePreferencesStore = <T,>(selector: (state: PreferencesState) => T): T => {
  const store = useContext(PreferencesStoreContext);
  if (!store) throw new Error("Missing PreferencesStoreProvider");
  return useStore(store, selector);
};
