import {
  Bookmark,
  ChevronDown,
  Download,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  SquareUserRound,
  Users as UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

function FilterButton({ icon: Icon, label }: { icon: typeof UsersIcon; label: string }) {
  return (
    <Button
      className="h-11 min-w-0 justify-between rounded-lg border-border/70 bg-background/40 px-4 text-foreground/85 text-sm shadow-none hover:bg-muted/50"
      size="sm"
      variant="outline"
    >
      <span className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        {label}
      </span>
      <span className="flex items-center gap-2 text-muted-foreground">
        All
        <ChevronDown className="size-4" />
      </span>
    </Button>
  );
}

function ToolbarButton({ icon: Icon, label }: { icon: typeof Settings2; label: string }) {
  return (
    <Button
      className="h-11 rounded-lg border-border/70 bg-background/40 px-4 text-foreground/85 text-sm shadow-none hover:bg-muted/50"
      size="sm"
      variant="outline"
    >
      <Icon className="size-4 text-muted-foreground" />
      {label}
    </Button>
  );
}

export function UsersHeader() {
  return (
    <>
      <header className="border-border/60 border-b px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1">
            <h1 className="text-balance font-semibold text-3xl tracking-tight">Users</h1>
            <p className="max-w-xl text-muted-foreground text-sm">Manage your organization members and their access.</p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[calc(100%-34rem)] xl:items-end">
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="w-full lg:max-w-[360px]">
                <InputGroup className="h-11 rounded-lg border-border/70 bg-background/40">
                  <InputGroupAddon align="inline-start" className="pl-3 text-muted-foreground">
                    <Search className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    className="h-11 text-sm placeholder:text-muted-foreground/75"
                    placeholder="Search users..."
                  />
                  <InputGroupAddon align="inline-end" className="pr-3">
                    <Kbd className="h-6 rounded-md border-border/60 bg-muted/50 px-1.5 text-[11px] text-muted-foreground">
                      ⌘K
                    </Kbd>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ToolbarButton icon={SlidersHorizontal} label="Hide" />
                <ToolbarButton icon={Settings2} label="Customize" />
                <ToolbarButton icon={Download} label="Export" />
                <Button className="h-11 rounded-lg px-4 text-sm shadow-none" size="sm">
                  <Plus className="size-4" />
                  Add User
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-border/60 border-b px-5 py-4 md:px-6">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <FilterButton icon={UsersIcon} label="Role" />
          <FilterButton icon={SquareUserRound} label="Team" />
          <FilterButton icon={Settings2} label="Status" />
          <FilterButton icon={ShieldCheck} label="2FA" />
          <Button
            className="h-11 rounded-lg px-3 text-muted-foreground text-sm shadow-none hover:bg-muted/50"
            variant="ghost"
          >
            <span className="text-lg leading-none">×</span>
            Clear all
          </Button>
        </div>

        <Button
          className="ml-auto h-11 min-w-0 rounded-lg border-border/70 bg-background/40 px-4 text-foreground/85 text-sm shadow-none hover:bg-muted/50"
          size="sm"
          variant="outline"
        >
          <Bookmark className="size-4 text-muted-foreground" />
          Saved views
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </>
  );
}
