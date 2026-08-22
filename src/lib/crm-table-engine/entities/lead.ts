import {
  activeOnlyRule,
  archivedOnlyRule,
  createCoreFieldFactory,
  createSeedCustomFieldFactory,
  createSeedViewFactory,
  defineCrmEntityConfig,
  deriveCapabilityLists,
  sortDesc,
} from "../entity-config-factory";
import type { CrmEntityConfig } from "../types";

const coreField = createCoreFieldFactory("lead");

export const LEAD_CORE_FIELDS = [
  coreField({
    systemName: "name",
    displayLabel: "Lead",
    type: "text",
    position: 0,
    width: 240,
    searchable: true,
    sortable: true,
    isRequiredBySystem: true,
    required: true,
  }),
  coreField({
    systemName: "company",
    displayLabel: "Company",
    type: "text",
    position: 1,
    width: 200,
    searchable: true,
  }),
  coreField({ systemName: "email", displayLabel: "Contact", type: "email", position: 2, width: 220, searchable: true }),
  coreField({
    systemName: "phone",
    displayLabel: "Phone",
    type: "phone",
    position: 3,
    width: 180,
    searchable: true,
    visibleInTable: false,
  }),
  coreField({ systemName: "source", displayLabel: "Source", type: "single_select", position: 4, width: 140 }),
  coreField({ systemName: "status", displayLabel: "Status", type: "single_select", position: 5, width: 150 }),
  coreField({ systemName: "score", displayLabel: "Score", type: "number", position: 6, width: 120 }),
  coreField({ systemName: "owner", displayLabel: "Owner", type: "text", position: 7, width: 180 }),
  coreField({ systemName: "lastActivity", displayLabel: "Last Activity", type: "date", position: 8, width: 150 }),
  coreField({ systemName: "nextActivity", displayLabel: "Next Activity", type: "date", position: 9, width: 150 }),
  coreField({
    systemName: "createdAt",
    displayLabel: "Created",
    type: "date",
    position: 10,
    width: 130,
    visibleInTable: false,
  }),
  coreField({
    systemName: "updatedAt",
    displayLabel: "Updated",
    type: "date",
    position: 11,
    width: 130,
    visibleInTable: false,
  }),
];

export const INTERESTED_PRODUCT_OPTIONS = [
  { id: "opt-fleet", label: "Fleet Management Platform" },
  { id: "opt-property", label: "Property Listing Suite" },
  { id: "opt-recruiting", label: "Recruitment Hub" },
  { id: "opt-core", label: "Core Platform" },
] as const;

const seedCustomField = createSeedCustomFieldFactory("lead");

export const LEAD_CUSTOM_FIELD_SEED = [
  seedCustomField({
    id: "cf-budget",
    systemName: "budget",
    displayLabel: "Budget",
    type: "currency",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 12,
    width: 150,
  }),
  seedCustomField({
    id: "cf-interested-product",
    systemName: "interested_product",
    displayLabel: "Interested Product",
    type: "single_select",
    options: [...INTERESTED_PRODUCT_OPTIONS],
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 13,
    width: 210,
  }),
  seedCustomField({
    id: "cf-decision-maker",
    systemName: "decision_maker",
    displayLabel: "Decision Maker",
    type: "checkbox",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: false,
    sortable: true,
    position: 14,
    width: 140,
  }),
  seedCustomField({
    id: "cf-contract-renewal-date",
    systemName: "contract_renewal_date",
    displayLabel: "Contract Renewal Date",
    type: "date",
    required: false,
    visibleInTable: true,
    visibleInForm: false,
    searchable: false,
    sortable: true,
    position: 15,
    width: 180,
  }),
];

const seedView = createSeedViewFactory("lead");

