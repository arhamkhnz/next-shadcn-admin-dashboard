import { PrismaPg } from "@prisma/adapter-pg";
import { Client } from "pg";

import { PrismaClient } from "../src/generated/prisma/client.ts";
import { setDefaultResultOrder } from "node:dns";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

setDefaultResultOrder("ipv4first");

function loadRootEnvFile() {
  let searchDir = process.cwd();

  for (;;) {
    const candidate = resolve(searchDir, ".env");
    if (existsSync(candidate)) {
      const envFile = readFileSync(candidate, "utf8");

      for (const rawLine of envFile.split(/\r?\n/)) {
        const line = rawLine.trim();

        if (!line || line.startsWith("#")) {
          continue;
        }

        const equalIndex = line.indexOf("=");
        if (equalIndex === -1) {
          continue;
        }

        const key = line.slice(0, equalIndex).trim();
        if (!key || process.env[key] !== undefined) {
          continue;
        }

        let value = line.slice(equalIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        process.env[key] = value;
      }

      return;
    }

    const parentDir = dirname(searchDir);
    if (parentDir === searchDir) {
      return;
    }

    searchDir = parentDir;
  }
}

loadRootEnvFile();

const connectionUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL is required to run the Phase 0B verification.");
}

process.env.DATABASE_URL = connectionUrl;

const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionUrl),
});

const pg = new Client({
  connectionString: connectionUrl,
  connectionTimeoutMillis: 10_000,
});

const VERIFICATION_TIMEOUT_MS = 30_000;

const ids = {
  orgPrimary: "org_seed_lynxmind",
  orgSecondary: "org_seed_northwind",
  membershipOwnerPrimary: "mship_seed_owner_primary",
  membershipRepPrimary: "mship_seed_rep_primary",
  membershipRepSecondary: "mship_seed_rep_secondary",
  companyAcme: "company_seed_acme",
  contactJordan: "contact_seed_jordan",
  leadOpen: "lead_seed_open",
  leadConverted: "lead_seed_converted",
  dealAcmeExpansion: "deal_seed_acme_expansion",
  activityCall: "activity_seed_call",
  activityTask: "activity_seed_task",
  cfdLeadBudget: "cfd_seed_lead_budget",
  cfdContactRole: "cfd_seed_contact_role",
  cfdCompanyRegion: "cfd_seed_company_region",
  cfdDealContractType: "cfd_seed_deal_contract_type",
  cfdActivityChannel: "cfd_seed_activity_channel",
  cfdTaskEscalated: "cfd_seed_task_escalated",
  cfvLeadBudget: "cfv_seed_lead_budget",
  cfvContactRole: "cfv_seed_contact_role",
  cfvCompanyRegion: "cfv_seed_company_region",
  cfvDealContractType: "cfv_seed_deal_contract_type",
  cfvActivityChannel: "cfv_seed_activity_channel",
  cfvTaskEscalated: "cfv_seed_task_escalated",
} as const;

const expectedCounts = {
  organizations: 2,
  memberships: 4,
  roles: 10,
  rolePermissions: 366,
  leads: 2,
  contacts: 1,
  companies: 1,
  deals: 1,
  activities: 2,
  customFieldDefinitions: 6,
  customFieldValues: 6,
  savedViews: 6,
  auditEvents: 1,
  idempotencyRecords: 1,
  webhookEvents: 1,
} as const;

const expectedIndexes = [
  "OrganizationMembership_organizationId_roleId_idx",
  "Lead_organizationId_ownerMembershipId_idx",
  "Deal_organizationId_pipelineId_idx",
  "Activity_organizationId_ownerMembershipId_scheduledAt_idx",
  "Activity_organizationId_dueAt_idx",
  "CustomFieldDefinition_organizationId_entityType_archivedAt_idx",
  "CustomFieldValue_organizationId_fieldDefinitionId_idx",
  "CustomFieldValue_organizationId_entityType_recordId_idx",
  "SavedView_organizationId_ownerMembershipId_idx",
  "SavedView_organizationId_entityType_archivedAt_idx",
  "Pipeline_one_default_per_organization_key",
  "InvitationProjection_pending_email_key",
  "Company_unique_normalizedDomain_per_organization_key",
] as const;

