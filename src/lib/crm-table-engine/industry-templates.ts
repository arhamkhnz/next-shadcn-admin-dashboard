import type {
  CrmEntityType,
  CustomFieldType,
  IndustryTemplateDefinition,
  PipelineStage,
  SavedView,
  SelectOption,
} from "./types";

function field(
  entityType: CrmEntityType,
  systemName: string,
  displayLabel: string,
  type: CustomFieldType,
  extra: {
    description?: string;
    required?: boolean;
    visibleInTable?: boolean;
    visibleInForm?: boolean;
    width?: number;
    options?: SelectOption[];
  } = {},
) {
  return { entityType, systemName, displayLabel, type, ...extra };
}

function view(id: string, name: string, entityType: CrmEntityType): SavedView {
  return {
    id,
    name,
    entityType,
    columnOrder: [],
    columnVisibility: {},
    columnWidths: {},
    sortRules: [],
    filterRules: [],
    isDefault: false,
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
    archivedAt: null,
  };
}

const automotiveStages: PipelineStage[] = [
  { key: "Discovery", label: "Discovery", probability: 15 },
  { key: "Qualified", label: "Qualified", probability: 35 },
  { key: "Proposal Sent", label: "Proposal Sent", probability: 60 },
  { key: "Negotiation", label: "Negotiation", probability: 80 },
  { key: "Closed Won", label: "Closed Won", probability: 100, isClosed: true },
  { key: "Closed Lost", label: "Closed Lost", probability: 0, isClosed: true },
];

const defaultDealStages: PipelineStage[] = [
  { key: "Discovery", label: "Discovery", probability: 10 },
  { key: "Qualified", label: "Qualified", probability: 25 },
  { key: "Proposal Sent", label: "Proposal Sent", probability: 45 },
  { key: "Negotiation", label: "Negotiation", probability: 70 },
  { key: "Closed Won", label: "Closed Won", probability: 100, isClosed: true },
  { key: "Closed Lost", label: "Closed Lost", probability: 0, isClosed: true },
];

