"use client";

import { Check, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";
import { cn } from "@/lib/utils";

export function formControlInputType(fieldType: TableField["type"]): string | undefined {
  if (fieldType === "date") return "date";
  if (fieldType === "date_time") return "datetime-local";
  if (fieldType === "email") return "email";
  if (fieldType === "phone") return "tel";
  if (fieldType === "url") return "url";
  if (["number", "currency", "percentage"].includes(fieldType)) return "number";
  if (fieldType === "text") return "text";
  return undefined;
}

function MultiSelectFormControl({
  id,
  field,
  selected,
  onChange,
}: {
  id: string;
  field: TableField;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (label: string) =>
    onChange(selected.includes(label) ? selected.filter((entry) => entry !== label) : [...selected, label]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          aria-label={field.displayLabel}
          className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-input/30"
        >
          {selected.length > 0 ? (
            <span className="truncate">{selected.join(", ")}</span>
          ) : (
            <span className="text-muted-foreground">Select options…</span>
          )}
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-2">
        <div className="flex flex-col gap-1">
          {(field.options ?? []).map((option) => {
            const checked = selected.includes(option.label);
            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
              >
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(option.label)} />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    checked && "bg-primary text-primary-foreground",
                  )}
                >
                  {checked ? <Check className="size-3" /> : null}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CustomFieldFormControl({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: TableField;
  value: CustomFieldValue;
  onChange: (value: CustomFieldValue) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <div className="flex h-9 items-center gap-2">
        <Switch
          id={id}
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
          aria-label={field.displayLabel}
        />
        <span className="text-muted-foreground text-sm">{value === true ? "Yes" : "No"}</span>
      </div>
    );
  }

  if (field.type === "single_select") {
    return (
      <Select value={typeof value === "string" && value ? value : ""} onValueChange={(next) => onChange(next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={`Select ${field.displayLabel.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.id} value={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  if (field.type === "multi_select") {
    const selected = Array.isArray(value) ? value : [];
    return <MultiSelectFormControl id={id} field={field} selected={selected} onChange={onChange} />;
  }

  if (field.type === "long_text") {
    return (
      <Textarea
        id={id}
        rows={3}
        value={typeof value === "string" && value.length > 0 ? value : ""}
        placeholder={field.description ?? `Enter ${field.displayLabel.toLowerCase()}`}
        onChange={(event) => onChange(event.target.value === "" ? null : event.target.value)}
      />
    );
  }

  const inputType = formControlInputType(field.type);
  const stringValue = typeof value === "string" || typeof value === "number" ? String(value) : "";

  return (
    <Input
      id={id}
      type={inputType}
      value={stringValue}
      placeholder={
        ["number", "currency", "percentage"].includes(field.type)
          ? "0"
          : (field.description ?? `Enter ${field.displayLabel.toLowerCase()}`)
      }
      onChange={(event) => {
        const raw = event.target.value;
        if (raw === "") {
          onChange(null);
          return;
        }
        onChange(["number", "currency", "percentage"].includes(field.type) ? Number(raw) : raw);
      }}
    />
  );
}

export function emptyValueForType(fieldType: TableField["type"], defaultValue?: CustomFieldValue): CustomFieldValue {
  if (defaultValue !== undefined) return defaultValue;
  if (fieldType === "checkbox") return false;
  if (fieldType === "multi_select") return [];
  return null;
}
