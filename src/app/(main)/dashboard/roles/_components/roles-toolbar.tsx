import { SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RolesToolbar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <FilterSelect label="Access Level" value="All" options={["All", "Full Access", "High", "Medium", "Low"]} />
      <FilterSelect label="Role Type" value="All" options={["All", "System", "Custom"]} />
      <FilterSelect label="Status" value="Active" options={["Active", "Archived", "Draft"]} />
      <Button className="h-10 shrink-0 border-primary/30 text-primary" variant="outline">
        <SlidersHorizontal data-icon="inline-start" />
        More Filters
        <Badge className="ml-1 h-5 rounded-full bg-primary text-primary-foreground">1</Badge>
      </Button>
    </div>
  );
}

function FilterSelect({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <Select defaultValue={value}>
      <SelectTrigger className="h-10 min-w-40 shrink-0">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {label}: {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
