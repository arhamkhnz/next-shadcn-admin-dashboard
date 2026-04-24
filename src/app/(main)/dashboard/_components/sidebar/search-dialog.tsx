"use client";
import * as React from "react";

import { useRouter } from "next/navigation";

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
import type { NavMainItem } from "@/navigation/sidebar/sidebar-items";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

type SearchItem = {
  group: string;
  label: string;
  url: string;
  icon?: NavMainItem["icon"];
  disabled?: boolean;
  newTab?: boolean;
};

const recommendations: SearchItem[] = [
  { group: "Dashboards", icon: LayoutDashboard, label: "Default", url: "/dashboard/default" },
  { group: "Dashboards", icon: ChartBar, label: "CRM", url: "/dashboard/crm" },
  { group: "Dashboards", icon: Gauge, label: "Analytics", url: "/dashboard/analytics" },
  { group: "Dashboards", icon: ShoppingBag, label: "E-Commerce", url: "/dashboard/coming-soon", disabled: true },
  { group: "Dashboards", icon: GraduationCap, label: "Academy", url: "/dashboard/coming-soon", disabled: true },
  { group: "Dashboards", icon: Forklift, label: "Logistics", url: "/dashboard/coming-soon", disabled: true },
  { group: "Authentication", label: "Login v1", url: "/auth/v1/login", newTab: true },
  { group: "Authentication", label: "Login v2", url: "/auth/v2/login", newTab: true },
  { group: "Authentication", label: "Register v1", url: "/auth/v1/register", newTab: true },
  { group: "Authentication", label: "Register v2", url: "/auth/v2/register", newTab: true },
];

const searchIndex: SearchItem[] = sidebarItems.flatMap((group) =>
  group.items.flatMap((item) => {
    if (item.subItems) {
      return item.subItems.map((sub) => ({
        group: group.label ?? "Other",
        label: sub.title,
        url: sub.url,
        icon: item.icon,
        disabled: sub.comingSoon,
        newTab: sub.newTab,
      }));
    }
    return [
      {
        group: group.label ?? "Other",
        label: item.title,
        url: item.url,
        icon: item.icon,
        disabled: item.comingSoon,
        newTab: item.newTab,
      },
    ];
  }),
);

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))];
  return groups.map((group) => ({ group, items: items.filter((item) => item.group === group) }));
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setQuery("");
      setDebouncedQuery("");
    }
  };

  const handleSelect = (item: SearchItem) => {
    if (item.disabled) return;
    handleOpenChange(false);
    if (item.newTab) {
      window.open(item.url, "_blank", "noreferrer");
    } else {
      router.push(item.url);
    }
  };

  const searchResults = React.useMemo(() => {
    if (!debouncedQuery.trim()) return null;
    const q = debouncedQuery.toLowerCase();
    return searchIndex.filter((item) => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q));
  }, [debouncedQuery]);

  const isSearching = query.trim() !== "" && debouncedQuery !== query;
  const showRecommendations = query.trim() === "";

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => (
      <React.Fragment key={group}>
        {index > 0 && <CommandSeparator />}
        <CommandGroup heading={group}>
          {groupItems.map((item) => (
            <CommandItem disabled={item.disabled} key={`${group}-${item.label}`} onSelect={() => handleSelect(item)}>
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </React.Fragment>
    ));

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
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search dashboards, users, and more…" value={query} onValueChange={setQuery} />
          <CommandList>
            {showRecommendations && renderGroups(recommendations)}
            {!showRecommendations && isSearching && (
              <p className="py-6 text-center text-sm text-muted-foreground">Searching…</p>
            )}
            {!showRecommendations && !isSearching && searchResults !== null && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                {renderGroups(searchResults)}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
