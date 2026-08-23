import { PrismaPg } from "@prisma/adapter-pg";

import {
  ActivityDirection,
  ActivityPriority,
  ActivityStatus,
  ActivityType,
  CompanyIndustry,
  CompanySize,
  CompanySource,
  CompanyType,
  ConfigEntityType,
  ContactLifecycleStage,
  CustomFieldType,
  DealHealth,
  DealPriority,
  DealSource,
  EntitlementStatus,
  InvitationStatus,
  LeadSource,
  LeadStatus,
  MembershipStatus,
  ModuleStatus,
  PipelineStageKind,
  PreferredContactMethod,
  PrismaClient,
  SubscriptionItemStatus,
  SubscriptionStatus,
  WebhookDeliveryStatus,
} from "../src/generated/prisma/client.ts";
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

const databaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL is required to run the Prisma seed.");
}

process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

const NOW = new Date("2026-08-22T12:00:00.000Z");

const ids = {
  userOwner: "user_seed_owner",
  userAdmin: "user_seed_admin",
  userRep: "user_seed_rep",
  userInvited: "user_seed_invited",
  orgPrimary: "org_seed_lynxmind",
  orgSecondary: "org_seed_northwind",
  membershipOwnerPrimary: "mship_seed_owner_primary",
  membershipAdminPrimary: "mship_seed_admin_primary",
  membershipRepPrimary: "mship_seed_rep_primary",
  membershipRepSecondary: "mship_seed_rep_secondary",
  subscriptionPrimary: "sub_seed_primary",
  subscriptionSecondary: "sub_seed_secondary",
  entitlementPrimaryCrm: "ent_seed_primary_crm",
  entitlementSecondaryCrm: "ent_seed_secondary_crm",
  pipelinePrimary: "pipe_seed_primary_sales",
  pipelineSecondary: "pipe_seed_secondary_sales",
  stageDiscoveryPrimary: "stage_seed_primary_discovery",
  stageQualifiedPrimary: "stage_seed_primary_qualified",
  stageProposalPrimary: "stage_seed_primary_proposal",
  stageNegotiationPrimary: "stage_seed_primary_negotiation",
  stageWonPrimary: "stage_seed_primary_won",
  stageLostPrimary: "stage_seed_primary_lost",
  stageDiscoverySecondary: "stage_seed_secondary_discovery",
  stageQualifiedSecondary: "stage_seed_secondary_qualified",
  stageProposalSecondary: "stage_seed_secondary_proposal",
  stageNegotiationSecondary: "stage_seed_secondary_negotiation",
  stageWonSecondary: "stage_seed_secondary_won",
  stageLostSecondary: "stage_seed_secondary_lost",
  roleOwnerPrimary: "role_seed_primary_owner",
  roleAdminPrimary: "role_seed_primary_admin",
  roleManagerPrimary: "role_seed_primary_manager",
  roleRepPrimary: "role_seed_primary_rep",
  roleViewerPrimary: "role_seed_primary_viewer",
  roleOwnerSecondary: "role_seed_secondary_owner",
  roleAdminSecondary: "role_seed_secondary_admin",
  roleManagerSecondary: "role_seed_secondary_manager",
  roleRepSecondary: "role_seed_secondary_rep",
  roleViewerSecondary: "role_seed_secondary_viewer",
  companyAcme: "company_seed_acme",
  contactJordan: "contact_seed_jordan",
  leadOpen: "lead_seed_open",
  leadConverted: "lead_seed_converted",
  dealAcmeExpansion: "deal_seed_acme_expansion",
  linePlatformSeats: "line_seed_platform_seats",
  activityCall: "activity_seed_call",
  activityTask: "activity_seed_task",
  noteDeal: "note_seed_deal",
  tagHot: "tag_seed_hot",
  tagVip: "tag_seed_vip",
  tagPartner: "tag_seed_partner",
  tagStrategic: "tag_seed_strategic",
  invitationPrimary: "invite_seed_primary",
  auditSeed: "audit_seed_bootstrap",
  idempotencySeed: "idem_seed_bootstrap",
  webhookSeed: "webhook_seed_subscription",
  templateApplication: "template_seed_general_sales",
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
};

