"use client";
import * as React from "react";

import { useRouter } from "next/navigation";

import {
  Building2,
  ChartBar,
  Forklift,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LucideProps,
  MapPin,
  Search,
  ShoppingBag,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

type SearchItem = {
  group: string;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  path: string;
  disabled?: boolean;
};

const staticSearchItems: SearchItem[] = [
  { group: "Dashboards", icon: LayoutDashboard, label: "Default", path: "/admin/dashboard" },
  { group: "Dashboards", icon: ChartBar, label: "CRM", path: "/admin/dashboard/crm", disabled: true },
  { group: "Dashboards", icon: Gauge, label: "Analytics", path: "/admin/dashboard/analytics", disabled: true },
  { group: "Dashboards", icon: ShoppingBag, label: "E-Commerce", path: "/admin/dashboard/e-commerce", disabled: true },
  { group: "Dashboards", icon: GraduationCap, label: "Academy", path: "/admin/dashboard/academy", disabled: true },
  { group: "Dashboards", icon: Forklift, label: "Logistics", path: "/admin/dashboard/logistics", disabled: true },
  { group: "Authentication", label: "Login v1", path: "/auth/v1" },
  { group: "Authentication", label: "Login v2", path: "/auth/v2" },
  { group: "Authentication", label: "Register v1", path: "/auth/register/v1" },
  { group: "Authentication", label: "Register v2", path: "/auth/register/v2" },
];

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { users } = useUserStore();
  const { franchises } = useFranchiseStore();
  const { branches } = useBranchStore();

  const searchItems: SearchItem[] = React.useMemo(() => {
    const dynamicItems: SearchItem[] = [
      ...users.map(
        (user) =>
          ({
            group: "Users",
            icon: Users,
            label: user.name,
            path: `/admin/users/${user.id}`,
          }) as SearchItem,
      ),
      ...franchises.map(
        (franchise) =>
          ({
            group: "Franchises",
            icon: Building2,
            label: franchise.name,
            path: `/admin/franchises/${franchise.id}`,
          }) as SearchItem,
      ),
      ...branches.map(
        (branch) =>
          ({
            group: "Branches",
            icon: MapPin,
            label: branch.name,
            path: `/admin/branches/${branch.id}`,
          }) as SearchItem,
      ),
    ];
    return [...staticSearchItems, ...dynamicItems];
  }, [users, franchises, branches]);

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

  const handleSelect = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="link"
        className="text-muted-foreground !px-0 font-normal hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
        <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search dashboards, users, and more…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem
                      className="!py-1.5"
                      key={item.label}
                      onSelect={() => handleSelect(item.path)}
                      disabled={item.disabled}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
