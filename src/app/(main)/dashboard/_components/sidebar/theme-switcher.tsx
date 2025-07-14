"use client";

import { Moon, Sun } from "lucide-react";

import { usePreferencesStore } from "@/components/preferences-store-provider";
import { Button } from "@/components/ui/button";
import { updateThemeMode } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";

export function ThemeSwitcher() {
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const handleValueChange = async () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    updateThemeMode(newTheme);
    setThemeMode(newTheme);
    await setValueToCookie("theme_mode", newTheme);
  };

  return (
    <Button size="icon" onClick={handleValueChange}>
      {themeMode === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