const expectedConstraints = [
  "OrganizationMembership_organizationId_roleId_fkey",
  "Lead_organizationId_ownerMembershipId_fkey",
  "Contact_organizationId_ownerMembershipId_fkey",
  "Company_organizationId_ownerMembershipId_fkey",
  "Deal_organizationId_ownerMembershipId_fkey",
  "Activity_organizationId_ownerMembershipId_fkey",
  "CustomFieldValue_organizationId_fieldDefinitionId_fkey",
  "SavedView_organizationId_ownerMembershipId_fkey",
  "Lead_score_check",
  "Deal_valueMinor_check",
  "Deal_probability_check",
  "PipelineStage_probability_check",
  "Subscription_seats_check",
  "SubscriptionItem_quantity_check",
  "SubscriptionItem_unitAmountMinor_check",
  "DealLineItem_quantity_check",
  "DealLineItem_unitPriceMinor_check",
  "Activity_related_record_check",
  "Activity_completed_requires_completedAt_check",
  "Activity_direction_type_check",
  "Activity_duration_positive_check",
  "Note_exactly_one_parent_check",
] as const;

const expectedTrigger = "CustomFieldValue_validate_type_trigger";

type CountSnapshot = Record<keyof typeof expectedCounts, number>;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function snapshotCounts(): Promise<CountSnapshot> {
  const [
    organizations,
    memberships,
    roles,
    rolePermissions,
    leads,
    contacts,
    companies,
    deals,
    activities,
    customFieldDefinitions,
    customFieldValues,
    savedViews,
    auditEvents,
    idempotencyRecords,
    webhookEvents,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.organizationMembership.count(),
    prisma.role.count(),
    prisma.rolePermission.count(),
    prisma.lead.count(),
    prisma.contact.count(),
    prisma.company.count(),
    prisma.deal.count(),
    prisma.activity.count(),
    prisma.customFieldDefinition.count(),
    prisma.customFieldValue.count(),
    prisma.savedView.count(),
    prisma.auditEvent.count(),
    prisma.idempotencyRecord.count(),
    prisma.webhookEvent.count(),
  ]);

  return {
    organizations,
    memberships,
    roles,
    rolePermissions,
    leads,
    contacts,
    companies,
    deals,
    activities,
    customFieldDefinitions,
    customFieldValues,
    savedViews,
    auditEvents,
    idempotencyRecords,
    webhookEvents,
  };
}

function assertCounts(snapshot: CountSnapshot) {
  for (const [key, expected] of Object.entries(expectedCounts)) {
    const actual = snapshot[key as keyof CountSnapshot];
    assert(actual === expected, `Expected ${key}=${expected}, received ${actual}.`);
  }
}

