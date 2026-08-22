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
import type { CrmEntityConfig, CustomFieldType } from "../types";

const coreField = createCoreFieldFactory("deal");

export const DEAL_CORE_FIELDS = [
  coreField({
    systemName: "name",
    displayLabel: "Deal",
    type: "text",
    position: 0,
    width: 220,
    searchable: true,
    isRequiredBySystem: true,
    required: true,
  }),
  coreField({
    systemName: "company",
    displayLabel: "Company",
    type: "text",
    position: 1,
    width: 190,
    searchable: true,
  }),
  coreField({
    systemName: "primaryContact",
    displayLabel: "Primary Contact",
    type: "text",
    position: 2,
    width: 170,
    sortable: false,
  }),
  coreField({ systemName: "stage", displayLabel: "Stage", type: "single_select", position: 3, width: 150 }),
  coreField({ systemName: "value", displayLabel: "Value", type: "currency", position: 4, width: 140 }),
  coreField({ systemName: "probability", displayLabel: "Probability", type: "percentage", position: 5, width: 140 }),
  coreField({
    systemName: "health",
    displayLabel: "Health",
    type: "single_select",
    options: [
      { id: "opt-healthy", label: "Healthy" },
      { id: "opt-attention", label: "Attention" },
      { id: "opt-at-risk", label: "At Risk" },
    ],
    position: 6,
    width: 130,
  }),
  coreField({ systemName: "owner", displayLabel: "Owner", type: "text", position: 7, width: 170 }),
  coreField({
    systemName: "source",
    displayLabel: "Source",
    type: "single_select",
    position: 8,
    width: 130,
    visibleInTable: false,
  }),
  coreField({
    systemName: "lastActivity",
    displayLabel: "Last Activity",
    type: "date",
    position: 9,
    width: 150,
    visibleInTable: false,
  }),
  coreField({ systemName: "expectedClose", displayLabel: "Expected Close", type: "date", position: 10, width: 150 }),
  coreField({
    systemName: "createdAt",
    displayLabel: "Created",
    type: "date",
    position: 11,
    width: 130,
    visibleInTable: false,
  }),
];

const seedCustomField = createSeedCustomFieldFactory("deal");

export const DEAL_CUSTOM_FIELD_SEED = [
  seedCustomField({
    id: "cf-deal-competitor",
    systemName: "competitor",
    displayLabel: "Competitor",
    type: "single_select",
    options: [
      { id: "opt-none-known", label: "None known" },
      { id: "opt-vertex", label: "Vertex Corp" },
      { id: "opt-northline", label: "Northline" },
      { id: "opt-apex", label: "Apex Systems" },
      { id: "opt-other", label: "Other" },
    ],
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 12,
    width: 150,
  }),
  seedCustomField({
    id: "cf-deal-contract-type",
    systemName: "contract_type",
    displayLabel: "Contract Type",
    type: "single_select",
    options: [
      { id: "opt-fixed-fee", label: "Fixed Fee" },
      { id: "opt-tam", label: "Time & Materials" },
      { id: "opt-subscription", label: "Subscription" },
      { id: "opt-pilot", label: "Pilot" },
    ],
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 13,
    width: 160,
  }),
  seedCustomField({
    id: "cf-deal-implementation-required",
    systemName: "implementation_required",
    displayLabel: "Implementation Required",
    type: "checkbox",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: false,
    sortable: true,
    position: 14,
    width: 130,
  }),
];

const seedView = createSeedViewFactory("deal");

export const DEAL_SEED_VIEWS = [
  seedView({
    id: "view-deal-all",
    name: "All Deals",
    filterRules: [activeOnlyRule("rule-deal-all-active")],
    sortRules: sortDesc("deal.name"),
    isDefault: true,
  }),
  seedView({
    id: "view-deal-mine",
    name: "My Deals",
    filterRules: [
      activeOnlyRule("rule-deal-mine-active"),
      { id: "rule-deal-mine-owner", fieldKey: "deal.owner", operator: "equalsMe" },
    ],
    sortRules: sortDesc("deal.name"),
  }),
  seedView({
    id: "view-deal-open",
    name: "Open Deals",
    filterRules: [
      activeOnlyRule("rule-deal-open-active"),
      {
        id: "rule-deal-open-stage",
        fieldKey: "deal.stage",
        operator: "in",
        value: ["Discovery", "Qualified", "Proposal Sent", "Negotiation"],
      },
    ],
    sortRules: [{ fieldKey: "deal.expectedClose", direction: "asc" }],
  }),
  seedView({
    id: "view-deal-closing",
    name: "Closing This Month",
    filterRules: [
      activeOnlyRule("rule-deal-closing-active"),
      { id: "rule-deal-closing-flag", fieldKey: "deal.closingThisMonth", operator: "isTrue" },
    ],
    sortRules: [{ fieldKey: "deal.expectedClose", direction: "asc" }],
  }),
  seedView({
    id: "view-deal-overdue",
    name: "Overdue",
    filterRules: [
      activeOnlyRule("rule-deal-overdue-active"),
      { id: "rule-deal-overdue-flag", fieldKey: "deal.overdueState", operator: "isTrue" },
    ],
    sortRules: [{ fieldKey: "deal.expectedClose", direction: "asc" }],
  }),
  seedView({
    id: "view-deal-won",
    name: "Closed Won",
    filterRules: [
      activeOnlyRule("rule-deal-won-active"),
      { id: "rule-deal-won-stage", fieldKey: "deal.stage", operator: "equals", value: "Closed Won" },
    ],
    sortRules: sortDesc("deal.value"),
  }),
  seedView({
    id: "view-deal-lost",
    name: "Closed Lost",
    filterRules: [
      activeOnlyRule("rule-deal-lost-active"),
      { id: "rule-deal-lost-stage", fieldKey: "deal.stage", operator: "equals", value: "Closed Lost" },
    ],
    sortRules: sortDesc("deal.value"),
  }),
  seedView({
    id: "view-deal-archived",
    name: "Archived",
    filterRules: [archivedOnlyRule("rule-deal-archived-only")],
    sortRules: sortDesc("deal.name"),
  }),
];

const allFields = [...DEAL_CORE_FIELDS, ...DEAL_CUSTOM_FIELD_SEED];

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

export const DEAL_ENTITY_CONFIG: CrmEntityConfig = defineCrmEntityConfig({
  entityType: "deal",
  singularLabel: "Deal",
  pluralLabel: "Deals",
  coreFields: DEAL_CORE_FIELDS,
  seedCustomFields: DEAL_CUSTOM_FIELD_SEED,
  allowedCustomFieldTypes: allowedTypes,
  defaultColumnOrder: [...allFields].sort((a, b) => a.position - b.position).map((f) => f.key),
  defaultVisibleColumns: allFields.filter((f) => f.visibleInTable).map((f) => f.key),
  defaultSavedViews: DEAL_SEED_VIEWS,
  ...deriveCapabilityLists(allFields),
});
