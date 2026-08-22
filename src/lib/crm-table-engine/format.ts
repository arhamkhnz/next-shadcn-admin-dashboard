import { format, parseISO } from "date-fns";

import { formatCurrency } from "@/lib/utils";

import type { CustomFieldType, TableField } from "./types";

export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function formatDateValue(value: string): string {
  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

export function formatDateTimeValue(value: string): string {
  try {
    return format(parseISO(value), "MMM d, yyyy h:mm a");
  } catch {
    return value;
  }
}

export function formatFieldValue(field: Pick<TableField, "type">, value: unknown): string {
  if (isEmptyValue(value)) return "";
  switch (field.type) {
    case "currency":
      return formatCurrency(Number(value), { noDecimals: true });
    case "percentage":
      return `${Number(value)}%`;
    case "number":
      return String(value);
    case "checkbox":
      return value === true ? "Yes" : "No";
    case "date":
      return typeof value === "string" ? formatDateValue(value) : String(value);
    case "date_time":
      return typeof value === "string" ? formatDateTimeValue(value) : String(value);
    case "multi_select":
      return Array.isArray(value) ? value.join(", ") : String(value);
    default:
      return String(value);
  }
}

export function isSearchableFieldType(type: CustomFieldType): boolean {
  return (
    type === "text" ||
    type === "long_text" ||
    type === "email" ||
    type === "phone" ||
    type === "url" ||
    type === "single_select" ||
    type === "multi_select"
  );
}

const URL_PATTERN = /^https?:\/\/[^\s]+\.[^\s]+$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFieldValue(
  field: Pick<TableField, "type" | "required" | "displayLabel" | "options">,
  value: unknown,
): string | null {
  const empty = isEmptyValue(value);

  if (field.required && empty) {
    return `${field.displayLabel} is required.`;
  }
  if (empty) return null;

  switch (field.type) {
    case "number":
    case "currency":
    case "percentage": {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return `${field.displayLabel} must be a number.`;
      return null;
    }
    case "email": {
      if (!EMAIL_PATTERN.test(String(value))) return `Enter a valid email address.`;
      return null;
    }
    case "url": {
      if (!URL_PATTERN.test(String(value).trim())) return `Enter a valid URL starting with http:// or https://.`;
      return null;
    }
    case "phone": {
      if (String(value).trim().length < 3) return `Enter a valid phone number.`;
      return null;
    }
    case "single_select": {
      const labels = (field.options ?? []).map((option) => option.label);
      if (!labels.includes(String(value))) return `Choose an option from the list.`;
      return null;
    }
    case "multi_select": {
      if (!Array.isArray(value)) return `Choose at least one option from the list.`;
      const labels = new Set((field.options ?? []).map((option) => option.label));
      if (value.some((entry) => !labels.has(entry))) return `Choose options from the list.`;
      return null;
    }
    case "date":
    case "date_time": {
      if (Number.isNaN(parseISO(String(value)).getTime())) return `Enter a valid date.`;
      return null;
    }
    default:
      return null;
  }
}
