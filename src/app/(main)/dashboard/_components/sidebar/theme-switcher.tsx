"use client";

import { useState } from "react";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateThemeMode } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";
import { ThemeMode } from "@/types/preferences";

export function ThemeSwitcher({ themeMode }: { themeMode: ThemeMode }) {
  const [localThemeMode, setLocalThemeMode] = useState(themeMode);

  const handleValueChange = async (key: string, value: any) => {
    updateThemeMode(value);

    await setValueToCookie(key, value);
  };

  return (
    <Button size="icon" onClick={() => handleValueChange("theme_mode", localThemeMode === "dark" ? "light" : "dark")}>
      {localThemeMode === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