const roleDefinitions = [
  {
    key: "owner",
    name: "Organization Owner",
    description: "Full control over the tenant, billing, and CRM configuration.",
    isSystem: true,
    permissions: [
      "overview.view",
      "leads.view",
      "leads.create",
      "leads.edit",
      "leads.archive",
      "leads.restore",
      "leads.convert",
      "leads.assign",
      "leads.export",
      "contacts.view",
      "contacts.create",
      "contacts.edit",
      "contacts.archive",
      "contacts.restore",
      "contacts.assign",
      "contacts.export",
      "companies.view",
      "companies.create",
      "companies.edit",
      "companies.archive",
      "companies.restore",
      "companies.assign",
      "companies.export",
      "deals.view",
      "deals.create",
      "deals.edit",
      "deals.archive",
      "deals.restore",
      "deals.assign",
      "deals.export",
      "activities.view",
      "activities.create",
      "activities.edit",
      "activities.assign",
      "activities.export",
      "tasks.view",
      "tasks.create",
      "tasks.edit",
      "tasks.assign",
      "tasks.export",
      "calendar.view",
      "reports.view",
      "reports.export",
      "settings.view",
      "settings.manage",
      "users.view",
      "users.manage",
      "billing.view",
      "billing.manage",
      "organization.delete",
      "ownership.transfer",
    ],
  },
  {
    key: "administrator",
    name: "Administrator",
    description: "Operational admin with full CRM and user-management access.",
    isSystem: true,
    permissions: [
      "overview.view",
      "leads.view",
      "leads.create",
      "leads.edit",
      "leads.archive",
      "leads.restore",
      "leads.convert",
      "leads.assign",
      "leads.export",
      "contacts.view",
      "contacts.create",
      "contacts.edit",
      "contacts.archive",
      "contacts.restore",
      "contacts.assign",
      "contacts.export",
      "companies.view",
      "companies.create",
      "companies.edit",
      "companies.archive",
      "companies.restore",
      "companies.assign",
      "companies.export",
      "deals.view",
      "deals.create",
      "deals.edit",
      "deals.archive",
      "deals.restore",
      "deals.assign",
      "deals.export",
      "activities.view",
      "activities.create",
      "activities.edit",
      "activities.assign",
      "activities.export",
      "tasks.view",
      "tasks.create",
      "tasks.edit",
      "tasks.assign",
      "tasks.export",
      "calendar.view",
      "reports.view",
      "reports.export",
      "settings.view",
      "settings.manage",
      "users.view",
      "users.manage",
      "billing.view",
    ],
  },
  {
    key: "sales_manager",
    name: "Sales Manager",
    description: "Org-wide CRM management without tenant administration.",
    isSystem: true,
    permissions: [
      "overview.view",
      "leads.view",
      "leads.create",
      "leads.edit",
      "leads.archive",
      "leads.restore",
      "leads.convert",
      "leads.assign",
      "leads.export",
      "contacts.view",
      "contacts.create",
      "contacts.edit",
      "contacts.archive",
      "contacts.restore",
      "contacts.assign",
      "contacts.export",
      "companies.view",
      "companies.create",
      "companies.edit",
      "companies.archive",
      "companies.restore",
      "companies.assign",
      "companies.export",
      "deals.view",
      "deals.create",
      "deals.edit",
      "deals.archive",
      "deals.restore",
      "deals.assign",
      "deals.export",
      "activities.view",
      "activities.create",
      "activities.edit",
      "activities.assign",
      "activities.export",
      "tasks.view",
      "tasks.create",
      "tasks.edit",
      "tasks.assign",
      "tasks.export",
      "calendar.view",
      "reports.view",
      "reports.export",
      "settings.view",
      "users.view",
    ],
  },
  {
    key: "sales_representative",
    name: "Sales Representative",
    description: "Works owned CRM records and can see the wider pipeline.",
    isSystem: true,
    permissions: [
      "overview.view",
      "leads.view",
      "leads.create",
      "leads.edit",
      "leads.archive",
      "leads.restore",
      "leads.convert",
      "contacts.view",
      "contacts.create",
      "contacts.edit",
      "contacts.archive",
      "contacts.restore",
      "companies.view",
      "companies.create",
      "companies.edit",
      "companies.archive",
      "companies.restore",
      "deals.view",
      "deals.create",
      "deals.edit",
      "deals.archive",
      "deals.restore",
      "activities.view",
      "activities.create",
      "activities.edit",
      "tasks.view",
      "tasks.create",
      "tasks.edit",
      "calendar.view",
      "reports.view",
    ],
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Read-only access to CRM records and reports.",
    isSystem: true,
    permissions: [
      "overview.view",
      "leads.view",
      "contacts.view",
      "companies.view",
      "deals.view",
      "activities.view",
      "tasks.view",
      "calendar.view",
      "reports.view",
    ],
  },
] as const;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeDomain(value: string): string {
  return value.trim().toLowerCase();
}

function createRoleSeed(orgId: string, roleIds: Record<string, string>) {
  const roles = roleDefinitions.map((role) => ({
    id: roleIds[role.key],
    organizationId: orgId,
    key: role.key,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    version: 1,
  }));

  const permissions = roleDefinitions.flatMap((role) =>
    role.permissions.map((permission) => ({
      id: `${orgId}_${role.key}_${permission}`.replace(/[^a-zA-Z0-9_]/g, "_"),
      organizationId: orgId,
      roleId: roleIds[role.key],
      permission,
      createdAt: NOW,
    })),
  );

  return { roles, permissions };
}

const primaryRoleIds = {
  owner: ids.roleOwnerPrimary,
  administrator: ids.roleAdminPrimary,
  sales_manager: ids.roleManagerPrimary,
  sales_representative: ids.roleRepPrimary,
  viewer: ids.roleViewerPrimary,
};

const secondaryRoleIds = {
  owner: ids.roleOwnerSecondary,
  administrator: ids.roleAdminSecondary,
  sales_manager: ids.roleManagerSecondary,
  sales_representative: ids.roleRepSecondary,
  viewer: ids.roleViewerSecondary,
};

