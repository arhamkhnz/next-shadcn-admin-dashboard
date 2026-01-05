"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { applyThemeMode } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function ThemeSwitcher() {
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const handleValueChange = async () => {
    const newTheme = resolvedThemeMode === "dark" ? "light" : "dark";
    applyThemeMode(newTheme);
    setThemeMode(newTheme);
    persistPreference("theme_mode", newTheme);
  };

  const icon = resolvedThemeMode === "light" ? <Moon /> : <Sun />;

  return (
    <Button size="icon" onClick={handleValueChange}>
      {icon}
    </Button>
  );
}
