"use client";
import * as React from "react";

import { ChartBar, Forklift, Gauge, GraduationCap, LayoutDashboard, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Dashboards", icon: LayoutDashboard, label: "Default" },
  { group: "Dashboards", icon: ChartBar, label: "CRM" },
  { group: "Dashboards", icon: Gauge, label: "Analytics" },
  { group: "Dashboards", icon: ShoppingBag, label: "E-Commerce", disabled: true },
  { group: "Dashboards", icon: GraduationCap, label: "Academy", disabled: true },
  { group: "Dashboards", icon: Forklift, label: "Logistics", disabled: true },
  { group: "Authentication", label: "Login v1" },
  { group: "Authentication", label: "Login v2" },
  { group: "Authentication", label: "Register v1" },
  { group: "Authentication", label: "Register v2" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const groups = [...new Set(searchItems.map((item) => item.group))];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="link"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
      >
        <Search data-icon="inline-start" />
        Search
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search dashboards, users, and more…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group, index) => (
              <React.Fragment key={group}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {searchItems
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <CommandItem
                        disabled={item.disabled}
                        key={item.label}
                        onSelect={() => {
                          if (!item.disabled) {
                            setOpen(false);
                          }
                        }}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
