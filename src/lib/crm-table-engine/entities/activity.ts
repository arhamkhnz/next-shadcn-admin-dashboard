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

const coreField = createCoreFieldFactory("activity");

export const ACTIVITY_CORE_FIELDS = [
  coreField({
    systemName: "title",
    displayLabel: "Activity",
    type: "text",
    position: 0,
    width: 260,
    searchable: true,
    isRequiredBySystem: true,
    required: true,
  }),
  coreField({ systemName: "type", displayLabel: "Type", type: "single_select", position: 1, width: 130 }),
  coreField({
    systemName: "relatedTo",
    displayLabel: "Related To",
    type: "text",
    position: 2,
    width: 220,
    sortable: false,
  }),
  coreField({ systemName: "owner", displayLabel: "Owner", type: "text", position: 3, width: 160 }),
  coreField({ systemName: "scheduledAt", displayLabel: "Scheduled", type: "date_time", position: 4, width: 180 }),
  coreField({
    systemName: "status",
    displayLabel: "Status",
    type: "single_select",
    options: [
      { id: "opt-scheduled", label: "Scheduled" },
      { id: "opt-to-do", label: "To Do" },
      { id: "opt-in-progress", label: "In Progress" },
      { id: "opt-completed", label: "Completed" },
      { id: "opt-canceled", label: "Canceled" },
    ],
    position: 5,
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
    position: 6,
    width: 120,
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
    systemName: "createdAt",
    displayLabel: "Created",
    type: "date",
    position: 8,
    width: 130,
    visibleInTable: false,
  }),
];

const seedCustomField = createSeedCustomFieldFactory("activity");

export const ACTIVITY_CUSTOM_FIELD_SEED = [
  seedCustomField({
    id: "cf-activity-location",
    systemName: "location",
    displayLabel: "Location",
    type: "text",
    required: false,
    visibleInTable: false,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 9,
    width: 170,
  }),
  seedCustomField({
    id: "cf-activity-follow-up-required",
    systemName: "follow_up_required",
    displayLabel: "Follow-up Required",
    type: "checkbox",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: false,
    sortable: true,
    position: 10,
    width: 130,
  }),
];

const seedView = createSeedViewFactory("activity");

export const ACTIVITY_SEED_VIEWS = [
  seedView({
    id: "view-activity-all",
    name: "All Activities",
    filterRules: [activeOnlyRule("rule-activity-all-active")],
    sortRules: [{ fieldKey: "activity.scheduledAt", direction: "desc" }],
    isDefault: true,
  }),
  seedView({
    id: "view-activity-mine",
    name: "My Activities",
    filterRules: [
      activeOnlyRule("rule-activity-mine-active"),
      { id: "rule-activity-mine-owner", fieldKey: "activity.owner", operator: "equalsMe" },
    ],
    sortRules: [{ fieldKey: "activity.scheduledAt", direction: "asc" }],
  }),
  seedView({
    id: "view-activity-upcoming",
    name: "Upcoming",
    filterRules: [
      activeOnlyRule("rule-activity-upcoming-active"),
      { id: "rule-activity-upcoming-state", fieldKey: "activity.scheduleState", operator: "equals", value: "Upcoming" },
    ],
    sortRules: sortAsc("activity.scheduledAt"),
  }),
  seedView({
    id: "view-activity-due-today",
    name: "Due Today",
    filterRules: [
      activeOnlyRule("rule-activity-due-active"),
      { id: "rule-activity-due-state", fieldKey: "activity.scheduleState", operator: "equals", value: "Due Today" },
    ],
    sortRules: sortAsc("activity.scheduledAt"),
  }),
  seedView({
    id: "view-activity-overdue",
    name: "Overdue",
    filterRules: [
      activeOnlyRule("rule-activity-overdue-active"),
      { id: "rule-activity-overdue-state", fieldKey: "activity.scheduleState", operator: "equals", value: "Overdue" },
    ],
    sortRules: sortAsc("activity.scheduledAt"),
  }),
  seedView({
    id: "view-activity-completed",
    name: "Completed",
    filterRules: [
      activeOnlyRule("rule-activity-completed-active"),
      { id: "rule-activity-completed-status", fieldKey: "activity.status", operator: "equals", value: "Completed" },
    ],
    sortRules: [{ fieldKey: "activity.scheduledAt", direction: "desc" }],
  }),
  seedView({
    id: "view-activity-canceled",
    name: "Canceled",
    filterRules: [
      activeOnlyRule("rule-activity-canceled-active"),
      { id: "rule-activity-canceled-status", fieldKey: "activity.status", operator: "equals", value: "Canceled" },
    ],
    sortRules: [{ fieldKey: "activity.scheduledAt", direction: "desc" }],
  }),
];

const allFields = [...ACTIVITY_CORE_FIELDS, ...ACTIVITY_CUSTOM_FIELD_SEED];

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

export const ACTIVITY_ENTITY_CONFIG: CrmEntityConfig = defineCrmEntityConfig({
  entityType: "activity",
  singularLabel: "Activity",
  pluralLabel: "Activities",
  coreFields: ACTIVITY_CORE_FIELDS,
  seedCustomFields: ACTIVITY_CUSTOM_FIELD_SEED,
  allowedCustomFieldTypes: allowedTypes,
  defaultColumnOrder: [...allFields].sort((a, b) => a.position - b.position).map((f) => f.key),
  defaultVisibleColumns: allFields.filter((f) => f.visibleInTable).map((f) => f.key),
  defaultSavedViews: ACTIVITY_SEED_VIEWS,
  ...deriveCapabilityLists(allFields),
});