async function verifyTenantIsolation() {
  const [
    primaryLeadCount,
    secondaryLeadCount,
    primaryViewCount,
    secondaryViewCount,
    primaryCustomFieldCount,
    secondaryCustomFieldCount,
    ownerScopeRows,
    customFieldScopeRows,
    savedViewScopeRows,
    membershipsByOrg,
    organizations,
  ] = await Promise.all([
    prisma.lead.count({ where: { organizationId: ids.orgPrimary } }),
    prisma.lead.count({ where: { organizationId: ids.orgSecondary } }),
    prisma.savedView.count({ where: { organizationId: ids.orgPrimary } }),
    prisma.savedView.count({ where: { organizationId: ids.orgSecondary } }),
    prisma.customFieldDefinition.count({ where: { organizationId: ids.orgPrimary } }),
    prisma.customFieldDefinition.count({ where: { organizationId: ids.orgSecondary } }),
    pg.query<{ table_name: string; invalid_rows: string }>(`
      WITH owner_scope AS (
        SELECT 'Lead'::text AS table_name, COUNT(*)::text AS invalid_rows
        FROM "Lead" l
        JOIN "OrganizationMembership" m
          ON m.id = l."ownerMembershipId"
        WHERE l."ownerMembershipId" IS NOT NULL
          AND l."organizationId" <> m."organizationId"
        UNION ALL
        SELECT 'Contact', COUNT(*)::text
        FROM "Contact" c
        JOIN "OrganizationMembership" m
          ON m.id = c."ownerMembershipId"
        WHERE c."ownerMembershipId" IS NOT NULL
          AND c."organizationId" <> m."organizationId"
        UNION ALL
        SELECT 'Company', COUNT(*)::text
        FROM "Company" c
        JOIN "OrganizationMembership" m
          ON m.id = c."ownerMembershipId"
        WHERE c."ownerMembershipId" IS NOT NULL
          AND c."organizationId" <> m."organizationId"
        UNION ALL
        SELECT 'Deal', COUNT(*)::text
        FROM "Deal" d
        JOIN "OrganizationMembership" m
          ON m.id = d."ownerMembershipId"
        WHERE d."ownerMembershipId" IS NOT NULL
          AND d."organizationId" <> m."organizationId"
        UNION ALL
        SELECT 'Activity', COUNT(*)::text
        FROM "Activity" a
        JOIN "OrganizationMembership" m
          ON m.id = a."ownerMembershipId"
        WHERE a."ownerMembershipId" IS NOT NULL
          AND a."organizationId" <> m."organizationId"
        UNION ALL
        SELECT 'SavedView', COUNT(*)::text
        FROM "SavedView" s
        JOIN "OrganizationMembership" m
          ON m.id = s."ownerMembershipId"
        WHERE s."ownerMembershipId" IS NOT NULL
          AND s."organizationId" <> m."organizationId"
      )
      SELECT table_name, invalid_rows
      FROM owner_scope
      ORDER BY table_name;
    `),
    pg.query<{ organizationId: string; entityType: string; definition_count: string; value_count: string }>(`
      SELECT
        d."organizationId",
        d."entityType"::text AS "entityType",
        COUNT(DISTINCT d.id)::text AS definition_count,
        COUNT(v.id)::text AS value_count
      FROM "CustomFieldDefinition" d
      LEFT JOIN "CustomFieldValue" v
        ON v."organizationId" = d."organizationId"
       AND v."fieldDefinitionId" = d.id
      GROUP BY d."organizationId", d."entityType"
      ORDER BY d."organizationId", d."entityType";
    `),
    pg.query<{ organizationId: string; entityType: string; view_count: string; foreign_membership_refs: string }>(`
      SELECT
        s."organizationId",
        s."entityType"::text AS "entityType",
        COUNT(*)::text AS view_count,
        COUNT(*) FILTER (
          WHERE m.id IS NOT NULL AND m."organizationId" <> s."organizationId"
        )::text AS foreign_membership_refs
      FROM "SavedView" s
      LEFT JOIN "OrganizationMembership" m
        ON m.id = s."ownerMembershipId"
      GROUP BY s."organizationId", s."entityType"
      ORDER BY s."organizationId", s."entityType";
    `),
    prisma.organizationMembership.groupBy({
      by: ["organizationId"],
      _count: { _all: true },
      orderBy: { organizationId: "asc" },
    }),
    prisma.organization.findMany({
      select: { id: true, slug: true },
      orderBy: { id: "asc" },
    }),
  ]);

  assert(primaryLeadCount === 2, `Expected 2 primary-org leads, received ${primaryLeadCount}.`);
  assert(secondaryLeadCount === 0, `Expected 0 secondary-org leads, received ${secondaryLeadCount}.`);
  assert(primaryViewCount === 6, `Expected 6 primary-org saved views, received ${primaryViewCount}.`);
  assert(secondaryViewCount === 0, `Expected 0 secondary-org saved views, received ${secondaryViewCount}.`);
  assert(
    primaryCustomFieldCount === 6,
    `Expected 6 primary-org custom field definitions, received ${primaryCustomFieldCount}.`,
  );
  assert(
    secondaryCustomFieldCount === 0,
    `Expected 0 secondary-org custom field definitions, received ${secondaryCustomFieldCount}.`,
  );

  for (const row of ownerScopeRows.rows) {
    assert(row.invalid_rows === "0", `${row.table_name} has cross-organization ownerMembershipId references.`);
  }

  const primaryEntityTypes = new Set(customFieldScopeRows.rows.map((row) => `${row.organizationId}:${row.entityType}`));
  const expectedEntityTypes = ["LEAD", "CONTACT", "COMPANY", "DEAL", "ACTIVITY", "TASK"];

  for (const entityType of expectedEntityTypes) {
    assert(
      primaryEntityTypes.has(`${ids.orgPrimary}:${entityType}`),
      `Missing custom field definition scope for ${ids.orgPrimary}:${entityType}.`,
    );
  }

  for (const row of savedViewScopeRows.rows) {
    assert(
      row.foreign_membership_refs === "0",
      `Saved views in ${row.organizationId}:${row.entityType} reference another organization.`,
    );
  }

  assert(organizations.length === 2, `Expected 2 organizations, received ${organizations.length}.`);
  assert(
    organizations.some((organization) => organization.id === ids.orgPrimary && organization.slug === "lynxmind-sales"),
    "Primary organization seed is missing or changed.",
  );
  assert(
    organizations.some(
      (organization) => organization.id === ids.orgSecondary && organization.slug === "northwind-ventures",
    ),
    "Secondary organization seed is missing or changed.",
  );

  const membershipMap = new Map(membershipsByOrg.map((row) => [row.organizationId, row._count._all]));
  assert(membershipMap.get(ids.orgPrimary) === 3, "Primary organization membership count drifted from 3.");
  assert(membershipMap.get(ids.orgSecondary) === 1, "Secondary organization membership count drifted from 1.");

  return {
    organizations,
    membershipsByOrg: membershipsByOrg.map((row) => ({
      organizationId: row.organizationId,
      count: row._count._all,
    })),
    customFieldScopes: customFieldScopeRows.rows.map((row) => ({
      organizationId: row.organizationId,
      entityType: row.entityType,
      definitionCount: Number(row.definition_count),
      valueCount: Number(row.value_count),
    })),
    savedViewScopes: savedViewScopeRows.rows.map((row) => ({
      organizationId: row.organizationId,
      entityType: row.entityType,
      count: Number(row.view_count),
    })),
  };
}

