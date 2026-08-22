import {
  activeOnlyRule,
  createCoreFieldFactory,
  createSeedCustomFieldFactory,
  createSeedViewFactory,
  defineCrmEntityConfig,
  deriveCapabilityLists,
  sortAsc,
} from "../entity-config-factory";
import type { CrmEntityConfig, CustomFieldType } from "../types";

const coreField = createCoreFieldFactory("task");

export const TASK_CORE_FIELDS = [
  coreField({
    systemName: "title",
    displayLabel: "Task",
    type: "text",
    position: 0,
    width: 260,
    searchable: true,
    isRequiredBySystem: true,
    required: true,
  }),
  coreField({
    systemName: "status",
    displayLabel: "Status",
    type: "single_select",
    options: [
      { id: "opt-to-do", label: "To Do" },
      { id: "opt-in-progress", label: "In Progress" },
      { id: "opt-completed", label: "Completed" },
      { id: "opt-canceled", label: "Canceled" },
    ],
    position: 1,
    width: 140,
  }),
  coreField({
    systemName: "priority",
    displayLabel: "Priority",
    type: "single_select",
    options: [
      { id: "opt-low", label: "Low" },
      { id: "opt-medium", label: "Medium" },
      { id: "opt-high", label: "High" },
      { id: "opt-urgent", label: "Urgent" },
    ],
    position: 2,
    width: 120,
  }),
  coreField({
    systemName: "relatedTo",
    displayLabel: "Related To",
    type: "text",
    position: 3,
    width: 220,
    sortable: false,
  }),
  coreField({ systemName: "owner", displayLabel: "Owner", type: "text", position: 4, width: 160 }),
  coreField({ systemName: "dueAt", displayLabel: "Due Date", type: "date_time", position: 5, width: 180 }),
  coreField({
    systemName: "reminderAt",
    displayLabel: "Reminder",
    type: "date_time",
    position: 6,
    width: 170,
    visibleInTable: false,
  }),
  coreField({
    systemName: "outcome",
    displayLabel: "Outcome",
    type: "long_text",
    position: 7,
    width: 200,
    sortable: false,
  }),
  coreField({
    systemName: "updatedAt",
    displayLabel: "Last Updated",
    type: "date_time",
    position: 8,
    width: 170,
    visibleInTable: false,
  }),
];

const seedCustomField = createSeedCustomFieldFactory("task");

export const TASK_CUSTOM_FIELD_SEED = [
  seedCustomField({
    id: "cf-task-external-dependency",
    systemName: "external_dependency",
    displayLabel: "External Dependency",
    type: "long_text",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: false,
    position: 9,
    width: 200,
  }),
  seedCustomField({
    id: "cf-task-estimated-hours",
    systemName: "estimated_hours",
    displayLabel: "Estimated Hours",
    type: "number",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 10,
    width: 150,
  }),
];

const seedView = createSeedViewFactory("task");

export const TASK_SEED_VIEWS = [
  seedView({
    id: "view-task-all",
    name: "All Tasks",
    filterRules: [activeOnlyRule("rule-task-all-active")],
    sortRules: sortAsc("task.dueAt"),
    isDefault: true,
  }),
  seedView({
    id: "view-task-mine",
    name: "My Tasks",
    filterRules: [
      activeOnlyRule("rule-task-mine-active"),
      { id: "rule-task-mine-owner", fieldKey: "task.owner", operator: "equalsMe" },
    ],
    sortRules: sortAsc("task.dueAt"),
  }),
  seedView({
    id: "view-task-due-today",
    name: "Due Today",
    filterRules: [
      activeOnlyRule("rule-task-due-active"),
      { id: "rule-task-due-state", fieldKey: "task.dueState", operator: "equals", value: "Due Today" },
    ],
    sortRules: sortAsc("task.dueAt"),
  }),
  seedView({
    id: "view-task-upcoming",
    name: "Upcoming",
    filterRules: [
      activeOnlyRule("rule-task-upcoming-active"),
      { id: "rule-task-upcoming-state", fieldKey: "task.dueState", operator: "equals", value: "Upcoming" },
    ],
    sortRules: sortAsc("task.dueAt"),
  }),
  seedView({
    id: "view-task-overdue",
    name: "Overdue",
    filterRules: [
      activeOnlyRule("rule-task-overdue-active"),
      { id: "rule-task-overdue-state", fieldKey: "task.dueState", operator: "equals", value: "Overdue" },
    ],
    sortRules: sortAsc("task.dueAt"),
  }),
  seedView({
    id: "view-task-completed",
    name: "Completed",
    filterRules: [
      activeOnlyRule("rule-task-completed-active"),
      { id: "rule-task-completed-status", fieldKey: "task.status", operator: "equals", value: "Completed" },
    ],
    sortRules: [{ fieldKey: "task.dueAt", direction: "desc" }],
  }),
  seedView({
    id: "view-task-canceled",
    name: "Canceled",
    filterRules: [
      activeOnlyRule("rule-task-canceled-active"),
      { id: "rule-task-canceled-status", fieldKey: "task.status", operator: "equals", value: "Canceled" },
    ],
    sortRules: [{ fieldKey: "task.dueAt", direction: "desc" }],
  }),
  seedView({
    id: "view-task-unassigned",
    name: "Unassigned",
    filterRules: [
      activeOnlyRule("rule-task-unassigned-active"),
      { id: "rule-task-unassigned-owner", fieldKey: "task.owner", operator: "isEmpty" },
    ],
    sortRules: sortAsc("task.dueAt"),
  }),
];

const allFields = [...TASK_CORE_FIELDS, ...TASK_CUSTOM_FIELD_SEED];

const allowedTypes: readonly CustomFieldType[] = [
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
];

export const TASK_ENTITY_CONFIG: CrmEntityConfig = defineCrmEntityConfig({
  entityType: "task",
  singularLabel: "Task",
  pluralLabel: "Tasks",
  coreFields: TASK_CORE_FIELDS,
  seedCustomFields: TASK_CUSTOM_FIELD_SEED,
  allowedCustomFieldTypes: allowedTypes,
  defaultColumnOrder: [...allFields].sort((a, b) => a.position - b.position).map((f) => f.key),
  defaultVisibleColumns: allFields.filter((f) => f.visibleInTable).map((f) => f.key),
  defaultSavedViews: TASK_SEED_VIEWS,
  ...deriveCapabilityLists(allFields),
});
