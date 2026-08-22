import { create } from "zustand";

import {
  type CrmEntityType,
  type CustomFieldType,
  type CustomFieldValue,
  DEFAULT_TERMINOLOGY,
  type EntityTerminology,
  type FilterRule,
  isActiveField,
  type OrganizationTerminologyConfig,
  type PipelineStage,
  type PipelineStageConfig,
  type ResolveFieldValue,
  type SavedView,
  type SelectOption,
  type SortRule,
  type TableField,
} from "./types";

export type CustomFieldDraftInput = {
  entityType: CrmEntityType;
  displayLabel: string;
  description?: string;
  type: CustomFieldType;
  required: boolean;
  visibleInTable: boolean;
  visibleInForm: boolean;
  width?: number;
  position?: number;
  options?: SelectOption[];
  defaultValue?: CustomFieldValue;
};

export type ViewPresentationPatch = {
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  columnWidths?: Record<string, number>;
  sortRules?: SortRule[];
};

export type CrmTableConfigState = {
  coreFields: Record<CrmEntityType, TableField[]>;
  customFields: TableField[];
  views: SavedView[];
  activeViewIds: Partial<Record<CrmEntityType, string>>;
  terminology: OrganizationTerminologyConfig;
  pipelineStages: PipelineStageConfig;
};

export type CrmTableConfigActions = {
  getFieldsForEntity: (entityType: CrmEntityType) => TableField[];
  getAllFieldsForEntity: (entityType: CrmEntityType) => TableField[];
  addCustomField: (input: CustomFieldDraftInput) => TableField;
  updateCustomField: (fieldId: string, patch: Partial<CustomFieldDraftInput>) => void;
  archiveField: (fieldId: string) => void;
  restoreField: (fieldId: string) => void;
  reorderFields: (entityType: CrmEntityType, orderedKeys: string[]) => void;
  moveField: (entityType: CrmEntityType, fieldKey: string, direction: "left" | "right") => void;
  setFieldVisibility: (fieldId: string, scope: "table" | "form", visible: boolean) => void;
  setFieldWidth: (fieldId: string, width: number) => void;
  renameFieldLabel: (fieldId: string, label: string) => void;
  restoreFieldDefaultLabel: (fieldId: string) => void;
  addOption: (fieldId: string, label: string) => void;
  updateOption: (fieldId: string, optionId: string, label: string) => void;
  removeOption: (fieldId: string, optionId: string) => void;
  getViewsForEntity: (entityType: CrmEntityType) => SavedView[];
  getActiveViewsForEntity: (entityType: CrmEntityType) => SavedView[];
  getActiveView: (entityType: CrmEntityType) => SavedView | null;
  setActiveView: (entityType: CrmEntityType, viewId: string) => void;
  createView: (params: { entityType: CrmEntityType; name: string; baseViewId?: string }) => SavedView | null;
  renameView: (viewId: string, name: string) => void;
  duplicateView: (viewId: string) => SavedView | null;
  updateViewFilters: (viewId: string, filterRules: FilterRule[]) => void;
  updateViewPresentation: (viewId: string, patch: ViewPresentationPatch) => void;
  setDefaultView: (viewId: string) => void;
  archiveView: (viewId: string) => void;
  restoreView: (viewId: string) => void;
  resetViewLayout: (viewId: string) => void;
  resetEntityLayout: (entityType: CrmEntityType) => void;
  setTerminology: (entityType: CrmEntityType, patch: Partial<EntityTerminology>) => void;
  applyIndustryTemplate: (template: IndustryTemplateDefinition) => IndustryTemplateApplyResult;
  getIndustryTemplatePreview: (template: IndustryTemplateDefinition) => IndustryTemplateApplyResult;
};

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

export type IndustryTemplateApplyResult = {
  fieldsToAdd: IndustryTemplateFieldDefinition[];
  labelsToChange: Array<{ entityType: CrmEntityType; singularLabel: string; pluralLabel: string }>;
  pipelineStagesToAdd: PipelineStage[];
  savedViewsToAdd: SavedView[];
};

