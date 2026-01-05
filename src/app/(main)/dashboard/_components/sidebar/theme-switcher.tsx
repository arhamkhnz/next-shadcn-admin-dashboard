"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { applyThemeMode } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const THEME_CYCLE = ["light", "dark", "system"] as const;

const THEME_CONFIG = {
  light: { icon: Sun, label: "Light mode" },
  dark: { icon: Moon, label: "Dark mode" },
  system: { icon: Monitor, label: "System theme" },
} as const;

export function ThemeSwitcher() {
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const cycleTheme = async () => {
    const currentIndex = THEME_CYCLE.indexOf(themeMode);
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];

    applyThemeMode(nextTheme);
    setThemeMode(nextTheme);
    persistPreference("theme_mode", nextTheme);
  };

  const { icon: Icon, label } = THEME_CONFIG[themeMode];

  return (
    <Button size="icon" aria-label={`Current theme: ${label}. Click to cycle themes`} onClick={cycleTheme}>
      <Icon />
    </Button>
  );
}