export const LEAD_SEED_VIEWS = [
  seedView({
    id: "view-all",
    name: "All Leads",
    filterRules: [activeOnlyRule("rule-all-active")],
    sortRules: sortDesc("lead.createdAt"),
    isDefault: true,
  }),
  seedView({
    id: "view-mine",
    name: "My Leads",
    filterRules: [
      activeOnlyRule("rule-mine-active"),
      { id: "rule-mine-owner", fieldKey: "lead.owner", operator: "equalsMe" },
    ],
    sortRules: sortDesc("lead.createdAt"),
  }),
  seedView({
    id: "view-new",
    name: "New",
    filterRules: [
      activeOnlyRule("rule-new-active"),
      { id: "rule-new-status", fieldKey: "lead.status", operator: "equals", value: "New" },
    ],
    sortRules: sortDesc("lead.createdAt"),
  }),
  seedView({
    id: "view-unassigned",
    name: "Unassigned",
    filterRules: [
      activeOnlyRule("rule-unassigned-active"),
      { id: "rule-unassigned-owner", fieldKey: "lead.owner", operator: "isEmpty" },
    ],
    sortRules: sortDesc("lead.createdAt"),
  }),
  seedView({
    id: "view-hot",
    name: "Hot Leads",
    filterRules: [
      activeOnlyRule("rule-hot-active"),
      { id: "rule-hot-score", fieldKey: "lead.score", operator: "gte", value: 75 },
    ],
    sortRules: sortDesc("lead.score"),
  }),
  seedView({
    id: "view-followup",
    name: "Needs Follow-up",
    filterRules: [
      activeOnlyRule("rule-followup-active"),
      {
        id: "rule-followup-state",
        fieldKey: "lead.followUpState",
        operator: "in",
        value: ["Overdue", "Due Today"],
      },
    ],
    sortRules: [{ fieldKey: "lead.nextActivity", direction: "asc" }],
  }),
  seedView({
    id: "view-archived",
    name: "Archived",
    filterRules: [archivedOnlyRule("rule-archived-only")],
    sortRules: sortDesc("lead.lastActivity"),
  }),
  seedView({
    id: "view-automotive",
    name: "Automotive Buyers",
    filterRules: [
      activeOnlyRule("rule-automotive-active"),
      {
        id: "rule-automotive-product",
        fieldKey: "lead.custom.interested_product",
        operator: "equals",
        value: "Fleet Management Platform",
      },
    ],
    sortRules: sortDesc("lead.score"),
  }),
  seedView({
    id: "view-property",
    name: "Property Applicants",
    filterRules: [
      activeOnlyRule("rule-property-active"),
      {
        id: "rule-property-product",
        fieldKey: "lead.custom.interested_product",
        operator: "equals",
        value: "Property Listing Suite",
      },
      { id: "rule-property-budget", fieldKey: "lead.custom.budget", operator: "gte", value: 100000 },
    ],
    sortRules: sortDesc("lead.custom.budget"),
  }),
  seedView({
    id: "view-recruiting",
    name: "Recruitment Candidates",
    filterRules: [
      activeOnlyRule("rule-recruiting-active"),
      {
        id: "rule-recruiting-product",
        fieldKey: "lead.custom.interested_product",
        operator: "equals",
        value: "Recruitment Hub",
      },
    ],
    sortRules: sortDesc("lead.score"),
  }),
];

const allFields = [...LEAD_CORE_FIELDS, ...LEAD_CUSTOM_FIELD_SEED];

export const LEAD_ENTITY_CONFIG: CrmEntityConfig = defineCrmEntityConfig({
  entityType: "lead",
  singularLabel: "Lead",
  pluralLabel: "Leads",
  coreFields: LEAD_CORE_FIELDS,
  seedCustomFields: LEAD_CUSTOM_FIELD_SEED,
  allowedCustomFieldTypes: [
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
  ],
  defaultColumnOrder: allFields.sort((a, b) => a.position - b.position).map((f) => f.key),
  defaultVisibleColumns: allFields.filter((f) => f.visibleInTable).map((f) => f.key),
  defaultSavedViews: LEAD_SEED_VIEWS,
  ...deriveCapabilityLists(allFields),
});
