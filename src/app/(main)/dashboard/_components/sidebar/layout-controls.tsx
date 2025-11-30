"use client";

import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { updateContentLayout, updateNavbarStyle } from "@/lib/layout-utils";
import { updateThemeMode, updateThemePreset } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import type { SidebarVariant, SidebarCollapsible, ContentLayout, NavbarStyle } from "@/types/preferences/layout";
import { THEME_PRESET_OPTIONS, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";

type LayoutControlsProps = {
  readonly variant: SidebarVariant;
  readonly collapsible: SidebarCollapsible;
  readonly contentLayout: ContentLayout;
  readonly navbarStyle: NavbarStyle;
};

export function LayoutControls(props: LayoutControlsProps) {
  const { variant, collapsible, contentLayout, navbarStyle } = props;

  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);

  const handleValueChange = async (key: string, value: any) => {
    if (key === "theme_mode") {
      updateThemeMode(value);
      setThemeMode(value as ThemeMode);
    }

    if (key === "theme_preset") {
      updateThemePreset(value);
      setThemePreset(value as ThemePreset);
    }

    if (key === "content_layout") {
      updateContentLayout(value);
    }

    if (key === "navbar_style") {
      updateNavbarStyle(value);
    }
    await setValueToCookie(key, value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h4 className="text-sm leading-none font-medium">Layout Settings</h4>
            <p className="text-muted-foreground text-xs">Customize your dashboard layout preferences.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Preset</Label>
              <Select value={themePreset} onValueChange={(value) => handleValueChange("theme_preset", value)}>
                <SelectTrigger size="sm" className="w-full text-xs">
                  <SelectValue placeholder="Preset" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_PRESET_OPTIONS.map((preset) => (
                    <SelectItem key={preset.value} className="text-xs" value={preset.value}>
                      <span
                        className="size-2.5 rounded-full"
                        style={{
                          backgroundColor: themeMode === "dark" ? preset.primary.dark : preset.primary.light,
                        }}
                      />
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Mode</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={themeMode}
                onValueChange={(value) => handleValueChange("theme_mode", value)}
              >
                <ToggleGroupItem value="light" aria-label="Toggle inset">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Toggle sidebar">
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Variant</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={variant}
                onValueChange={(value) => handleValueChange("sidebar_variant", value)}
              >
                <ToggleGroupItem value="inset" aria-label="Toggle inset">
                  Inset
                </ToggleGroupItem>
                <ToggleGroupItem value="sidebar" aria-label="Toggle sidebar">
                  Sidebar
                </ToggleGroupItem>
                <ToggleGroupItem value="floating" aria-label="Toggle floating">
                  Floating
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Navbar Style</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={navbarStyle}
                onValueChange={(value) => handleValueChange("navbar_style", value)}
              >
                <ToggleGroupItem value="sticky" aria-label="Toggle sticky">
                  Sticky
                </ToggleGroupItem>
                <ToggleGroupItem value="scroll" aria-label="Toggle scroll">
                  Scroll
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Collapsible</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={collapsible}
                onValueChange={(value) => handleValueChange("sidebar_collapsible", value)}
              >
                <ToggleGroupItem value="icon" aria-label="Toggle icon">
                  Icon
                </ToggleGroupItem>
                <ToggleGroupItem value="offcanvas" aria-label="Toggle offcanvas">
                  OffCanvas
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Content Layout</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={contentLayout}
                onValueChange={(value) => handleValueChange("content_layout", value)}
              >
                <ToggleGroupItem value="centered" aria-label="Toggle centered">
                  Centered
                </ToggleGroupItem>
                <ToggleGroupItem value="full-width" aria-label="Toggle full-width">
                  Full Width
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
