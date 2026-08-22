import z from "zod";

import type { CustomFieldValue } from "./types";

export const customFieldValueSchema = z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()]);

export type CustomFieldValueRecord = Record<string, z.infer<typeof customFieldValueSchema>>;

export function toCustomFieldValue(value: unknown): CustomFieldValue {
  if (value === undefined) return null;
  return value as CustomFieldValue;
}

export function isEmptyCustomValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}
