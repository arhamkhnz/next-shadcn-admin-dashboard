"use client";

import * as React from "react";

import { Check, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatFieldValue, isEmptyValue, validateFieldValue } from "@/lib/crm-table-engine/format";
import type { CustomFieldValue, TableField } from "@/lib/crm-table-engine/types";
import { cn } from "@/lib/utils";

const INPUT_LIKE_TYPES = new Set([
  "text",
  "long_text",
  "number",
  "currency",
  "percentage",
  "date",
  "date_time",
  "email",
  "phone",
  "url",
]);

function inputTypeFor(fieldType: TableField["type"]): string {
  if (fieldType === "date") return "date";
  if (fieldType === "date_time") return "datetime-local";
  if (fieldType === "email") return "email";
  if (fieldType === "phone") return "tel";
  if (fieldType === "url") return "url";
  if (fieldType === "number" || fieldType === "currency" || fieldType === "percentage") return "number";
  return "text";
}

function inputValueFor(field: TableField, value: CustomFieldValue | undefined): string {
  if (isEmptyValue(value)) return "";
  if (field.type === "date") return String(value).slice(0, 10);
  return String(value);
}

function parseDraft(field: TableField, draft: string): CustomFieldValue {
  switch (field.type) {
    case "number":
    case "currency":
    case "percentage":
      return draft.trim() === "" ? null : Number(draft);
    default:
      return draft.trim() === "" ? null : draft;
  }
}

function DisplayValue({ field, value }: { field: TableField; value: CustomFieldValue | undefined }) {
  if (isEmptyValue(value)) {
    return <span className="text-muted-foreground/50 text-sm">—</span>;
  }
  if (field.type === "multi_select" && Array.isArray(value)) {
    return <span className="truncate text-sm">{value.join(", ")}</span>;
  }
  return <span className="truncate text-sm">{formatFieldValue(field, value)}</span>;
}

export function EditableCustomCell({
  field,
  value,
  disabled = false,
  disabledReason,
  onCommit,
}: {
  field: TableField;
  value: CustomFieldValue | undefined;
  disabled?: boolean;
  disabledReason?: string;
  onCommit: (value: CustomFieldValue) => void;
}) {
  const [draftOpen, setDraftOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const startEdit = React.useCallback(() => {
    setDraft(inputValueFor(field, value));
    setError(null);
    setDraftOpen(true);
  }, [field, value]);

  const attemptCommit = React.useCallback(
    (rawDraft: string): boolean => {
      const parsed = parseDraft(field, rawDraft);
      const validationError = validateFieldValue(field, parsed);
      if (validationError) {
        setError(validationError);
        return false;
      }
      if (formatFieldValue(field, parsed) !== formatFieldValue(field, value)) {
        onCommit(parsed);
      }
      setDraftOpen(false);
      setError(null);
      return true;
    },
    [field, onCommit, value],
  );

  const cancelEdit = React.useCallback(() => {
    setDraftOpen(false);
    setError(null);
  }, []);

  if (disabled) {
    return (
      <div className="min-w-0 cursor-not-allowed" title={disabledReason}>
        <DisplayValue field={field} value={value} />
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <Switch
        aria-label={`${field.displayLabel} for this record`}
        checked={value === true}
        onCheckedChange={(checked) => onCommit(checked)}
      />
    );
  }

  if (field.type === "single_select") {
    return (
      <Select
        value={typeof value === "string" && !isEmptyValue(value) ? value : ""}
        onValueChange={(next) => onCommit(next === "__clear__" ? null : next)}
      >
        <SelectTrigger
          aria-label={`Edit ${field.displayLabel}`}
          className="border-transparent bg-transparent px-2 shadow-none hover:border-border hover:bg-muted/40 data-[size=default]:h-8"
          size="sm"
        >
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.id} value={option.label}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value="__clear__">
              <span className="flex items-center gap-2 text-muted-foreground">
                <X className="size-3" />
                Clear
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  if (field.type === "multi_select") {
    const selected = Array.isArray(value) ? value : [];
    const toggleOption = (label: string) => {
      const next = selected.includes(label) ? selected.filter((entry) => entry !== label) : [...selected, label];
      onCommit(next);
    };
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start gap-1 overflow-hidden px-2 font-normal"
            aria-label={`Edit ${field.displayLabel}`}
          >
            {selected.length > 0 ? (
              <span className="truncate">{selected.join(", ")}</span>
            ) : (
              <span className="text-muted-foreground/50">—</span>
            )}
            <ChevronDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-2">
          <div className="flex flex-col gap-1">
            {(field.options ?? []).map((option) => {
              const checked = selected.includes(option.label);
              return (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleOption(option.label)}
                  />
                  <span
                    aria-hidden
                    className={`flex size-4 items-center justify-center rounded border ${checked ? "bg-primary text-primary-foreground" : ""}`}
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

  if (INPUT_LIKE_TYPES.has(field.type)) {
    if (!draftOpen) {
      return (
        <button
          type="button"
          onClick={startEdit}
          onFocus={startEdit}
          aria-label={`Edit ${field.displayLabel}`}
          className="min-w-full max-w-full truncate rounded-md border-transparent px-2 py-1 text-left transition-colors hover:border-border hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <DisplayValue field={field} value={value} />
        </button>
      );
    }
    const resolvedInputType = inputTypeFor(field.type);
    return (
      <div className="relative min-w-0">
        <Input
          autoFocus
          type={resolvedInputType}
          value={draft}
          aria-invalid={Boolean(error)}
          aria-label={field.displayLabel}
          className={cn("h-8 px-2", error && "border-destructive")}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError(null);
          }}
          onBlur={() => {
            attemptCommit(draft);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              attemptCommit(draft);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancelEdit();
            }
          }}
        />
        {error ? <p className="absolute top-full left-0 z-10 mt-0.5 text-destructive text-xs">{error}</p> : null}
      </div>
    );
  }

  return <LongTextCell field={field} value={value} onCommit={onCommit} />;
}

function LongTextCell({
  field,
  value,
  onCommit,
}: {
  field: TableField;
  value: CustomFieldValue | undefined;
  onCommit: (value: CustomFieldValue) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setDraft(isEmptyValue(value) ? "" : String(value));
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Edit ${field.displayLabel}`}
          className="h-8 w-full justify-start px-2 font-normal"
        >
          {isEmptyValue(value) ? (
            <span className="text-muted-foreground/50">—</span>
          ) : (
            <span className="max-w-full truncate">{String(value)}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-2 p-3">
        <Textarea
          autoFocus
          rows={4}
          value={draft}
          aria-label={field.displayLabel}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={() => onCommit(draft.trim() === "" ? null : draft)}>
            <Check className="size-3.5" />
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