export type CrmTableConfigStore = CrmTableConfigState & CrmTableConfigActions;

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowStamp(): string {
  return new Date().toISOString();
}

function applyFieldVisibility(
  field: TableField,
  fieldId: string,
  scope: "table" | "form",
  visible: boolean,
): TableField {
  if (field.id !== fieldId) return field;
  if (scope === "table") return { ...field, visibleInTable: visible, updatedAt: nowStamp() };
  return { ...field, visibleInForm: visible, updatedAt: nowStamp() };
}

export function slugifySystemName(label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug.length > 0 ? slug : "field";
}

function uniqueKey(params: { entityType: CrmEntityType; label: string; taken: Set<string> }): {
  key: string;
  systemName: string;
} {
  const base = slugifySystemName(params.label);
  let systemName = base;
  let suffix = 2;
  while (params.taken.has(`${params.entityType}.custom.${systemName}`)) {
    systemName = `${base}_${suffix}`;
    suffix += 1;
  }
  return { key: `${params.entityType}.custom.${systemName}`, systemName };
}

export type CrmTableConfigSeed = {
  coreFields: Partial<Record<CrmEntityType, TableField[]>>;
  customFields?: TableField[];
  views: SavedView[];
  terminology?: OrganizationTerminologyConfig;
};

export function createCrmTableConfigStore(seed: CrmTableConfigSeed) {
  const clonedCore = structuredClone(seed.coreFields) as Record<CrmEntityType, TableField[]>;
  const clonedCustom = structuredClone(seed.customFields ?? []);
  const clonedViews = structuredClone(seed.views);
  const seedViewsById = new Map(clonedViews.map((view) => [view.id, structuredClone(view)]));
  const seedCoreByEntity = Object.fromEntries(
    Object.entries(clonedCore).map(([entity, fields]) => [entity, structuredClone(fields)]),
  ) as Record<CrmEntityType, TableField[]>;
  const terminology = structuredClone(seed.terminology ?? DEFAULT_TERMINOLOGY);

  const initialState: CrmTableConfigState = {
    coreFields: clonedCore,
    customFields: clonedCustom,
    views: clonedViews,
    terminology,
    pipelineStages: {
      deal: [
        { key: "Discovery", label: "Discovery", probability: 10 },
        { key: "Qualified", label: "Qualified", probability: 25 },
        { key: "Proposal Sent", label: "Proposal Sent", probability: 45 },
        { key: "Negotiation", label: "Negotiation", probability: 70 },
        { key: "Closed Won", label: "Closed Won", probability: 100, isClosed: true },
        { key: "Closed Lost", label: "Closed Lost", probability: 0, isClosed: true },
      ],
    },
    activeViewIds: {},
  };

  return create<CrmTableConfigStore>()((set, get) => ({
    ...initialState,

    getFieldsForEntity: (entityType) =>
      [...(get().coreFields[entityType] ?? []), ...get().customFields.filter((f) => f.entityType === entityType)]
        .filter(isActiveField)
        .sort((a, b) => a.position - b.position),

    getAllFieldsForEntity: (entityType) =>
      [...(get().coreFields[entityType] ?? []), ...get().customFields.filter((f) => f.entityType === entityType)].sort(
        (a, b) => a.position - b.position,
      ),

    addCustomField: (input) => {
      const state = get();
      const taken = new Set([
        ...(state.coreFields[input.entityType] ?? []).map((f) => f.key),
        ...state.customFields.filter((f) => f.entityType === input.entityType).map((f) => f.key),
      ]);
      const { key, systemName } = uniqueKey({ entityType: input.entityType, label: input.displayLabel, taken });
      const existingPositions = [
        ...(state.coreFields[input.entityType] ?? []),
        ...state.customFields.filter((f) => f.entityType === input.entityType),
      ].map((f) => f.position);
      const maxPosition = existingPositions.length > 0 ? Math.max(...existingPositions) : -1;
      const stamp = nowStamp();
      const field: TableField = {
        id: createId("cf"),
        entityType: input.entityType,
        key,
        systemName,
        displayLabel: input.displayLabel.trim(),
        defaultLabel: input.displayLabel.trim(),
        description: input.description?.trim() || undefined,
        kind: "custom",
        type: input.type,
        options: input.options?.length ? input.options : undefined,
        defaultValue: input.defaultValue,
        isCore: false,
        isRequiredBySystem: false,
        required: input.required,
        visibleInTable: input.visibleInTable,
        visibleInForm: input.visibleInForm,
        searchable: true,
        sortable: true,
        position: input.position !== undefined ? input.position : maxPosition + 1,
        width: input.width ?? 176,
        createdAt: stamp,
        updatedAt: stamp,
        archivedAt: null,
      };
      set((prev) => ({ customFields: [...prev.customFields, field] }));
      return field;
    },

    updateCustomField: (fieldId, patch) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                ...(patch.displayLabel !== undefined ? { displayLabel: patch.displayLabel.trim() } : {}),
                ...(patch.description !== undefined ? { description: patch.description.trim() || undefined } : {}),
                ...(patch.type !== undefined ? { type: patch.type } : {}),
                ...(patch.required !== undefined ? { required: patch.required } : {}),
                ...(patch.visibleInTable !== undefined ? { visibleInTable: patch.visibleInTable } : {}),
                ...(patch.visibleInForm !== undefined ? { visibleInForm: patch.visibleInForm } : {}),
                ...(patch.width !== undefined ? { width: patch.width } : {}),
                ...(patch.options !== undefined ? { options: patch.options } : {}),
                ...(patch.defaultValue !== undefined ? { defaultValue: patch.defaultValue } : {}),
                updatedAt: nowStamp(),
              }
            : field,
        ),
      })),

    archiveField: (fieldId) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId && !field.archivedAt ? { ...field, archivedAt: nowStamp() } : field,
        ),
      })),

    restoreField: (fieldId) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId && field.archivedAt ? { ...field, archivedAt: null } : field,
        ),
      })),

    reorderFields: (entityType, orderedKeys) =>
      set((prev) => {
        const positionOf = new Map(orderedKeys.map((key, index) => [key, index]));
        const remap = (field: TableField): TableField => {
          if (field.entityType !== entityType) return field;
          const nextPosition = positionOf.get(field.key);
          return nextPosition === undefined ? field : { ...field, position: nextPosition };
        };
        return {
          coreFields: {
            ...prev.coreFields,
            [entityType]: (prev.coreFields[entityType] ?? []).map(remap),
          },
          customFields: prev.customFields.map(remap),
        };
      }),

    moveField: (entityType, fieldKey, direction) => {
      const state = get();
      const ordered = state.getFieldsForEntity(entityType).map((f) => f.key);
      const index = ordered.indexOf(fieldKey);
      if (index < 0) return;
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= ordered.length) return;
      const reordered = [...ordered];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, moved);
      state.reorderFields(entityType, reordered);
    },

    setFieldVisibility: (fieldId, scope, visible) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) => applyFieldVisibility(field, fieldId, scope, visible)),
        coreFields:
          scope === "table"
            ? (Object.fromEntries(
                Object.entries(prev.coreFields).map(([entity, fields]) => [
                  entity,
                  fields.map((field) => (field.id === fieldId ? { ...field, visibleInTable: visible } : field)),
                ]),
              ) as Record<CrmEntityType, TableField[]>)
            : (Object.fromEntries(
                Object.entries(prev.coreFields).map(([entity, fields]) => [
                  entity,
                  fields.map((field) => (field.id === fieldId ? { ...field, visibleInForm: visible } : field)),
                ]),
              ) as Record<CrmEntityType, TableField[]>),
      })),

    setFieldWidth: (fieldId, width) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId ? { ...field, width: Math.max(72, Math.min(640, Math.round(width))) } : field,
        ),
        coreFields: Object.fromEntries(
          Object.entries(prev.coreFields).map(([entity, fields]) => [
            entity,
            fields.map((field) =>
              field.id === fieldId ? { ...field, width: Math.max(72, Math.min(640, Math.round(width))) } : field,
            ),
          ]),
        ) as Record<CrmEntityType, TableField[]>,
      })),

    renameFieldLabel: (fieldId, label) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId ? { ...field, displayLabel: label.trim(), updatedAt: nowStamp() } : field,
        ),
        coreFields: Object.fromEntries(
          Object.entries(prev.coreFields).map(([entity, fields]) => [
            entity,
            fields.map((field) => (field.id === fieldId ? { ...field, displayLabel: label.trim() } : field)),
          ]),
        ) as Record<CrmEntityType, TableField[]>,
      })),

    restoreFieldDefaultLabel: (fieldId) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId ? { ...field, displayLabel: field.defaultLabel } : field,
        ),
        coreFields: Object.fromEntries(
          Object.entries(prev.coreFields).map(([entity, fields]) => [
            entity,
            fields.map((field) => (field.id === fieldId ? { ...field, displayLabel: field.defaultLabel } : field)),
          ]),
        ) as Record<CrmEntityType, TableField[]>,
      })),

    addOption: (fieldId, label) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                options: [...(field.options ?? []), { id: createId("opt"), label: label.trim() }],
                updatedAt: nowStamp(),
              }
            : field,
        ),
      })),

    updateOption: (fieldId, optionId, label) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                options: (field.options ?? []).map((option) =>
                  option.id === optionId ? { ...option, label: label.trim() } : option,
                ),
                updatedAt: nowStamp(),
              }
            : field,
        ),
      })),

    removeOption: (fieldId, optionId) =>
      set((prev) => ({
        customFields: prev.customFields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                options: (field.options ?? []).filter((option) => option.id !== optionId),
                updatedAt: nowStamp(),
              }
            : field,
        ),
      })),

    getViewsForEntity: (entityType) => get().views.filter((view) => view.entityType === entityType),

    getActiveViewsForEntity: (entityType) =>
      get()
        .views.filter((view) => view.entityType === entityType && !view.archivedAt)
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.createdAt.localeCompare(b.createdAt)),

    getActiveView: (entityType) => {
      const state = get();
      const views = state.getActiveViewsForEntity(entityType);
      if (views.length === 0) return null;
      const activeId = state.activeViewIds[entityType];
      const active = views.find((view) => view.id === activeId);
      if (active) return active;
      return views.find((view) => view.isDefault) ?? views[0];
    },

    setActiveView: (entityType, viewId) =>
      set((prev) => ({ activeViewIds: { ...prev.activeViewIds, [entityType]: viewId } })),

    createView: ({ entityType, name, baseViewId }) => {
      const state = get();
      const trimmed = name.trim();
      if (!trimmed) return null;
      const base =
        (baseViewId ? state.views.find((view) => view.id === baseViewId) : undefined) ??
        state.getActiveView(entityType) ??
        null;
      const stamp = nowStamp();
      const view: SavedView = {
        id: createId("view"),
        name: trimmed,
        entityType,
        columnOrder: base ? [...base.columnOrder] : [],
        columnVisibility: base ? { ...base.columnVisibility } : {},
        columnWidths: base ? { ...base.columnWidths } : {},
        sortRules: base ? structuredClone(base.sortRules) : [],
        filterRules: [],
        isDefault: false,
        createdAt: stamp,
        updatedAt: stamp,
        archivedAt: null,
      };
      set((prev) => ({
        views: [...prev.views, view],
        activeViewIds: { ...prev.activeViewIds, [entityType]: view.id },
      }));
      return view;
    },

    renameView: (viewId, name) =>
      set((prev) => ({
        views: prev.views.map((view) =>
          view.id === viewId ? { ...view, name: name.trim() || view.name, updatedAt: nowStamp() } : view,
        ),
      })),

    duplicateView: (viewId) => {
      const state = get();
      const source = state.views.find((view) => view.id === viewId);
      if (!source) return null;
      const stamp = nowStamp();
      const copy: SavedView = {
        ...structuredClone(source),
        id: createId("view"),
        name: `Copy of ${source.name}`,
        isDefault: false,
        createdAt: stamp,
        updatedAt: stamp,
        archivedAt: null,
      };
      set((prev) => ({ views: [...prev.views, copy] }));
      return copy;
    },

    updateViewFilters: (viewId, filterRules) =>
      set((prev) => ({
        views: prev.views.map((view) => (view.id === viewId ? { ...view, filterRules, updatedAt: nowStamp() } : view)),
      })),

    updateViewPresentation: (viewId, patch) =>
      set((prev) => ({
        views: prev.views.map((view) => (view.id === viewId ? { ...view, ...patch, updatedAt: nowStamp() } : view)),
      })),

    setDefaultView: (viewId) =>
      set((prev) => {
        const target = prev.views.find((view) => view.id === viewId);
        if (!target) return {};
        return {
          views: prev.views.map((view) =>
            view.entityType === target.entityType ? { ...view, isDefault: view.id === viewId } : view,
          ),
        };
      }),

    archiveView: (viewId) =>
      set((prev) => {
        const target = prev.views.find((view) => view.id === viewId);
        if (!target || target.isDefault) return {};
        const nextViews = prev.views.map((view) => (view.id === viewId ? { ...view, archivedAt: nowStamp() } : view));
        const fallback =
          nextViews
            .filter((view) => view.entityType === target.entityType && !view.archivedAt)
            .find((v) => v.isDefault) ??
          nextViews.filter((view) => view.entityType === target.entityType && !view.archivedAt)[0];
        const activeId = prev.activeViewIds[target.entityType];
        return {
          views: nextViews,
          activeViewIds:
            activeId === viewId && fallback
              ? { ...prev.activeViewIds, [target.entityType]: fallback.id }
              : prev.activeViewIds,
        };
      }),

    restoreView: (viewId) =>
      set((prev) => ({
        views: prev.views.map((view) => (view.id === viewId ? { ...view, archivedAt: null } : view)),
      })),

    resetViewLayout: (viewId) =>
      set((prev) => ({
        views: prev.views.map((view) => {
          if (view.id !== viewId) return view;
          const seed = seedViewsById.get(viewId);
          return {
            ...view,
            columnOrder: [],
            columnVisibility: {},
            columnWidths: {},
            sortRules: seed ? structuredClone(seed.sortRules) : [],
            updatedAt: nowStamp(),
          };
        }),
      })),

    resetEntityLayout: (entityType) =>
      set((prev) => {
        const seedFields = seedCoreByEntity[entityType] ?? [];
        const seedById = new Map(seedFields.map((field) => [field.id, field]));
        return {
          coreFields: {
            ...prev.coreFields,
            [entityType]: (prev.coreFields[entityType] ?? []).map((field) => {
              const seedField = seedById.get(field.id);
              if (!seedField) return { ...field, displayLabel: field.defaultLabel };
              return {
                ...field,
                displayLabel: seedField.displayLabel,
                width: seedField.width,
                visibleInTable: seedField.visibleInTable,
              };
            }),
          },
          views: prev.views.map((view) => {
            if (view.entityType !== entityType || view.archivedAt) return view;
            const seed = seedViewsById.get(view.id);
            return {
              ...view,
              columnOrder: [],
              columnVisibility: {},
              columnWidths: {},
              sortRules: seed ? structuredClone(seed.sortRules) : [],
              updatedAt: nowStamp(),
            };
          }),
        };
      }),

    setTerminology: (entityType, patch) =>
      set((prev) => ({
        terminology: {
          ...prev.terminology,
          [entityType]: { ...prev.terminology[entityType], ...patch },
        },
      })),

    getIndustryTemplatePreview: (template) => summarizeIndustryTemplate(get(), template),

    applyIndustryTemplate: (template) => {
      const summary = summarizeIndustryTemplate(get(), template);
      set((prev) => {
        const nextCustomFields = [...prev.customFields];
        for (const field of summary.fieldsToAdd) {
          nextCustomFields.push(createTemplateField(field));
        }

        const nextViews = [...prev.views];
        for (const view of summary.savedViewsToAdd) {
          nextViews.push(view);
        }

        return {
          customFields: nextCustomFields,
          views: nextViews,
          terminology: {
            ...prev.terminology,
            ...Object.fromEntries(
              summary.labelsToChange.map((label) => [
                label.entityType,
                { singularLabel: label.singularLabel, pluralLabel: label.pluralLabel },
              ]),
            ),
          },
          pipelineStages:
            summary.pipelineStagesToAdd.length > 0
              ? {
                  ...prev.pipelineStages,
                  deal: [...prev.pipelineStages.deal, ...summary.pipelineStagesToAdd],
                }
              : prev.pipelineStages,
        };
      });
      return summary;
    },
  }));
}