async function main() {
  const primaryRoles = createRoleSeed(ids.orgPrimary, primaryRoleIds);
  const secondaryRoles = createRoleSeed(ids.orgSecondary, secondaryRoleIds);

  await prisma.$transaction(
    async (tx) => {
      await tx.companyTag.deleteMany();
      await tx.contactTag.deleteMany();
      await tx.dealTag.deleteMany();
      await tx.leadTag.deleteMany();
      await tx.note.deleteMany();
      await tx.activity.deleteMany();
      await tx.dealStageHistory.deleteMany();
      await tx.dealLineItem.deleteMany();
      await tx.lead.updateMany({
        data: {
          convertedContactId: null,
          convertedDealId: null,
        },
      });
      await tx.company.updateMany({
        data: {
          primaryContactId: null,
        },
      });
      await tx.lead.deleteMany();
      await tx.deal.deleteMany();
      await tx.contact.deleteMany();
      await tx.company.deleteMany();
      await tx.customFieldValue.deleteMany();
      await tx.customFieldDefinition.deleteMany();
      await tx.savedView.deleteMany();
      await tx.entityLabelConfiguration.deleteMany();
      await tx.industryTemplateApplication.deleteMany();
      await tx.pipelineStage.deleteMany();
      await tx.pipeline.deleteMany();
      await tx.idempotencyRecord.deleteMany();
      await tx.auditEvent.deleteMany();
      await tx.webhookEvent.deleteMany();
      await tx.invitationProjection.deleteMany();
      await tx.organizationModuleEntitlement.deleteMany();
      await tx.subscriptionItem.deleteMany();
      await tx.subscription.deleteMany();
      await tx.rolePermission.deleteMany();
      await tx.organizationMembership.deleteMany();
      await tx.role.deleteMany();
      await tx.module.deleteMany();
      await tx.tag.deleteMany();
      await tx.organization.deleteMany();
      await tx.user.deleteMany();

      await tx.user.createMany({
        data: [
          {
            id: ids.userOwner,
            email: "owner@lynxmind.example",
            normalizedEmail: normalizeEmail("owner@lynxmind.example"),
            name: "Riley Morgan",
            clerkUserId: "clerk_user_seed_owner",
            emailVerifiedAt: NOW,
            lastLoginAt: NOW,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.userAdmin,
            email: "admin@lynxmind.example",
            normalizedEmail: normalizeEmail("admin@lynxmind.example"),
            name: "Parker Ellis",
            clerkUserId: "clerk_user_seed_admin",
            emailVerifiedAt: NOW,
            lastLoginAt: NOW,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.userRep,
            email: "rep@lynxmind.example",
            normalizedEmail: normalizeEmail("rep@lynxmind.example"),
            name: "Jordan Lee",
            clerkUserId: "clerk_user_seed_rep",
            emailVerifiedAt: NOW,
            lastLoginAt: NOW,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.userInvited,
            email: "future.rep@lynxmind.example",
            normalizedEmail: normalizeEmail("future.rep@lynxmind.example"),
            name: "Casey Patel",
            clerkUserId: "clerk_user_seed_invited",
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.organization.createMany({
        data: [
          {
            id: ids.orgPrimary,
            name: "LynxMind Sales",
            slug: "lynxmind-sales",
            defaultCurrency: "USD",
            clerkOrganizationId: "clerk_org_seed_primary",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.orgSecondary,
            name: "Northwind Ventures",
            slug: "northwind-ventures",
            defaultCurrency: "USD",
            clerkOrganizationId: "clerk_org_seed_secondary",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.module.createMany({
        data: [
          {
            key: "crm",
            name: "CRM",
            description: "Sales CRM module.",
            status: ModuleStatus.ACTIVE,
            routePrefix: "/dashboard/crm",
            sidebarGroup: "CRM",
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            key: "finance",
            name: "Finance",
            description: "Finance module reserved for later phases.",
            status: ModuleStatus.UPCOMING,
            routePrefix: "/dashboard/finance",
            sidebarGroup: "Finance",
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            key: "hr",
            name: "HR",
            description: "HR module reserved for later phases.",
            status: ModuleStatus.UPCOMING,
            routePrefix: "/dashboard/hr",
            sidebarGroup: "People",
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.role.createMany({
        data: [...primaryRoles.roles, ...secondaryRoles.roles].map((role) => ({
          ...role,
          createdAt: NOW,
          updatedAt: NOW,
        })),
      });

      await tx.rolePermission.createMany({
        data: [...primaryRoles.permissions, ...secondaryRoles.permissions],
      });

      await tx.organizationMembership.createMany({
        data: [
          {
            id: ids.membershipOwnerPrimary,
            organizationId: ids.orgPrimary,
            userId: ids.userOwner,
            roleId: ids.roleOwnerPrimary,
            clerkMembershipId: "clerk_membership_seed_owner_primary",
            status: MembershipStatus.ACTIVE,
            joinedAt: NOW,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.membershipAdminPrimary,
            organizationId: ids.orgPrimary,
            userId: ids.userAdmin,
            roleId: ids.roleAdminPrimary,
            clerkMembershipId: "clerk_membership_seed_admin_primary",
            status: MembershipStatus.ACTIVE,
            joinedAt: NOW,
            invitedByMembershipId: ids.membershipOwnerPrimary,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.membershipRepPrimary,
            organizationId: ids.orgPrimary,
            userId: ids.userRep,
            roleId: ids.roleRepPrimary,
            clerkMembershipId: "clerk_membership_seed_rep_primary",
            status: MembershipStatus.ACTIVE,
            joinedAt: NOW,
            invitedByMembershipId: ids.membershipAdminPrimary,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.membershipRepSecondary,
            organizationId: ids.orgSecondary,
            userId: ids.userRep,
            roleId: ids.roleRepSecondary,
            clerkMembershipId: "clerk_membership_seed_rep_secondary",
            status: MembershipStatus.ACTIVE,
            joinedAt: NOW,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.subscription.createMany({
        data: [
          {
            id: ids.subscriptionPrimary,
            organizationId: ids.orgPrimary,
            planKey: "crm-growth",
            status: SubscriptionStatus.ACTIVE,
            seats: 15,
            currentPeriodStart: new Date("2026-08-01T00:00:00.000Z"),
            currentPeriodEnd: new Date("2026-08-31T23:59:59.000Z"),
            provider: "seed",
            externalId: "seed_sub_primary",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.subscriptionSecondary,
            organizationId: ids.orgSecondary,
            planKey: "crm-trial",
            status: SubscriptionStatus.TRIALING,
            seats: 5,
            currentPeriodStart: new Date("2026-08-15T00:00:00.000Z"),
            currentPeriodEnd: new Date("2026-08-29T23:59:59.000Z"),
            trialEndsAt: new Date("2026-08-29T23:59:59.000Z"),
            provider: "seed",
            externalId: "seed_sub_secondary",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.subscriptionItem.createMany({
        data: [
          {
            id: "subitem_seed_primary_crm",
            organizationId: ids.orgPrimary,
            subscriptionId: ids.subscriptionPrimary,
            moduleKey: "crm",
            status: SubscriptionItemStatus.ACTIVE,
            quantity: 15,
            unitAmountMinor: 29900,
            currency: "USD",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "subitem_seed_secondary_crm",
            organizationId: ids.orgSecondary,
            subscriptionId: ids.subscriptionSecondary,
            moduleKey: "crm",
            status: SubscriptionItemStatus.TRIAL,
            quantity: 5,
            unitAmountMinor: 0,
            currency: "USD",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.organizationModuleEntitlement.createMany({
        data: [
          {
            id: ids.entitlementPrimaryCrm,
            organizationId: ids.orgPrimary,
            moduleKey: "crm",
            status: EntitlementStatus.ACTIVE,
            grantedBySubscriptionId: ids.subscriptionPrimary,
            activatedAt: NOW,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.entitlementSecondaryCrm,
            organizationId: ids.orgSecondary,
            moduleKey: "crm",
            status: EntitlementStatus.TRIAL,
            trialEndsAt: new Date("2026-08-29T23:59:59.000Z"),
            grantedBySubscriptionId: ids.subscriptionSecondary,
            activatedAt: new Date("2026-08-15T09:00:00.000Z"),
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.invitationProjection.create({
        data: {
          id: ids.invitationPrimary,
          organizationId: ids.orgPrimary,
          roleId: ids.roleRepPrimary,
          invitedByMembershipId: ids.membershipAdminPrimary,
          email: "future.rep@lynxmind.example",
          normalizedEmail: normalizeEmail("future.rep@lynxmind.example"),
          tokenHash: "seed_invitation_hash_primary",
          status: InvitationStatus.PENDING,
          expiresAt: new Date("2026-08-29T23:59:59.000Z"),
          metadata: {
            source: "seed",
            note: "Pending invite to demonstrate the invitation projection shape.",
          },
          version: 1,
          createdAt: NOW,
          updatedAt: NOW,
        },
      });

      await tx.pipeline.createMany({
        data: [
          {
            id: ids.pipelinePrimary,
            organizationId: ids.orgPrimary,
            name: "Sales Pipeline",
            isDefault: true,
            position: 0,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.pipelineSecondary,
            organizationId: ids.orgSecondary,
            name: "Sales Pipeline",
            isDefault: true,
            position: 0,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.pipelineStage.createMany({
        data: [
          {
            id: ids.stageDiscoveryPrimary,
            organizationId: ids.orgPrimary,
            pipelineId: ids.pipelinePrimary,
            name: "Discovery",
            position: 0,
            probability: 10,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageQualifiedPrimary,
            organizationId: ids.orgPrimary,
            pipelineId: ids.pipelinePrimary,
            name: "Qualified",
            position: 1,
            probability: 25,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageProposalPrimary,
            organizationId: ids.orgPrimary,
            pipelineId: ids.pipelinePrimary,
            name: "Proposal Sent",
            position: 2,
            probability: 45,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageNegotiationPrimary,
            organizationId: ids.orgPrimary,
            pipelineId: ids.pipelinePrimary,
            name: "Negotiation",
            position: 3,
            probability: 70,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageWonPrimary,
            organizationId: ids.orgPrimary,
            pipelineId: ids.pipelinePrimary,
            name: "Closed Won",
            position: 4,
            probability: 100,
            kind: PipelineStageKind.WON,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageLostPrimary,
            organizationId: ids.orgPrimary,
            pipelineId: ids.pipelinePrimary,
            name: "Closed Lost",
            position: 5,
            probability: 0,
            kind: PipelineStageKind.LOST,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageDiscoverySecondary,
            organizationId: ids.orgSecondary,
            pipelineId: ids.pipelineSecondary,
            name: "Discovery",
            position: 0,
            probability: 10,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageQualifiedSecondary,
            organizationId: ids.orgSecondary,
            pipelineId: ids.pipelineSecondary,
            name: "Qualified",
            position: 1,
            probability: 25,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageProposalSecondary,
            organizationId: ids.orgSecondary,
            pipelineId: ids.pipelineSecondary,
            name: "Proposal Sent",
            position: 2,
            probability: 45,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageNegotiationSecondary,
            organizationId: ids.orgSecondary,
            pipelineId: ids.pipelineSecondary,
            name: "Negotiation",
            position: 3,
            probability: 70,
            kind: PipelineStageKind.OPEN,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageWonSecondary,
            organizationId: ids.orgSecondary,
            pipelineId: ids.pipelineSecondary,
            name: "Closed Won",
            position: 4,
            probability: 100,
            kind: PipelineStageKind.WON,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.stageLostSecondary,
            organizationId: ids.orgSecondary,
            pipelineId: ids.pipelineSecondary,
            name: "Closed Lost",
            position: 5,
            probability: 0,
            kind: PipelineStageKind.LOST,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.tag.createMany({
        data: [
          {
            id: ids.tagHot,
            organizationId: ids.orgPrimary,
            name: "Hot",
            color: "red",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.tagVip,
            organizationId: ids.orgPrimary,
            name: "VIP",
            color: "amber",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.tagPartner,
            organizationId: ids.orgPrimary,
            name: "Partner",
            color: "sky",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.tagStrategic,
            organizationId: ids.orgPrimary,
            name: "Strategic",
            color: "emerald",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.company.create({
        data: {
          id: ids.companyAcme,
          organizationId: ids.orgPrimary,
          ownerMembershipId: ids.membershipAdminPrimary,
          name: "Acme Industrial Group",
          domain: "acme-industrial.example",
          normalizedDomain: normalizeDomain("acme-industrial.example"),
          website: "https://acme-industrial.example",
          industry: CompanyIndustry.MANUFACTURING,
          type: CompanyType.PROSPECT,
          size: CompanySize.SIZE_201_500,
          location: "Chicago, IL",
          phone: "+1-312-555-0120",
          address: "401 Market St, Chicago, IL",
          description: "Multi-site manufacturer evaluating CRM rollout standardization.",
          source: CompanySource.REFERRAL,
          lastActivityAt: new Date("2026-08-21T15:15:00.000Z"),
          version: 1,
          createdAt: new Date("2026-08-05T09:00:00.000Z"),
          updatedAt: NOW,
        },
      });

      await tx.contact.create({
        data: {
          id: ids.contactJordan,
          organizationId: ids.orgPrimary,
          ownerMembershipId: ids.membershipRepPrimary,
          companyId: ids.companyAcme,
          name: "Jordan Lee",
          jobTitle: "Operations Director",
          email: "jordan.lee@acme-industrial.example",
          normalizedEmail: normalizeEmail("jordan.lee@acme-industrial.example"),
          phone: "+1-312-555-0182",
          lifecycleStage: ContactLifecycleStage.OPPORTUNITY,
          source: LeadSource.REFERRAL,
          location: "Chicago, IL",
          timezone: "America/Chicago",
          preferredContact: PreferredContactMethod.EMAIL,
          profileUrl: "https://www.linkedin.com/in/jordan-lee-demo",
          lastContactedAt: new Date("2026-08-21T15:15:00.000Z"),
          nextActivityAt: new Date("2026-08-25T16:00:00.000Z"),
          version: 1,
          createdAt: new Date("2026-08-06T11:00:00.000Z"),
          updatedAt: NOW,
        },
      });

      await tx.company.update({
        where: { id: ids.companyAcme },
        data: {
          primaryContactId: ids.contactJordan,
          updatedAt: NOW,
        },
      });

      await tx.deal.create({
        data: {
          id: ids.dealAcmeExpansion,
          organizationId: ids.orgPrimary,
          ownerMembershipId: ids.membershipRepPrimary,
          companyId: ids.companyAcme,
          primaryContactId: ids.contactJordan,
          pipelineId: ids.pipelinePrimary,
          stageId: ids.stageNegotiationPrimary,
          name: "Acme North America Rollout",
          valueMinor: 18500000,
          currency: "USD",
          probability: 70,
          health: DealHealth.HEALTHY,
          priority: DealPriority.HIGH,
          source: DealSource.REFERRAL,
          expectedCloseDate: new Date("2026-09-05T00:00:00.000Z"),
          lastActivityAt: new Date("2026-08-21T15:15:00.000Z"),
          nextActivityAt: new Date("2026-08-25T16:00:00.000Z"),
          proposalSummary: "Three-country rollout with implementation services and enterprise support.",
          version: 1,
          createdAt: new Date("2026-08-07T10:00:00.000Z"),
          updatedAt: NOW,
        },
      });

      await tx.dealLineItem.create({
        data: {
          id: ids.linePlatformSeats,
          organizationId: ids.orgPrimary,
          dealId: ids.dealAcmeExpansion,
          name: "Enterprise CRM seats",
          quantity: "125",
          unitPriceMinor: 148000,
          position: 0,
          createdAt: NOW,
          updatedAt: NOW,
        },
      });

      await tx.lead.createMany({
        data: [
          {
            id: ids.leadOpen,
            organizationId: ids.orgPrimary,
            ownerMembershipId: ids.membershipRepPrimary,
            name: "Avery Stone",
            jobTitle: "Revenue Operations Manager",
            companyName: "Atlas Fleet Services",
            email: "avery.stone@atlasfleet.example",
            normalizedEmail: normalizeEmail("avery.stone@atlasfleet.example"),
            phone: "+1-617-555-0113",
            source: LeadSource.WEBSITE,
            status: LeadStatus.NEW,
            score: 82,
            location: "Boston, MA",
            timezone: "America/New_York",
            preferredContact: PreferredContactMethod.EMAIL,
            companyWebsite: "https://atlasfleet.example",
            companyIndustry: CompanyIndustry.LOGISTICS,
            companySize: CompanySize.SIZE_51_200,
            lastActivityAt: new Date("2026-08-20T13:45:00.000Z"),
            nextActivityAt: new Date("2026-08-24T14:00:00.000Z"),
            version: 1,
            createdAt: new Date("2026-08-18T09:30:00.000Z"),
            updatedAt: NOW,
          },
          {
            id: ids.leadConverted,
            organizationId: ids.orgPrimary,
            ownerMembershipId: ids.membershipRepPrimary,
            companyId: ids.companyAcme,
            convertedContactId: ids.contactJordan,
            convertedCompanyId: ids.companyAcme,
            convertedDealId: ids.dealAcmeExpansion,
            convertedByMembershipId: ids.membershipRepPrimary,
            name: "Jordan Lee",
            jobTitle: "Operations Director",
            companyName: "Acme Industrial Group",
            email: "jordan.lee@acme-industrial.example",
            normalizedEmail: normalizeEmail("jordan.lee@acme-industrial.example"),
            phone: "+1-312-555-0182",
            source: LeadSource.REFERRAL,
            status: LeadStatus.QUALIFIED,
            score: 91,
            location: "Chicago, IL",
            timezone: "America/Chicago",
            preferredContact: PreferredContactMethod.EMAIL,
            companyWebsite: "https://acme-industrial.example",
            companyIndustry: CompanyIndustry.MANUFACTURING,
            companySize: CompanySize.SIZE_201_500,
            lastActivityAt: new Date("2026-08-21T15:15:00.000Z"),
            nextActivityAt: new Date("2026-08-25T16:00:00.000Z"),
            convertedAt: new Date("2026-08-12T16:00:00.000Z"),
            version: 1,
            createdAt: new Date("2026-08-08T08:30:00.000Z"),
            updatedAt: NOW,
          },
        ],
      });

      await tx.activity.createMany({
        data: [
          {
            id: ids.activityCall,
            organizationId: ids.orgPrimary,
            ownerMembershipId: ids.membershipRepPrimary,
            contactId: ids.contactJordan,
            companyId: ids.companyAcme,
            dealId: ids.dealAcmeExpansion,
            type: ActivityType.CALL,
            title: "Solution review call",
            description: "Walked through rollout plan, seat assumptions, and security questionnaire follow-up.",
            status: ActivityStatus.COMPLETED,
            priority: ActivityPriority.HIGH,
            direction: ActivityDirection.OUTBOUND,
            scheduledAt: new Date("2026-08-21T15:00:00.000Z"),
            completedAt: new Date("2026-08-21T15:45:00.000Z"),
            durationMinutes: 45,
            outcome: "Stakeholders approved moving to procurement review.",
            completionNotes: "Security addendum requested before final sign-off.",
            version: 1,
            createdAt: new Date("2026-08-21T14:00:00.000Z"),
            updatedAt: NOW,
          },
          {
            id: ids.activityTask,
            organizationId: ids.orgPrimary,
            ownerMembershipId: ids.membershipRepPrimary,
            leadId: ids.leadOpen,
            type: ActivityType.TASK,
            title: "Send discovery deck",
            description: "Share the logistics template and schedule next-step demo.",
            status: ActivityStatus.TO_DO,
            priority: ActivityPriority.MEDIUM,
            scheduledAt: new Date("2026-08-24T14:00:00.000Z"),
            dueAt: new Date("2026-08-24T16:00:00.000Z"),
            reminderAt: new Date("2026-08-24T13:00:00.000Z"),
            version: 1,
            createdAt: new Date("2026-08-22T08:00:00.000Z"),
            updatedAt: NOW,
          },
        ],
      });

      await tx.note.create({
        data: {
          id: ids.noteDeal,
          organizationId: ids.orgPrimary,
          authorMembershipId: ids.membershipAdminPrimary,
          dealId: ids.dealAcmeExpansion,
          content: "Procurement asked for annual invoicing and implementation milestone detail.",
          pinned: true,
          version: 1,
          createdAt: new Date("2026-08-21T18:10:00.000Z"),
          updatedAt: NOW,
        },
      });

      await tx.dealStageHistory.createMany({
        data: [
          {
            id: "stagehist_seed_created",
            organizationId: ids.orgPrimary,
            dealId: ids.dealAcmeExpansion,
            fromStageId: null,
            toStageId: ids.stageDiscoveryPrimary,
            changedByMembershipId: ids.membershipRepPrimary,
            changedAt: new Date("2026-08-07T10:00:00.000Z"),
          },
          {
            id: "stagehist_seed_qualified",
            organizationId: ids.orgPrimary,
            dealId: ids.dealAcmeExpansion,
            fromStageId: ids.stageDiscoveryPrimary,
            toStageId: ids.stageQualifiedPrimary,
            changedByMembershipId: ids.membershipRepPrimary,
            changedAt: new Date("2026-08-10T12:00:00.000Z"),
          },
          {
            id: "stagehist_seed_proposal",
            organizationId: ids.orgPrimary,
            dealId: ids.dealAcmeExpansion,
            fromStageId: ids.stageQualifiedPrimary,
            toStageId: ids.stageProposalPrimary,
            changedByMembershipId: ids.membershipRepPrimary,
            changedAt: new Date("2026-08-15T14:30:00.000Z"),
          },
          {
            id: "stagehist_seed_negotiation",
            organizationId: ids.orgPrimary,
            dealId: ids.dealAcmeExpansion,
            fromStageId: ids.stageProposalPrimary,
            toStageId: ids.stageNegotiationPrimary,
            changedByMembershipId: ids.membershipRepPrimary,
            reason: "Pricing and rollout plan accepted pending procurement.",
            changedAt: new Date("2026-08-20T11:15:00.000Z"),
          },
        ],
      });

      await tx.leadTag.create({
        data: {
          organizationId: ids.orgPrimary,
          leadId: ids.leadOpen,
          tagId: ids.tagHot,
          addedByMembershipId: ids.membershipRepPrimary,
          createdAt: NOW,
        },
      });

      await tx.contactTag.create({
        data: {
          organizationId: ids.orgPrimary,
          contactId: ids.contactJordan,
          tagId: ids.tagVip,
          addedByMembershipId: ids.membershipAdminPrimary,
          createdAt: NOW,
        },
      });

      await tx.companyTag.create({
        data: {
          organizationId: ids.orgPrimary,
          companyId: ids.companyAcme,
          tagId: ids.tagPartner,
          addedByMembershipId: ids.membershipAdminPrimary,
          createdAt: NOW,
        },
      });

      await tx.dealTag.create({
        data: {
          organizationId: ids.orgPrimary,
          dealId: ids.dealAcmeExpansion,
          tagId: ids.tagStrategic,
          addedByMembershipId: ids.membershipAdminPrimary,
          createdAt: NOW,
        },
      });

      await tx.customFieldDefinition.createMany({
        data: [
          {
            id: ids.cfdLeadBudget,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.LEAD,
            key: "lead.custom.budget",
            systemName: "budget",
            displayLabel: "Budget",
            description: "Estimated budget for the opportunity.",
            fieldType: CustomFieldType.CURRENCY,
            required: false,
            visibleInTable: true,
            visibleInForm: true,
            position: 12,
            width: 150,
            defaultValue: 50000,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfdContactRole,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.CONTACT,
            key: "contact.custom.buying_role",
            systemName: "buying_role",
            displayLabel: "Buying Role",
            description: "How this contact participates in the deal process.",
            fieldType: CustomFieldType.SINGLE_SELECT,
            options: [
              { id: "economic_buyer", label: "Economic Buyer" },
              { id: "champion", label: "Champion" },
              { id: "technical_reviewer", label: "Technical Reviewer" },
            ],
            visibleInTable: true,
            visibleInForm: true,
            position: 12,
            width: 180,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfdCompanyRegion,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.COMPANY,
            key: "company.custom.region",
            systemName: "region",
            displayLabel: "Operating Region",
            description: "Primary business region for the company.",
            fieldType: CustomFieldType.SINGLE_SELECT,
            options: [
              { id: "north_america", label: "North America" },
              { id: "emea", label: "EMEA" },
              { id: "apac", label: "APAC" },
            ],
            visibleInTable: true,
            visibleInForm: true,
            position: 12,
            width: 180,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfdDealContractType,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.DEAL,
            key: "deal.custom.contract_type",
            systemName: "contract_type",
            displayLabel: "Contract Type",
            description: "Preferred commercial structure for the deal.",
            fieldType: CustomFieldType.SINGLE_SELECT,
            options: [
              { id: "subscription", label: "Subscription" },
              { id: "pilot", label: "Pilot" },
              { id: "services", label: "Services" },
            ],
            visibleInTable: true,
            visibleInForm: true,
            position: 12,
            width: 180,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfdActivityChannel,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.ACTIVITY,
            key: "activity.custom.channel_code",
            systemName: "channel_code",
            displayLabel: "Channel Code",
            description: "Internal code used by the revenue operations team.",
            fieldType: CustomFieldType.TEXT,
            visibleInTable: false,
            visibleInForm: true,
            position: 12,
            width: 160,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfdTaskEscalated,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.TASK,
            key: "task.custom.escalated",
            systemName: "escalated",
            displayLabel: "Escalated",
            description: "Marks a task that needs management follow-up.",
            fieldType: CustomFieldType.CHECKBOX,
            visibleInTable: true,
            visibleInForm: true,
            position: 12,
            width: 140,
            defaultValue: false,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.customFieldValue.createMany({
        data: [
          {
            id: ids.cfvLeadBudget,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.LEAD,
            recordId: ids.leadOpen,
            fieldDefinitionId: ids.cfdLeadBudget,
            valueNumber: 78000,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfvContactRole,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.CONTACT,
            recordId: ids.contactJordan,
            fieldDefinitionId: ids.cfdContactRole,
            valueText: "Champion",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfvCompanyRegion,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.COMPANY,
            recordId: ids.companyAcme,
            fieldDefinitionId: ids.cfdCompanyRegion,
            valueText: "North America",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfvDealContractType,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.DEAL,
            recordId: ids.dealAcmeExpansion,
            fieldDefinitionId: ids.cfdDealContractType,
            valueText: "Subscription",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfvActivityChannel,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.ACTIVITY,
            recordId: ids.activityCall,
            fieldDefinitionId: ids.cfdActivityChannel,
            valueText: "REVOPS-CALL",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: ids.cfvTaskEscalated,
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.TASK,
            recordId: ids.activityTask,
            fieldDefinitionId: ids.cfdTaskEscalated,
            valueBoolean: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.savedView.createMany({
        data: [
          {
            id: "view_seed_leads_all",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.LEAD,
            ownerMembershipId: ids.membershipOwnerPrimary,
            name: "All Leads",
            columnOrder: ["lead.name", "lead.status", "lead.owner", "lead.nextActivity"],
            columnVisibility: {
              "lead.name": true,
              "lead.status": true,
              "lead.owner": true,
              "lead.nextActivity": true,
            },
            columnWidths: {
              "lead.name": 240,
              "lead.status": 150,
              "lead.owner": 180,
              "lead.nextActivity": 150,
            },
            sortRules: [{ fieldKey: "lead.createdAt", direction: "desc" }],
            filterRules: [{ id: "lead-active", fieldKey: "lead.archivedAt", operator: "isEmpty" }],
            isDefault: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "view_seed_contacts_all",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.CONTACT,
            ownerMembershipId: ids.membershipOwnerPrimary,
            name: "All Contacts",
            columnOrder: ["contact.name", "contact.company", "contact.lifecycleStage"],
            columnVisibility: {
              "contact.name": true,
              "contact.company": true,
              "contact.lifecycleStage": true,
            },
            columnWidths: {
              "contact.name": 240,
              "contact.company": 200,
              "contact.lifecycleStage": 170,
            },
            sortRules: [{ fieldKey: "contact.updatedAt", direction: "desc" }],
            filterRules: [],
            isDefault: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "view_seed_companies_all",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.COMPANY,
            ownerMembershipId: ids.membershipOwnerPrimary,
            name: "All Companies",
            columnOrder: ["company.name", "company.type", "company.owner"],
            columnVisibility: {
              "company.name": true,
              "company.type": true,
              "company.owner": true,
            },
            columnWidths: {
              "company.name": 240,
              "company.type": 160,
              "company.owner": 180,
            },
            sortRules: [{ fieldKey: "company.updatedAt", direction: "desc" }],
            filterRules: [],
            isDefault: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "view_seed_deals_open",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.DEAL,
            ownerMembershipId: ids.membershipOwnerPrimary,
            name: "Open Deals",
            columnOrder: ["deal.name", "deal.stage", "deal.value", "deal.owner"],
            columnVisibility: {
              "deal.name": true,
              "deal.stage": true,
              "deal.value": true,
              "deal.owner": true,
            },
            columnWidths: {
              "deal.name": 220,
              "deal.stage": 150,
              "deal.value": 140,
              "deal.owner": 170,
            },
            sortRules: [{ fieldKey: "deal.expectedClose", direction: "asc" }],
            filterRules: [
              {
                id: "deal-open",
                fieldKey: "deal.stage",
                operator: "in",
                value: ["Discovery", "Qualified", "Proposal Sent", "Negotiation"],
              },
            ],
            isDefault: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "view_seed_activities_upcoming",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.ACTIVITY,
            ownerMembershipId: ids.membershipOwnerPrimary,
            name: "Upcoming Activities",
            columnOrder: ["activity.title", "activity.status", "activity.owner", "activity.scheduledAt"],
            columnVisibility: {
              "activity.title": true,
              "activity.status": true,
              "activity.owner": true,
              "activity.scheduledAt": true,
            },
            columnWidths: {
              "activity.title": 260,
              "activity.status": 140,
              "activity.owner": 170,
              "activity.scheduledAt": 180,
            },
            sortRules: [{ fieldKey: "activity.scheduledAt", direction: "asc" }],
            filterRules: [
              {
                id: "activity-upcoming",
                fieldKey: "activity.status",
                operator: "in",
                value: ["Scheduled", "To Do", "In Progress"],
              },
            ],
            isDefault: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "view_seed_tasks_my",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.TASK,
            ownerMembershipId: ids.membershipRepPrimary,
            name: "My Tasks",
            columnOrder: ["task.title", "task.status", "task.priority", "task.dueAt"],
            columnVisibility: {
              "task.title": true,
              "task.status": true,
              "task.priority": true,
              "task.dueAt": true,
            },
            columnWidths: {
              "task.title": 260,
              "task.status": 140,
              "task.priority": 140,
              "task.dueAt": 180,
            },
            sortRules: [{ fieldKey: "task.dueAt", direction: "asc" }],
            filterRules: [{ id: "task-mine", fieldKey: "task.owner", operator: "equalsMe" }],
            isDefault: true,
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.entityLabelConfiguration.createMany({
        data: [
          {
            id: "label_seed_lead",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.LEAD,
            singularLabel: "Lead",
            pluralLabel: "Leads",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "label_seed_contact",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.CONTACT,
            singularLabel: "Contact",
            pluralLabel: "Contacts",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "label_seed_company",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.COMPANY,
            singularLabel: "Company",
            pluralLabel: "Companies",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "label_seed_deal",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.DEAL,
            singularLabel: "Deal",
            pluralLabel: "Deals",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "label_seed_activity",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.ACTIVITY,
            singularLabel: "Activity",
            pluralLabel: "Activities",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
          {
            id: "label_seed_task",
            organizationId: ids.orgPrimary,
            entityType: ConfigEntityType.TASK,
            singularLabel: "Task",
            pluralLabel: "Tasks",
            version: 1,
            createdAt: NOW,
            updatedAt: NOW,
          },
        ],
      });

      await tx.industryTemplateApplication.create({
        data: {
          id: ids.templateApplication,
          organizationId: ids.orgPrimary,
          appliedByMembershipId: ids.membershipOwnerPrimary,
          templateKey: "general_sales",
          templateVersion: "1.0.0",
          templateName: "General Sales",
          snapshot: {
            appliedAt: NOW.toISOString(),
            addedFields: ["lead.custom.budget", "deal.custom.contract_type"],
            addedViews: ["All Leads", "Open Deals", "My Tasks"],
          },
          createdAt: NOW,
        },
      });

      await tx.auditEvent.create({
        data: {
          id: ids.auditSeed,
          organizationId: ids.orgPrimary,
          actorUserId: ids.userOwner,
          actorMembershipId: ids.membershipOwnerPrimary,
          entityType: "organization",
          entityId: ids.orgPrimary,
          action: "seed.initialized",
          summary: "Phase 0A deterministic bootstrap created the tenant foundation.",
          diff: {
            organizations: 2,
            memberships: 4,
            modules: 3,
            crmSeeded: true,
          },
          requestId: "seed-request-20260822",
          metadata: {
            seededAt: NOW.toISOString(),
          },
          createdAt: NOW,
        },
      });

      await tx.idempotencyRecord.create({
        data: {
          id: ids.idempotencySeed,
          organizationId: ids.orgPrimary,
          membershipId: ids.membershipOwnerPrimary,
          key: "seed-bootstrap-20260822",
          scope: "seed/bootstrap",
          requestHash: "seed_request_hash_v1",
          status: "COMPLETED",
          responseStatusCode: 200,
          responseBody: {
            ok: true,
            message: "Deterministic Phase 0A bootstrap completed.",
          },
          lockedAt: NOW,
          completedAt: NOW,
          expiresAt: new Date("2026-08-23T12:00:00.000Z"),
          createdAt: NOW,
          updatedAt: NOW,
        },
      });

      await tx.webhookEvent.create({
        data: {
          id: ids.webhookSeed,
          organizationId: ids.orgPrimary,
          provider: "stripe",
          externalEventId: "evt_seed_subscription_updated",
          topic: "customer.subscription.updated",
          status: WebhookDeliveryStatus.PENDING,
          payload: {
            provider: "stripe",
            object: "event",
            type: "customer.subscription.updated",
          },
          receivedAt: NOW,
        },
      });
    },
    {
      maxWait: 30000,
      timeout: 30000,
    },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Prisma seed failed.", error);
    await prisma.$disconnect();
    process.exit(1);
  });
