import type { CrmEntityConfig, CrmEntityType } from "../types";
import { ACTIVITY_ENTITY_CONFIG } from "./activity";
import { COMPANY_ENTITY_CONFIG } from "./company";
import { CONTACT_ENTITY_CONFIG } from "./contact";
import { DEAL_ENTITY_CONFIG } from "./deal";
import { LEAD_ENTITY_CONFIG } from "./lead";
import { TASK_ENTITY_CONFIG } from "./task";

export const CRM_ENTITY_CONFIGS: Record<CrmEntityType, CrmEntityConfig> = {
  lead: LEAD_ENTITY_CONFIG,
  contact: CONTACT_ENTITY_CONFIG,
  company: COMPANY_ENTITY_CONFIG,
  deal: DEAL_ENTITY_CONFIG,
  activity: ACTIVITY_ENTITY_CONFIG,
  task: TASK_ENTITY_CONFIG,
};

export function getCrmEntityConfig(entityType: CrmEntityType): CrmEntityConfig {
  return CRM_ENTITY_CONFIGS[entityType];
}

export {
  ACTIVITY_CORE_FIELDS,
  ACTIVITY_CUSTOM_FIELD_SEED,
  ACTIVITY_SEED_VIEWS,
} from "./activity";
export {
  COMPANY_CORE_FIELDS,
  COMPANY_CUSTOM_FIELD_SEED,
  COMPANY_SEED_VIEWS,
} from "./company";
export {
  CONTACT_CORE_FIELDS,
  CONTACT_CUSTOM_FIELD_SEED,
  CONTACT_SEED_VIEWS,
} from "./contact";
export {
  DEAL_CORE_FIELDS,
  DEAL_CUSTOM_FIELD_SEED,
  DEAL_SEED_VIEWS,
} from "./deal";
export { INTERESTED_PRODUCT_OPTIONS, LEAD_CORE_FIELDS, LEAD_CUSTOM_FIELD_SEED, LEAD_SEED_VIEWS } from "./lead";
export { TASK_CORE_FIELDS, TASK_CUSTOM_FIELD_SEED, TASK_SEED_VIEWS } from "./task";
