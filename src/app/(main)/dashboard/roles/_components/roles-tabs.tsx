import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { tabFilters } from "./roles-data";

export function RolesTabs() {
  return (
    <Tabs defaultValue="all" className="gap-0">
      <TabsList
        variant="line"
        className="h-16 w-full justify-start gap-8 overflow-x-auto rounded-none border-b px-4 md:px-6"
      >
        {tabFilters.map((filter) => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            className="h-full gap-2 px-1 data-active:text-primary data-active:after:bg-primary"
          >
            {filter.label}
            <Badge className="h-5 rounded-full px-2" variant="secondary">
              {filter.count}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
