import {
  type CrmEntityConfig,
  type CrmEntityType,
  CUSTOM_FIELD_TYPES,
  type CustomFieldType,
  FILTERABLE_FIELD_TYPES,
  type FilterRule,
  type SavedView,
  type SortRule,
  type TableField,
} from "./types";

const SEED_STAMP = "2026-08-01T09:00:00.000Z";

export function createCoreFieldFactory(entityType: CrmEntityType) {
  return function coreField(
    overrides: Partial<TableField> & Pick<TableField, "systemName" | "displayLabel" | "type" | "position">,
  ): TableField {
    return {
      id: `core-${entityType}-${overrides.systemName}`,
      entityType,
      key: `${entityType}.${overrides.systemName}`,
      defaultLabel: overrides.displayLabel,
      description: undefined,
      kind: "core",
      options: undefined,
      defaultValue: undefined,
      isCore: true,
      isRequiredBySystem: false,
      required: false,
      visibleInTable: true,
      visibleInForm: false,
      searchable: false,
      sortable: true,
      width: 160,
      createdAt: SEED_STAMP,
      updatedAt: SEED_STAMP,
      archivedAt: null,
      ...overrides,
    };
  };
}

export function createSeedCustomFieldFactory(entityType: CrmEntityType) {
  const stamp = SEED_STAMP;
  return function seedCustomField(
    overrides: Partial<TableField> & Pick<TableField, "id" | "systemName" | "displayLabel" | "type" | "position">,
  ): TableField {
    return {
      entityType,
      key: `${entityType}.custom.${overrides.systemName}`,
      defaultLabel: overrides.displayLabel,
      description: undefined,
      kind: "custom",
      options: undefined,
      defaultValue: undefined,
      isCore: false,
      isRequiredBySystem: false,
      required: false,
      visibleInTable: true,
      visibleInForm: false,
      searchable: true,
      sortable: true,
      width: 176,
      createdAt: stamp,
      updatedAt: stamp,
      archivedAt: null,
      ...overrides,
    };
  };
}

export function createSeedViewFactory(entityType: CrmEntityType) {
  return function seedView(overrides: Partial<SavedView> & Pick<SavedView, "id" | "name">): SavedView {
    const filterRules = overrides.filterRules ?? [];
    return {
      entityType,
      columnOrder: [],
      columnVisibility: {},
      columnWidths: {},
      sortRules: [],
      isDefault: false,
      createdAt: SEED_STAMP,
      updatedAt: SEED_STAMP,
      archivedAt: null,
      ...overrides,
      filterRules: filterRules as FilterRule[],
    };
  };
}

export function activeOnlyRule(id: string): FilterRule {
  return { id, fieldKey: null, operator: "isNotArchived" };
}

export function archivedOnlyRule(id: string): FilterRule {
  return { id, fieldKey: null, operator: "isArchived" };
}

export function sortAsc(fieldKey: string): SortRule[] {
  return [{ fieldKey, direction: "asc" }];
}

export function sortDesc(fieldKey: string): SortRule[] {
  return [{ fieldKey, direction: "desc" }];
}

export function defineCrmEntityConfig(config: CrmEntityConfig): CrmEntityConfig {
  return config;
}

export function allCustomFieldTypes(): readonly CustomFieldType[] {
  return CUSTOM_FIELD_TYPES;
}

export function deriveCapabilityLists(fields: TableField[]): {
  searchableFields: string[];
  filterableFields: string[];
  sortableFields: string[];
} {
  return {
    searchableFields: fields.filter((field) => field.searchable).map((field) => field.key),
    filterableFields: fields.filter((field) => FILTERABLE_FIELD_TYPES.includes(field.type)).map((field) => field.key),
    sortableFields: fields.filter((field) => field.sortable).map((field) => field.key),
  };
}