function createTemplateField(field: IndustryTemplateFieldDefinition): TableField {
  const stamp = nowStamp();
  const systemName = field.systemName.trim();
  return {
    id: `template-${field.entityType}-${systemName}`,
    entityType: field.entityType,
    key: `${field.entityType}.custom.${systemName}`,
    systemName,
    displayLabel: field.displayLabel,
    defaultLabel: field.displayLabel,
    description: field.description?.trim() || undefined,
    kind: "custom",
    type: field.type,
    options: field.options,
    defaultValue: field.defaultValue,
    isCore: false,
    isRequiredBySystem: false,
    required: field.required ?? false,
    visibleInTable: field.visibleInTable ?? true,
    visibleInForm: field.visibleInForm ?? true,
    searchable: true,
    sortable: true,
    position: 999,
    width: field.width ?? 176,
    createdAt: stamp,
    updatedAt: stamp,
    archivedAt: null,
  };
}

function summarizeIndustryTemplate(
  state: CrmTableConfigState,
  template: IndustryTemplateDefinition,
): IndustryTemplateApplyResult {
  const existingKeys = new Set([
    ...Object.values(state.coreFields)
      .flat()
      .map((field) => field.key),
    ...state.customFields.map((field) => field.key),
  ]);
  const existingViews = new Set(state.views.map((view) => view.id));
  const existingDealStages = new Set(state.pipelineStages.deal.map((stage) => stage.key));

  const fieldsToAdd = template.fieldDefinitions.filter(
    (field) => !existingKeys.has(`${field.entityType}.custom.${field.systemName}`),
  );
  const labelsToChange = Object.entries(template.terminology ?? {}).map(([entityType, labels]) => ({
    entityType: entityType as CrmEntityType,
    singularLabel: labels?.singularLabel ?? DEFAULT_TERMINOLOGY[entityType as CrmEntityType].singularLabel,
    pluralLabel: labels?.pluralLabel ?? DEFAULT_TERMINOLOGY[entityType as CrmEntityType].pluralLabel,
  }));
  const pipelineStagesToAdd = (template.pipelineStages ?? []).filter((stage) => !existingDealStages.has(stage.key));
  const savedViewsToAdd = (template.savedViews ?? []).filter((view) => !existingViews.has(view.id));

  return { fieldsToAdd, labelsToChange, pipelineStagesToAdd, savedViewsToAdd };
}

export type { ResolveFieldValue };
