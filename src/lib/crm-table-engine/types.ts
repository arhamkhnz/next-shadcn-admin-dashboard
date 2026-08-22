export const CRM_ENTITY_TYPES = ["lead", "contact", "company", "deal", "activity", "task"] as const;

export type CrmEntityType = (typeof CRM_ENTITY_TYPES)[number];

export type EntityTerminology = {
  singularLabel: string;
  pluralLabel: string;
};

export type OrganizationTerminologyConfig = Record<CrmEntityType, EntityTerminology>;

export type PipelineStage = {
  key: string;
  label: string;
  probability: number;
  isClosed?: boolean;
};

export type PipelineStageConfig = Record<"deal", PipelineStage[]>;

export type IndustryTemplateFieldDefinition = {
  entityType: CrmEntityType;
  systemName: string;
  displayLabel: string;
  type: CustomFieldType;
  description?: string;
  required?: boolean;
  visibleInTable?: boolean;
  visibleInForm?: boolean;
  width?: number;
  options?: SelectOption[];
  defaultValue?: CustomFieldValue;
};

export type IndustryTemplateDefinition = {
  id: string;
  name: string;
  description: string;
  useCase: string;
  entitiesAffected: CrmEntityType[];
  fieldsIncluded: number;
  fieldDefinitions: IndustryTemplateFieldDefinition[];
  terminology?: Partial<OrganizationTerminologyConfig>;
  pipelineStages?: PipelineStage[];
  savedViews?: SavedView[];
};

export const DEFAULT_TERMINOLOGY: OrganizationTerminologyConfig = {
  lead: { singularLabel: "Lead", pluralLabel: "Leads" },
  contact: { singularLabel: "Contact", pluralLabel: "Contacts" },
  company: { singularLabel: "Company", pluralLabel: "Companies" },
  deal: { singularLabel: "Deal", pluralLabel: "Deals" },
  activity: { singularLabel: "Activity", pluralLabel: "Activities" },
  task: { singularLabel: "Task", pluralLabel: "Tasks" },
};

export const CUSTOM_FIELD_TYPES = [
  "text",
  "long_text",
  "number",
  "currency",
  "percentage",
  "date",
  "date_time",
  "checkbox",
  "single_select",
  "multi_select",
  "email",
  "phone",
  "url",
] as const;

export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];

export const CUSTOM_FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: "Text",
  long_text: "Long text",
  number: "Number",
  currency: "Currency",
  percentage: "Percentage",
  date: "Date",
  date_time: "Date & time",
  checkbox: "Checkbox",
  single_select: "Single select",
  multi_select: "Multiple select",
  email: "Email",
  phone: "Phone",
  url: "URL",
};

export const SEARCHABLE_FIELD_TYPES: readonly CustomFieldType[] = [
  "text",
  "long_text",
  "email",
  "phone",
  "url",
  "single_select",
  "multi_select",
];

export const FILTERABLE_FIELD_TYPES: readonly CustomFieldType[] = [
  "number",
  "currency",
  "percentage",
  "date",
  "date_time",
  "checkbox",
  "single_select",
  "multi_select",
];

export type SelectOption = {
  id: string;
  label: string;
};

export type CustomFieldValue = string | number | boolean | string[] | null;

export type TableFieldKind = "core" | "custom";

export type TableField = {
  id: string;
  entityType: CrmEntityType;
  key: string;
  systemName: string;
  displayLabel: string;
  defaultLabel: string;
  description?: string;
  kind: TableFieldKind;
  type: CustomFieldType;
  options?: SelectOption[];
  defaultValue?: CustomFieldValue;
  isCore: boolean;
  isRequiredBySystem: boolean;
  required: boolean;
  visibleInTable: boolean;
  visibleInForm: boolean;
  searchable: boolean;
  sortable: boolean;
  position: number;
  width: number;
  createdAt?: string;
  updatedAt?: string;
  archivedAt: string | null;
};

export function isCustomField(field: TableField): field is TableField & { kind: "custom" } {
  return field.kind === "custom";
}

export function isActiveField(field: TableField): boolean {
  return !field.archivedAt;
}

export type SortDirection = "asc" | "desc";

export type SortRule = {
  fieldKey: string;
  direction: SortDirection;
};

export const FILTER_OPERATORS = [
  "equals",
  "notEquals",
  "contains",
  "in",
  "gt",
  "gte",
  "lt",
  "lte",
  "isEmpty",
  "isNotEmpty",
  "isTrue",
  "isFalse",
  "equalsMe",
  "isArchived",
  "isNotArchived",
] as const;

export type FilterOperator = (typeof FILTER_OPERATORS)[number];

export const FILTER_OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: "is",
  notEquals: "is not",
  contains: "contains",
  in: "is any of",
  gt: "greater than",
  gte: "greater than or equal",
  lt: "less than",
  lte: "less than or equal",
  isEmpty: "is empty",
  isNotEmpty: "is not empty",
  isTrue: "is checked",
  isFalse: "is unchecked",
  equalsMe: "is assigned to me",
  isArchived: "is archived",
  isNotArchived: "is not archived",
};

export type FilterRuleValue = string | number | boolean | string[];

export type FilterRule = {
  id: string;
  fieldKey: string | null;
  operator: FilterOperator;
  value?: FilterRuleValue;
};

export type SavedView = {
  id: string;
  name: string;
  entityType: CrmEntityType;
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  sortRules: SortRule[];
  filterRules: FilterRule[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type CrmEntityConfig = {
  entityType: CrmEntityType;
  singularLabel: string;
  pluralLabel: string;
  coreFields: TableField[];
  seedCustomFields?: TableField[];
  allowedCustomFieldTypes: readonly CustomFieldType[];
  defaultColumnOrder: string[];
  defaultVisibleColumns: string[];
  defaultSavedViews: SavedView[];
  searchableFields: string[];
  filterableFields: string[];
  sortableFields: string[];
};

export type ResolveFieldValue<TRecord> = (record: TRecord, fieldKey: string) => CustomFieldValue | undefined;

export function fieldHasValues<TRecord>(params: {
  records: TRecord[];
  fieldKey: string;
  resolveValue: ResolveFieldValue<TRecord>;
}): boolean {
  return params.records.some((record) => {
    const value = params.resolveValue(record, params.fieldKey);
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  });
}
