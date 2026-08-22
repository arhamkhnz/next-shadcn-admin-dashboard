import {
  activeOnlyRule,
  createCoreFieldFactory,
  createSeedCustomFieldFactory,
  createSeedViewFactory,
  defineCrmEntityConfig,
  deriveCapabilityLists,
  sortAsc,
  sortDesc,
} from "../entity-config-factory";
import type { CrmEntityConfig, CustomFieldType } from "../types";

const coreField = createCoreFieldFactory("company");

export const COMPANY_CORE_FIELDS = [
  coreField({
    systemName: "name",
    displayLabel: "Company",
    type: "text",
    position: 0,
    width: 230,
    searchable: true,
    isRequiredBySystem: true,
    required: true,
  }),
  coreField({ systemName: "industry", displayLabel: "Industry", type: "single_select", position: 1, width: 150 }),
  coreField({ systemName: "website", displayLabel: "Website", type: "url", position: 2, width: 190, searchable: true }),
  coreField({
    systemName: "location",
    displayLabel: "Location",
    type: "text",
    position: 3,
    width: 150,
    searchable: true,
  }),
  coreField({ systemName: "size", displayLabel: "Size", type: "single_select", position: 4, width: 110 }),
  coreField({
    systemName: "type",
    displayLabel: "Type",
    type: "single_select",
    options: [
      { id: "opt-prospect", label: "Prospect" },
      { id: "opt-customer", label: "Customer" },
      { id: "opt-partner", label: "Partner" },
      { id: "opt-former", label: "Former Customer" },
    ],
    position: 5,
    width: 140,
    visibleInTable: false,
  }),
  coreField({
    systemName: "primaryContact",
    displayLabel: "Primary Contact",
    type: "text",
    position: 6,
    width: 180,
    sortable: false,
  }),
  coreField({ systemName: "owner", displayLabel: "Owner", type: "text", position: 7, width: 170 }),
  coreField({ systemName: "openDeals", displayLabel: "Open Deals", type: "number", position: 8, width: 120 }),
  coreField({ systemName: "pipelineValue", displayLabel: "Pipeline Value", type: "currency", position: 9, width: 160 }),
  coreField({ systemName: "lastActivity", displayLabel: "Last Activity", type: "date", position: 10, width: 150 }),
  coreField({
    systemName: "createdAt",
    displayLabel: "Created",
    type: "date",
    position: 11,
    width: 130,
    visibleInTable: false,
  }),
];

const seedCustomField = createSeedCustomFieldFactory("company");

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month) => ({ id: `opt-${month.toLowerCase()}`, label: month }));

export const COMPANY_CUSTOM_FIELD_SEED = [
  seedCustomField({
    id: "cf-company-business-model",
    systemName: "business_model",
    displayLabel: "Business Model",
    type: "single_select",
    options: [
      { id: "opt-b2b-saas", label: "B2B SaaS" },
      { id: "opt-marketplace", label: "Marketplace" },
      { id: "opt-services", label: "Professional Services" },
      { id: "opt-ecommerce", label: "E-commerce" },
      { id: "opt-hardware", label: "Hardware" },
    ],
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 12,
    width: 170,
  }),
  seedCustomField({
    id: "cf-company-annual-revenue",
    systemName: "annual_revenue",
    displayLabel: "Annual Revenue",
    type: "currency",
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 13,
    width: 160,
  }),
  seedCustomField({
    id: "cf-company-renewal-month",
    systemName: "renewal_month",
    displayLabel: "Renewal Month",
    type: "single_select",
    options: MONTH_OPTIONS,
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 14,
    width: 150,
  }),
];

const seedView = createSeedViewFactory("company");

export const COMPANY_SEED_VIEWS = [
  seedView({
    id: "view-company-all",
    name: "All Companies",
    filterRules: [activeOnlyRule("rule-company-all-active")],
    sortRules: sortAsc("company.name"),
    isDefault: true,
  }),
  seedView({
    id: "view-company-mine",
    name: "My Companies",
    filterRules: [
      activeOnlyRule("rule-company-mine-active"),
      { id: "rule-company-mine-owner", fieldKey: "company.owner", operator: "equalsMe" },
    ],
    sortRules: sortAsc("company.name"),
  }),
  seedView({
    id: "view-company-open-deals",
    name: "With Open Deals",
    filterRules: [
      activeOnlyRule("rule-company-deals-active"),
      { id: "rule-company-open-deals", fieldKey: "company.openDeals", operator: "gt", value: 0 },
    ],
    sortRules: [{ fieldKey: "company.pipelineValue", direction: "desc" }],
  }),
  seedView({
    id: "view-company-customers",
    name: "Customers",
    filterRules: [
      activeOnlyRule("rule-company-customers-active"),
      { id: "rule-company-customers-type", fieldKey: "company.type", operator: "equals", value: "Customer" },
    ],
    sortRules: sortAsc("company.name"),
  }),
  seedView({
    id: "view-company-prospects",
    name: "Prospects",
    filterRules: [
      activeOnlyRule("rule-company-prospects-active"),
      { id: "rule-company-prospects-type", fieldKey: "company.type", operator: "equals", value: "Prospect" },
    ],
    sortRules: sortAsc("company.name"),
  }),
  seedView({
    id: "view-company-partners",
    name: "Partners",
    filterRules: [
      activeOnlyRule("rule-company-partners-active"),
      { id: "rule-company-partners-type", fieldKey: "company.type", operator: "equals", value: "Partner" },
    ],
    sortRules: sortAsc("company.name"),
  }),
  seedView({
    id: "view-company-inactive",
    name: "Inactive",
    filterRules: [
      activeOnlyRule("rule-company-inactive-active"),
      {
        id: "rule-company-inactive-state",
        fieldKey: "company.activityState",
        operator: "in",
        value: ["Inactive", "Never Active"],
      },
    ],
    sortRules: [{ fieldKey: "company.lastActivity", direction: "asc" }],
  }),
  seedView({
    id: "view-company-archived",
    name: "Archived",
    filterRules: [{ id: "rule-company-archived-only", fieldKey: null, operator: "isArchived" }],
    sortRules: sortDesc("company.lastActivity"),
  }),
];

const allFields = [...COMPANY_CORE_FIELDS, ...COMPANY_CUSTOM_FIELD_SEED];

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

export const COMPANY_ENTITY_CONFIG: CrmEntityConfig = defineCrmEntityConfig({
  entityType: "company",
  singularLabel: "Company",
  pluralLabel: "Companies",
  coreFields: COMPANY_CORE_FIELDS,
  seedCustomFields: COMPANY_CUSTOM_FIELD_SEED,
  allowedCustomFieldTypes: allowedTypes,
  defaultColumnOrder: [...allFields].sort((a, b) => a.position - b.position).map((f) => f.key),
  defaultVisibleColumns: allFields.filter((f) => f.visibleInTable).map((f) => f.key),
  defaultSavedViews: COMPANY_SEED_VIEWS,
  ...deriveCapabilityLists(allFields),
});