export const INDUSTRY_TEMPLATES: IndustryTemplateDefinition[] = [
  {
    id: "general-sales",
    name: "General Sales",
    description: "Balanced CRM defaults for mixed B2B pipelines and broad sales teams.",
    useCase: "Standardize a general-purpose CRM without narrowing the sales motion.",
    entitiesAffected: ["lead", "contact", "company", "deal", "activity", "task"],
    fieldsIncluded: 6,
    fieldDefinitions: [
      field("lead", "lead_source_detail", "Lead Source Detail", "single_select"),
      field("contact", "relationship_strength", "Relationship Strength", "single_select"),
      field("company", "account_tier", "Account Tier", "single_select"),
      field("deal", "deal_type", "Deal Type", "single_select"),
      field("activity", "touchpoint_outcome", "Touchpoint Outcome", "single_select"),
      field("task", "task_category", "Task Category", "single_select"),
    ],
    terminology: {},
    pipelineStages: defaultDealStages,
    savedViews: [view("template-general-sales-opps", "General Sales Pipeline", "deal")],
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Vehicle-buying workflows with financing and delivery milestones.",
    useCase: "Track shoppers, vehicle preferences, and delivery follow-through.",
    entitiesAffected: ["lead", "contact", "company", "deal", "activity", "task"],
    fieldsIncluded: 7,
    fieldDefinitions: [
      field("lead", "vehicle_interest", "Vehicle Interest", "single_select"),
      field("lead", "budget", "Budget", "currency"),
      field("lead", "financing_required", "Financing Required", "checkbox"),
      field("lead", "trade_in_available", "Trade In Available", "checkbox"),
      field("lead", "test_drive_date", "Test Drive Date", "date"),
      field("lead", "vehicle_model", "Vehicle Model", "text"),
      field("lead", "delivery_date", "Delivery Date", "date"),
    ],
    terminology: { lead: { singularLabel: "Prospect", pluralLabel: "Prospects" } },
    pipelineStages: automotiveStages,
    savedViews: [view("template-auto-buyers", "Automotive Buyers", "lead")],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Property acquisition and rental tracking for agents and broker teams.",
    useCase: "Capture buyer intent, property fit, financing, and offer progression.",
    entitiesAffected: ["lead", "contact", "company", "deal", "activity", "task"],
    fieldsIncluded: 9,
    fieldDefinitions: [
      field("lead", "property_type", "Property Type", "single_select"),
      field("lead", "preferred_location", "Preferred Location", "text"),
      field("lead", "budget_range", "Budget Range", "currency"),
      field("lead", "bedrooms", "Bedrooms", "number"),
      field("lead", "bathrooms", "Bathrooms", "number"),
      field("lead", "buying_or_renting", "Buying Or Renting", "single_select"),
      field("lead", "mortgage_status", "Mortgage Status", "single_select"),
      field("lead", "property_address", "Property Address", "text"),
      field("lead", "offer_amount", "Offer Amount", "currency"),
    ],
    terminology: { company: { singularLabel: "Property", pluralLabel: "Properties" } },
    pipelineStages: defaultDealStages,
    savedViews: [view("template-real-estate-buyers", "Property Applicants", "lead")],
  },
  {
    id: "recruitment",
    name: "Recruitment",
    description: "Candidate pipelines with role, authorization, notice, and placement tracking.",
    useCase: "Manage open roles, candidate progress, and placement handoff.",
    entitiesAffected: ["lead", "contact", "company", "deal", "activity", "task"],
    fieldsIncluded: 10,
    fieldDefinitions: [
      field("lead", "candidate_role", "Candidate Role", "text"),
      field("lead", "years_of_experience", "Years Of Experience", "number"),
      field("lead", "expected_salary", "Expected Salary", "currency"),
      field("lead", "availability_date", "Availability Date", "date"),
      field("lead", "work_authorization", "Work Authorization", "single_select"),
      field("lead", "candidate_stage", "Candidate Stage", "single_select"),
      field("lead", "notice_period", "Notice Period", "text"),
      field("deal", "placement_fee", "Placement Fee", "currency"),
      field("deal", "start_date", "Start Date", "date"),
      field("contact", "candidate_location", "Candidate Location", "text"),
    ],
    terminology: {
      lead: { singularLabel: "Candidate", pluralLabel: "Candidates" },
      deal: { singularLabel: "Placement", pluralLabel: "Placements" },
    },
    pipelineStages: defaultDealStages,
    savedViews: [view("template-recruitment-candidates", "Recruitment Candidates", "lead")],
  },
  {
    id: "agency",
    name: "Agency",
    description: "Service-led CRM flows for agencies selling retainers and projects.",
    useCase: "Track project scope, recurring retainers, and client delivery milestones.",
    entitiesAffected: ["lead", "contact", "company", "deal", "activity", "task"],
    fieldsIncluded: 7,
    fieldDefinitions: [
      field("lead", "service_interest", "Service Interest", "single_select"),
      field("lead", "estimated_budget", "Estimated Budget", "currency"),
      field("lead", "project_timeline", "Project Timeline", "text"),
      field("company", "client_type", "Client Type", "single_select"),
      field("deal", "monthly_retainer", "Monthly Retainer", "currency"),
      field("deal", "primary_service", "Primary Service", "text"),
      field("deal", "contract_length", "Contract Length", "text"),
    ],
    terminology: { company: { singularLabel: "Client", pluralLabel: "Clients" } },
    pipelineStages: defaultDealStages,
    savedViews: [view("template-agency-clients", "Agency Clients", "company")],
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Subscription CRM flows with seats, trials, annual contracts, and renewals.",
    useCase: "Handle product-led and sales-led SaaS opportunities in one view.",
    entitiesAffected: ["lead", "contact", "company", "deal", "activity", "task"],
    fieldsIncluded: 9,
    fieldDefinitions: [
      field("lead", "current_software", "Current Software", "text"),
      field("lead", "seats_required", "Seats Required", "number"),
      field("lead", "use_case", "Use Case", "long_text"),
      field("deal", "expected_mrr", "Expected MRR", "currency"),
      field("deal", "technical_decision_maker", "Technical Decision Maker", "checkbox"),
      field("deal", "trial_status", "Trial Status", "single_select"),
      field("deal", "plan", "Plan", "single_select"),
      field("deal", "annual_contract_value", "Annual Contract Value", "currency"),
      field("deal", "renewal_date", "Renewal Date", "date"),
    ],
    terminology: { company: { singularLabel: "Account", pluralLabel: "Accounts" } },
    pipelineStages: defaultDealStages,
    savedViews: [view("template-saas-opps", "SaaS Opportunities", "deal")],
  },
];

export function getIndustryTemplateById(id: string): IndustryTemplateDefinition | undefined {
  return INDUSTRY_TEMPLATES.find((template) => template.id === id);
}

export const INDUSTRY_TEMPLATE_COUNT = INDUSTRY_TEMPLATES.length;
