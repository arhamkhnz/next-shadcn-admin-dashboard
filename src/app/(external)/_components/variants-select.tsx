import { ArrowUpRight, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const variants = [
  {
    name: "Radix UI",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
  },
  {
    name: "Base UI",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui",
  },
  {
    name: "React Aria",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-aria",
  },
  {
    name: "TanStack Start",
    repository: "https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard",
  },
];

export function VariantsSelect() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Variants
          <ChevronDown aria-hidden="true" data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="start">
        <DropdownMenuLabel>Choose a stack</DropdownMenuLabel>
        <DropdownMenuGroup>
          {variants.map((variant) => (
            <DropdownMenuItem asChild key={variant.name}>
              <a href={variant.repository} target="_blank" rel="noreferrer">
                {variant.name}
                <ArrowUpRight aria-hidden="true" className="ml-auto" />
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
