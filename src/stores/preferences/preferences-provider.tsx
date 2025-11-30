"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { useStore, type StoreApi } from "zustand";

import { THEME_PRESET_VALUES } from "@/types/preferences/theme";

import { createPreferencesStore, PreferencesState } from "./preferences-store";

const PreferencesStoreContext = createContext<StoreApi<PreferencesState> | null>(null);

export const PreferencesStoreProvider = ({
  children,
  themeMode,
  themePreset,
}: {
  children: React.ReactNode;
  themeMode: PreferencesState["themeMode"];
  themePreset: PreferencesState["themePreset"];
}) => {
  const [store] = useState<StoreApi<PreferencesState>>(() => createPreferencesStore({ themeMode, themePreset }));

  useEffect(() => {
    const root = document.documentElement;

    const domMode = root.classList.contains("dark")
      ? ("dark" as PreferencesState["themeMode"])
      : ("light" as PreferencesState["themeMode"]);

    const domPresetAttr = root.getAttribute("data-theme-preset");

    const safePreset =
      domPresetAttr && THEME_PRESET_VALUES.includes(domPresetAttr as PreferencesState["themePreset"])
        ? (domPresetAttr as PreferencesState["themePreset"])
        : undefined;

    store.setState((prev) => ({
      ...prev,
      themeMode: domMode,
      themePreset: safePreset ?? prev.themePreset,
    }));
  }, [store]);

  return <PreferencesStoreContext.Provider value={store}>{children}</PreferencesStoreContext.Provider>;
};

export const usePreferencesStore = <T,>(selector: (state: PreferencesState) => T): T => {
  const store = useContext(PreferencesStoreContext);
  if (!store) throw new Error("Missing PreferencesStoreProvider");
  return useStore(store, selector);
};
