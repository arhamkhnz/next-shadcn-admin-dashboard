"use client";
"use no memo";

import type { Table } from "@tanstack/react-table";
import { ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { priorities } from "./data";

interface TaskPriorityFilterProps<TData> {
  table: Table<TData>;
}

export function TaskPriorityFilter<TData>({ table }: TaskPriorityFilterProps<TData>) {
  const column = table.getColumn("priority");

  if (!column) {
    return null;
  }

  const priorityColumn = column;
  const selectedValues = new Set(priorityColumn.getFilterValue() as string[]);

  function updateFilter(value: string) {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }

    const filterValues = Array.from(selectedValues);
    priorityColumn.setFilterValue(filterValues.length ? filterValues : undefined);
    table.setPageIndex(0);
  }

  function clearFilter() {
    priorityColumn.setFilterValue(undefined);
    table.setPageIndex(0);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("border-dashed", selectedValues.size > 0 && "border-solid bg-muted text-foreground")}
        >
          <ListFilter data-icon="inline-start" />
          Priority
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-50">
        <DropdownMenuGroup>
          {priorities.map((priority) => {
            const isSelected = selectedValues.has(priority.value);

            return (
              <DropdownMenuCheckboxItem
                key={priority.value}
                checked={isSelected}
                onCheckedChange={() => updateFilter(priority.value)}
                onSelect={(event) => event.preventDefault()}
              >
                <priority.icon className="text-muted-foreground" />
                {priority.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={clearFilter} className="justify-center text-center">
                <X />
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
