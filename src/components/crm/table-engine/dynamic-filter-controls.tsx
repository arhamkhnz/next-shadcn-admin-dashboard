"use client";

import { Check, ChevronDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FILTER_OPERATOR_LABELS, type FilterOperator, type TableField } from "@/lib/crm-table-engine/types";

function operatorsForType(fieldType: TableField["type"]): FilterOperator[] {
  if (fieldType === "checkbox") return CHECKBOX_OPERATORS;
  if (fieldType === "single_select") return SINGLE_SELECT_OPERATORS;
  if (fieldType === "multi_select") return MULTI_SELECT_OPERATORS;
  if (fieldType === "date" || fieldType === "date_time") return DATE_OPERATORS;
  return NUMERIC_OPERATORS;
}

export type ActiveDynamicFilter = {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: TableField["type"];
  options?: { id: string; label: string }[];
  operator: FilterOperator;
  value?: string | number | string[];
};

const NUMERIC_OPERATORS = ["equals", "gt", "gte", "lt", "lte"] as FilterOperator[];
const DATE_OPERATORS = ["equals", "gte", "lte"] as FilterOperator[];
const CHECKBOX_OPERATORS = ["isTrue", "isFalse"] as FilterOperator[];
const SINGLE_SELECT_OPERATORS = ["equals", "notEquals"] as FilterOperator[];
const MULTI_SELECT_OPERATORS = ["in"] as FilterOperator[];

export function AddCustomFilterMenu({
  fields,
  disabledKeys,
  onAdd,
}: {
  fields: TableField[];
  disabledKeys: Set<string>;
  onAdd: (field: TableField) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
          <Plus className="size-3.5" />
          Add Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Custom Fields</DropdownMenuLabel>
        {fields.length === 0 ? (
          <DropdownMenuItem disabled>No filterable custom fields</DropdownMenuItem>
        ) : (
          fields.map((field) => (
            <DropdownMenuItem key={field.id} disabled={disabledKeys.has(field.key)} onClick={() => onAdd(field)}>
              {field.displayLabel}
            </DropdownMenuItem>
          ))
        )}
        {fields.length > 0 ? <DropdownMenuSeparator /> : null}
        <p className="px-2 py-1.5 text-muted-foreground text-xs">
          Number, currency, percentage, date, checkbox and select custom fields can be filtered.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MultiSelectValuePicker({
  filter,
  onChange,
}: {
  filter: ActiveDynamicFilter;
  onChange: (values: string[]) => void;
}) {
  const selected = Array.isArray(filter.value) ? filter.value : [];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 max-w-40 justify-start font-normal text-xs">
          {selected.length > 0 ? (
            <span className="truncate">{selected.join(", ")}</span>
          ) : (
            <span className="text-muted-foreground">Any of…</span>
          )}
          <ChevronDown className="ml-auto size-3 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="flex flex-col gap-1">
          {(filter.options ?? []).map((option) => {
            const checked = selected.includes(option.label);
            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
              >
                <span
                  aria-hidden
                  className={`flex size-4 items-center justify-center rounded border ${checked ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {checked ? <Check className="size-3" /> : null}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() =>
                    onChange(checked ? selected.filter((entry) => entry !== option.label) : [...selected, option.label])
                  }
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterValueEditor({
  filter,
  onPatch,
}: {
  filter: ActiveDynamicFilter;
  onPatch: (patch: Partial<ActiveDynamicFilter>) => void;
}) {
  if (filter.fieldType === "checkbox") {
    return null;
  }
  if (filter.fieldType === "multi_select") {
    return (
      <MultiSelectValuePicker
        filter={filter}
        onChange={(values) => onPatch({ value: values.length > 0 ? values.join(",") : undefined })}
      />
    );
  }
  if (filter.fieldType === "single_select") {
    return (
      <Select value={String(filter.value ?? "")} onValueChange={(next) => onPatch({ value: next })}>
        <SelectTrigger className="h-7 w-fit gap-1 border-none px-1 text-xs shadow-none">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(filter.options ?? []).map((option) => (
              <SelectItem key={option.id} value={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  if (filter.fieldType === "date") {
    const stringValue = typeof filter.value === "string" ? filter.value : "";
    return (
      <Input
        type="date"
        className="h-7 w-32 text-xs"
        aria-label={`${filter.fieldLabel} date`}
        value={stringValue}
        onChange={(event) => onPatch({ value: event.target.value })}
      />
    );
  }
  const numericValue = typeof filter.value === "number" ? String(filter.value) : "";
  return (
    <Input
      type="number"
      className="h-7 w-24 text-xs"
      aria-label={`${filter.fieldLabel} value`}
      value={numericValue}
      onChange={(event) => onPatch({ value: event.target.value === "" ? undefined : Number(event.target.value) })}
    />
  );
}

export function DynamicFilterControl({
  filter,
  onPatch,
  onRemove,
}: {
  filter: ActiveDynamicFilter;
  onPatch: (patch: Partial<ActiveDynamicFilter>) => void;
  onRemove: () => void;
}) {
  const operators = operatorsForType(filter.fieldType);

  return (
    <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1">
      <span className="max-w-36 truncate font-medium text-xs">{filter.fieldLabel}</span>
      {operators.length > 1 ? (
        <Select
          value={filter.operator}
          onValueChange={(next) =>
            onPatch({
              operator: next as FilterOperator,
              ...(next === "isTrue" || next === "isFalse" ? { value: undefined } : {}),
            })
          }
        >
          <SelectTrigger
            className="h-7 w-fit gap-1 border-none px-1 text-xs shadow-none"
            aria-label={`${filter.fieldLabel} operator`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {operators.map((operator) => (
                <SelectItem key={operator} value={operator}>
                  {FILTER_OPERATOR_LABELS[operator]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <span className="text-muted-foreground text-xs">{FILTER_OPERATOR_LABELS[filter.operator]}</span>
      )}

      <FilterValueEditor filter={filter} onPatch={onPatch} />
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-6"
        aria-label={`Remove ${filter.fieldLabel} filter`}
        onClick={onRemove}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}

export function toFilterRuleValue(
  value: string | number | string[] | undefined,
): string | number | string[] | undefined {
  if (value === undefined || value === "") return undefined;
  return value;
}
