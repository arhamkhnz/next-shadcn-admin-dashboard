import { ListFilter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function RolesHeader() {
  return (
    <div className="border-b bg-card/30 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl tracking-tight">Roles</h1>
          <p className="text-muted-foreground text-sm">Manage roles and their permissions across the platform.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="h-10 sm:w-80 lg:w-96">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search roles..." />
          </InputGroup>
          <Button className="h-10" variant="outline">
            <ListFilter data-icon="inline-start" />
            Filter
          </Button>
          <Button className="h-10">
            <Plus data-icon="inline-start" />
            Create Role
          </Button>
        </div>
      </div>
    </div>
  );
}
