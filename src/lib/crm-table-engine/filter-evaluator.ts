import { isEmptyValue } from "./format";
import type { CustomFieldValue, FilterRule, ResolveFieldValue, TableField } from "./types";

export function comparableSearchText(value: CustomFieldValue | undefined): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(" ").toLowerCase();
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value).toLowerCase();
}

function compareNumbers(left: number, right: number): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function compareValues(left: CustomFieldValue | undefined, right: CustomFieldValue | undefined): number {
  const leftEmpty = isEmptyValue(left);
  const rightEmpty = isEmptyValue(right);
  if (leftEmpty && rightEmpty) return 0;
  if (leftEmpty) return -1;
  if (rightEmpty) return 1;

  const leftNumber = typeof left !== "boolean" && !Array.isArray(left) ? Number(left) : Number.NaN;
  const rightNumber = typeof right !== "boolean" && !Array.isArray(right) ? Number(right) : Number.NaN;
  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
    return compareNumbers(leftNumber, rightNumber);
  }
  return comparableSearchText(left).localeCompare(comparableSearchText(right));
}

export function evaluateFilterRule<TRecord>(
  record: TRecord,
  rule: FilterRule,
  resolveValue: ResolveFieldValue<TRecord>,
  contextUserId?: string,
): boolean {
  const value = rule.fieldKey ? resolveValue(record, rule.fieldKey) : undefined;

  switch (rule.operator) {
    case "isArchived":
      return Boolean((record as { archivedAt?: string | null }).archivedAt);
    case "isNotArchived":
      return !(record as { archivedAt?: string | null }).archivedAt;
    case "isEmpty":
      return isEmptyValue(value);
    case "isNotEmpty":
      return !isEmptyValue(value);
    case "isTrue":
      return value === true;
    case "isFalse":
      return value === false || value === undefined || value === null;
    case "equalsMe":
      return contextUserId !== undefined && typeof value === "string" && value === contextUserId;
    default:
      break;
  }

  const expected = rule.value;

  switch (rule.operator) {
    case "equals":
      return comparableSearchText(value) === comparableSearchText(expected as CustomFieldValue);
    case "notEquals":
      return comparableSearchText(value) !== comparableSearchText(expected as CustomFieldValue);
    case "contains":
      return comparableSearchText(value).includes(comparableSearchText(expected as CustomFieldValue));
    case "in": {
      const options = Array.isArray(expected) ? expected : [expected];
      const normalized = options.map((entry) => String(entry).toLowerCase());
      if (Array.isArray(value)) {
        return value.some((entry) => normalized.includes(String(entry).toLowerCase()));
      }
      return normalized.includes(comparableSearchText(value));
    }
    case "gt":
    case "gte":
    case "lt":
    case "lte": {
      const result = compareValues(value, expected as CustomFieldValue);
      if (rule.operator === "gt") return result > 0;
      if (rule.operator === "gte") return result >= 0;
      if (rule.operator === "lt") return result < 0;
      return result <= 0;
    }
    default:
      return true;
  }
}

export function evaluateFilterRules<TRecord>(
  record: TRecord,
  rules: FilterRule[],
  resolveValue: ResolveFieldValue<TRecord>,
  contextUserId?: string,
): boolean {
  return rules.every((rule) => evaluateFilterRule(record, rule, resolveValue, contextUserId));
}

export function recordMatchesSearch<TRecord>(
  record: TRecord,
  query: string,
  fields: TableField[],
  resolveValue: ResolveFieldValue<TRecord>,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return fields.some(
    (field) => field.searchable && comparableSearchText(resolveValue(record, field.key)).includes(normalized),
  );
}
