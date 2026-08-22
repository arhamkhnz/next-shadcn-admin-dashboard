import {
  activeOnlyRule,
  createCoreFieldFactory,
  createSeedCustomFieldFactory,
  createSeedViewFactory,
  defineCrmEntityConfig,
  deriveCapabilityLists,
  sortDesc,
} from "../entity-config-factory";
import type { CrmEntityConfig, CustomFieldType } from "../types";

const coreField = createCoreFieldFactory("contact");

export const CONTACT_CORE_FIELDS = [
  coreField({
    systemName: "name",
    displayLabel: "Contact",
    type: "text",
    position: 0,
    width: 240,
    searchable: true,
    isRequiredBySystem: true,
    required: true,
  }),
  coreField({
    systemName: "company",
    displayLabel: "Company",
    type: "text",
    position: 1,
    width: 180,
    searchable: true,
  }),
  coreField({
    systemName: "email",
    displayLabel: "Contact Info",
    type: "email",
    position: 2,
    width: 220,
    searchable: true,
  }),
  coreField({
    systemName: "phone",
    displayLabel: "Phone",
    type: "phone",
    position: 3,
    width: 170,
    searchable: true,
    visibleInTable: false,
  }),
  coreField({
    systemName: "jobTitle",
    displayLabel: "Job Title",
    type: "text",
    position: 4,
    width: 160,
    searchable: true,
    visibleInTable: false,
  }),
  coreField({
    systemName: "lifecycleStage",
    displayLabel: "Lifecycle Stage",
    type: "single_select",
    position: 5,
    width: 170,
  }),
  coreField({ systemName: "owner", displayLabel: "Owner", type: "text", position: 6, width: 170 }),
  coreField({ systemName: "openDeals", displayLabel: "Open Deals", type: "number", position: 7, width: 130 }),
  coreField({ systemName: "lastContacted", displayLabel: "Last Contacted", type: "date", position: 8, width: 150 }),
  coreField({
    systemName: "followUpState",
    displayLabel: "Follow-up",
    type: "single_select",
    options: [
      { id: "opt-overdue", label: "Overdue" },
      { id: "opt-due-today", label: "Due Today" },
      { id: "opt-upcoming", label: "Upcoming" },
      { id: "opt-not-scheduled", label: "Not Scheduled" },
    ],
    position: 9,
    width: 150,
    sortable: false,
  }),
  coreField({
    systemName: "createdAt",
    displayLabel: "Created",
    type: "date",
    position: 10,
    width: 130,
    visibleInTable: false,
  }),
];

const seedCustomField = createSeedCustomFieldFactory("contact");

export const CONTACT_CUSTOM_FIELD_SEED = [
  seedCustomField({
    id: "cf-contact-preferred-time",
    systemName: "preferred_contact_time",
    displayLabel: "Preferred Contact Time",
    type: "single_select",
    options: [
      { id: "opt-morning", label: "Morning (9–12)" },
      { id: "opt-afternoon", label: "Afternoon (12–5)" },
      { id: "opt-evening", label: "Evening (5–8)" },
    ],
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 11,
    width: 190,
  }),
  seedCustomField({
    id: "cf-contact-segment",
    systemName: "customer_segment",
    displayLabel: "Customer Segment",
    type: "single_select",
    options: [
      { id: "opt-startup", label: "Startup" },
      { id: "opt-smb", label: "SMB" },
      { id: "opt-mid-market", label: "Mid-Market" },
      { id: "opt-enterprise", label: "Enterprise" },
    ],
    required: false,
    visibleInTable: true,
    visibleInForm: true,
    searchable: true,
    sortable: true,
    position: 12,
    width: 160,
  }),
];

const seedView = createSeedViewFactory("contact");

export const CONTACT_SEED_VIEWS = [
  seedView({
    id: "view-contact-all",
    name: "All Contacts",
    filterRules: [activeOnlyRule("rule-contact-all-active")],
    sortRules: sortDesc("contact.createdAt"),
    isDefault: true,
  }),
  seedView({
    id: "view-contact-mine",
    name: "My Contacts",
    filterRules: [
      activeOnlyRule("rule-contact-mine-active"),
      { id: "rule-contact-mine-owner", fieldKey: "contact.owner", operator: "equalsMe" },
    ],
    sortRules: sortDesc("contact.createdAt"),
  }),
  seedView({
    id: "view-contact-customers",
    name: "Customers",
    filterRules: [
      activeOnlyRule("rule-contact-customers-active"),
      { id: "rule-contact-customers-stage", fieldKey: "contact.lifecycleStage", operator: "equals", value: "Customer" },
    ],
    sortRules: sortDesc("contact.createdAt"),
  }),
  seedView({
    id: "view-contact-prospects",
    name: "Prospects",
    filterRules: [
      activeOnlyRule("rule-contact-prospects-active"),
      {
        id: "rule-contact-prospects-stage",
        fieldKey: "contact.lifecycleStage",
        operator: "in",
        value: ["Lead", "Marketing Qualified", "Sales Qualified", "Opportunity"],
      },
    ],
    sortRules: sortDesc("contact.createdAt"),
  }),
  seedView({
    id: "view-contact-open-deals",
    name: "Open Deals",
    filterRules: [
      activeOnlyRule("rule-contact-deals-active"),
      { id: "rule-contact-open-deals", fieldKey: "contact.openDeals", operator: "gt", value: 0 },
    ],
    sortRules: [{ fieldKey: "contact.openDeals", direction: "desc" }],
  }),
  seedView({
    id: "view-contact-followup",
    name: "Needs Follow-up",
    filterRules: [
      activeOnlyRule("rule-contact-followup-active"),
      {
        id: "rule-contact-followup-state",
        fieldKey: "contact.followUpState",
        operator: "in",
        value: ["Overdue", "Due Today"],
      },
    ],
    sortRules: [{ fieldKey: "contact.lastContacted", direction: "asc" }],
  }),
  seedView({
    id: "view-contact-inactive",
    name: "No Recent Activity",
    filterRules: [
      activeOnlyRule("rule-contact-inactive-active"),
      {
        id: "rule-contact-inactive-state",
        fieldKey: "contact.activityRecency",
        operator: "in",
        value: ["Never Contacted", "Stale"],
      },
    ],
    sortRules: [{ fieldKey: "contact.lastContacted", direction: "asc" }],
  }),
  seedView({
    id: "view-contact-archived",
    name: "Archived",
    filterRules: [{ id: "rule-contact-archived-only", fieldKey: null, operator: "isArchived" }],
    sortRules: sortDesc("contact.lastContacted"),
  }),
];

const allFields = [...CONTACT_CORE_FIELDS, ...CONTACT_CUSTOM_FIELD_SEED];

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

export const CONTACT_ENTITY_CONFIG: CrmEntityConfig = defineCrmEntityConfig({
  entityType: "contact",
  singularLabel: "Contact",
  pluralLabel: "Contacts",
  coreFields: CONTACT_CORE_FIELDS,
  seedCustomFields: CONTACT_CUSTOM_FIELD_SEED,
  allowedCustomFieldTypes: allowedTypes,
  defaultColumnOrder: [...allFields].sort((a, b) => a.position - b.position).map((f) => f.key),
  defaultVisibleColumns: allFields.filter((f) => f.visibleInTable).map((f) => f.key),
  defaultSavedViews: CONTACT_SEED_VIEWS,
  ...deriveCapabilityLists(allFields),
});