async function verifyConstraintsAndIndexes() {
  const [indexRows, constraintRows, triggerRows] = await Promise.all([
    pg.query<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes WHERE schemaname = current_schema() AND indexname = ANY($1::text[]) ORDER BY indexname;`,
      [expectedIndexes],
    ),
    pg.query<{ conname: string }>(
      `SELECT conname FROM pg_constraint WHERE conname = ANY($1::text[]) ORDER BY conname;`,
      [expectedConstraints],
    ),
    pg.query<{ tgname: string }>(`SELECT tgname FROM pg_trigger WHERE NOT tgisinternal AND tgname = $1;`, [
      expectedTrigger,
    ]),
  ]);

  const foundIndexes = new Set(indexRows.rows.map((row) => row.indexname));
  const foundConstraints = new Set(constraintRows.rows.map((row) => row.conname));
  const foundTriggers = new Set(triggerRows.rows.map((row) => row.tgname));

  for (const indexName of expectedIndexes) {
    assert(foundIndexes.has(indexName), `Missing PostgreSQL index: ${indexName}.`);
  }

  for (const constraintName of expectedConstraints) {
    assert(foundConstraints.has(constraintName), `Missing PostgreSQL constraint: ${constraintName}.`);
  }

  assert(foundTriggers.has(expectedTrigger), `Missing PostgreSQL trigger: ${expectedTrigger}.`);

  return {
    indexes: [...foundIndexes].sort(),
    constraints: [...foundConstraints].sort(),
    trigger: expectedTrigger,
  };
}

async function verifySeedIdentity() {
  const [
    leadIds,
    customFieldDefinitionIds,
    customFieldValueIds,
    viewIds,
    roleIds,
    auditEventIds,
    idempotencyIds,
    webhookIds,
  ] = await Promise.all([
    prisma.lead.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.customFieldDefinition.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.customFieldValue.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.savedView.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.role.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.auditEvent.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.idempotencyRecord.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
    prisma.webhookEvent.findMany({ select: { id: true }, orderBy: { id: "asc" } }),
  ]);

  const expectedLeadIds = [ids.leadConverted, ids.leadOpen].sort();
  const expectedCustomFieldDefinitionIds = [
    ids.cfdActivityChannel,
    ids.cfdCompanyRegion,
    ids.cfdContactRole,
    ids.cfdDealContractType,
    ids.cfdLeadBudget,
    ids.cfdTaskEscalated,
  ].sort();
  const expectedCustomFieldValueIds = [
    ids.cfvActivityChannel,
    ids.cfvCompanyRegion,
    ids.cfvContactRole,
    ids.cfvDealContractType,
    ids.cfvLeadBudget,
    ids.cfvTaskEscalated,
  ].sort();

  assert(
    JSON.stringify(leadIds.map((row) => row.id)) === JSON.stringify(expectedLeadIds),
    "Lead IDs do not match the deterministic seed set.",
  );
  assert(
    JSON.stringify(customFieldDefinitionIds.map((row) => row.id)) === JSON.stringify(expectedCustomFieldDefinitionIds),
    "Custom field definition IDs do not match the deterministic seed set.",
  );
  assert(
    JSON.stringify(customFieldValueIds.map((row) => row.id)) === JSON.stringify(expectedCustomFieldValueIds),
    "Custom field value IDs do not match the deterministic seed set.",
  );
  assert(viewIds.length === 6, `Expected 6 saved view IDs, received ${viewIds.length}.`);
  assert(roleIds.length === 10, `Expected 10 role IDs, received ${roleIds.length}.`);
  assert(auditEventIds.length === 1, `Expected 1 audit event, received ${auditEventIds.length}.`);
  assert(idempotencyIds.length === 1, `Expected 1 idempotency record, received ${idempotencyIds.length}.`);
  assert(webhookIds.length === 1, `Expected 1 webhook event, received ${webhookIds.length}.`);

  return {
    leadIds: leadIds.map((row) => row.id),
    customFieldDefinitionIds: customFieldDefinitionIds.map((row) => row.id),
    customFieldValueIds: customFieldValueIds.map((row) => row.id),
    savedViewIds: viewIds.map((row) => row.id),
  };
}

async function main() {
  await pg.connect();

  const countSnapshot = await snapshotCounts();
  assertCounts(countSnapshot);

  const [seedIdentity, tenantIsolation, catalog] = await Promise.all([
    verifySeedIdentity(),
    verifyTenantIsolation(),
    verifyConstraintsAndIndexes(),
  ]);

  console.log(
    JSON.stringify(
      {
        counts: countSnapshot,
        seedIdentity,
        tenantIsolation,
        catalog,
      },
      null,
      2,
    ),
  );
}

async function run() {
  const timeout = setTimeout(() => {
    console.error(`Phase 0B verification timed out after ${VERIFICATION_TIMEOUT_MS}ms.`);
    process.exitCode = 1;
    process.exit(1);
  }, VERIFICATION_TIMEOUT_MS);

  try {
    await main();
  } catch (error) {
    console.error("Phase 0B verification failed.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    clearTimeout(timeout);
    await Promise.allSettled([prisma.$disconnect(), pg.end()]);
  }
}

void run();
