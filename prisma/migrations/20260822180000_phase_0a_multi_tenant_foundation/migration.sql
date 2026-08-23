-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('ACTIVE', 'UPCOMING');

-- CreateEnum
CREATE TYPE "EntitlementStatus" AS ENUM ('ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED');

-- CreateEnum
CREATE TYPE "SubscriptionItemStatus" AS ENUM ('ACTIVE', 'TRIAL', 'CANCELED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PipelineStageKind" AS ENUM ('OPEN', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'NURTURING');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'LINKEDIN', 'EVENT', 'PARTNER', 'OUTBOUND', 'ORGANIC_SEARCH', 'PAID_CAMPAIGN');

-- CreateEnum
CREATE TYPE "PreferredContactMethod" AS ENUM ('EMAIL', 'PHONE', 'LINKEDIN', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "ContactLifecycleStage" AS ENUM ('SUBSCRIBER', 'LEAD', 'MARKETING_QUALIFIED', 'SALES_QUALIFIED', 'OPPORTUNITY', 'CUSTOMER', 'FORMER_CUSTOMER');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PROSPECT', 'CUSTOMER', 'PARTNER', 'FORMER_CUSTOMER');

-- CreateEnum
CREATE TYPE "CompanyIndustry" AS ENUM ('TECHNOLOGY', 'HEALTHCARE', 'FINANCIAL_SERVICES', 'RETAIL', 'MANUFACTURING', 'LOGISTICS', 'PROFESSIONAL_SERVICES', 'EDUCATION', 'REAL_ESTATE', 'HOSPITALITY');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_501_1000', 'SIZE_1001_PLUS');

-- CreateEnum
CREATE TYPE "CompanySource" AS ENUM ('INBOUND', 'OUTBOUND', 'REFERRAL', 'PARTNER', 'EVENT', 'WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "DealHealth" AS ENUM ('HEALTHY', 'ATTENTION', 'AT_RISK');

-- CreateEnum
CREATE TYPE "DealPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DealSource" AS ENUM ('INBOUND', 'OUTBOUND', 'REFERRAL', 'PARTNER', 'EVENT', 'WEBSITE', 'COLD_CALL');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'MEETING', 'EMAIL', 'TASK', 'NOTE');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('SCHEDULED', 'TO_DO', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ActivityPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ActivityDirection" AS ENUM ('INBOUND', 'OUTBOUND', 'INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "ConfigEntityType" AS ENUM ('LEAD', 'CONTACT', 'COMPANY', 'DEAL', 'ACTIVITY', 'TASK');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('TEXT', 'LONG_TEXT', 'NUMBER', 'CURRENCY', 'PERCENTAGE', 'DATE', 'DATE_TIME', 'CHECKBOX', 'SINGLE_SELECT', 'MULTI_SELECT', 'EMAIL', 'PHONE', 'URL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "passwordHash" TEXT,
    "clerkUserId" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "clerkOrganizationId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "clerkMembershipId" TEXT,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedByMembershipId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ModuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "routePrefix" TEXT NOT NULL,
    "sidebarGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "OrganizationModuleEntitlement" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "status" "EntitlementStatus" NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" TIMESTAMP(3),
    "grantedBySubscriptionId" TEXT,
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationModuleEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planKey" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "seats" INTEGER NOT NULL DEFAULT 1,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "provider" TEXT,
    "externalId" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "status" "SubscriptionItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitAmountMinor" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationProjection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "invitedByMembershipId" TEXT NOT NULL,
    "acceptedByMembershipId" TEXT,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitationProjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorMembershipId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "summary" TEXT,
    "diff" JSONB,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "membershipId" TEXT,
    "key" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "responseStatusCode" INTEGER,
    "responseBody" JSONB,
    "lockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "provider" TEXT NOT NULL,
    "externalEventId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineStage" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "probability" INTEGER NOT NULL,
    "kind" "PipelineStageKind" NOT NULL DEFAULT 'OPEN',
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerMembershipId" TEXT,
    "companyId" TEXT,
    "convertedContactId" TEXT,
    "convertedCompanyId" TEXT,
    "convertedDealId" TEXT,
    "convertedByMembershipId" TEXT,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT,
    "companyName" TEXT,
    "email" TEXT,
    "normalizedEmail" TEXT,
    "phone" TEXT,
    "source" "LeadSource" NOT NULL,
    "status" "LeadStatus" NOT NULL,
    "score" INTEGER NOT NULL,
    "location" TEXT,
    "timezone" TEXT,
    "preferredContact" "PreferredContactMethod",
    "companyWebsite" TEXT,
    "companyIndustry" "CompanyIndustry",
    "companySize" "CompanySize",
    "lastActivityAt" TIMESTAMP(3),
    "nextActivityAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "archivedByMembershipId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerMembershipId" TEXT,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT,
    "email" TEXT,
    "normalizedEmail" TEXT,
    "phone" TEXT,
    "lifecycleStage" "ContactLifecycleStage" NOT NULL,
    "source" "LeadSource",
    "location" TEXT,
    "timezone" TEXT,
    "preferredContact" "PreferredContactMethod",
    "profileUrl" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "nextActivityAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "archivedByMembershipId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerMembershipId" TEXT,
    "primaryContactId" TEXT,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "normalizedDomain" TEXT,
    "website" TEXT,
    "industry" "CompanyIndustry",
    "type" "CompanyType" NOT NULL,
    "size" "CompanySize",
    "location" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "description" TEXT,
    "source" "CompanySource",
    "lastActivityAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "archivedByMembershipId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerMembershipId" TEXT,
    "companyId" TEXT NOT NULL,
    "primaryContactId" TEXT,
    "pipelineId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "valueMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "probability" INTEGER NOT NULL,
    "health" "DealHealth" NOT NULL,
    "priority" "DealPriority" NOT NULL,
    "source" "DealSource" NOT NULL,
    "expectedCloseDate" TIMESTAMP(3),
    "actualCloseDate" TIMESTAMP(3),
    "lostReason" TEXT,
    "reopenReason" TEXT,
    "lastActivityAt" TIMESTAMP(3),
    "nextActivityAt" TIMESTAMP(3),
    "proposalSummary" TEXT,
    "archivedAt" TIMESTAMP(3),
    "archivedByMembershipId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealLineItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitPriceMinor" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealStageHistory" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "fromStageId" TEXT,
    "toStageId" TEXT NOT NULL,
    "changedByMembershipId" TEXT NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealStageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerMembershipId" TEXT,
    "leadId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "dealId" TEXT,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ActivityStatus" NOT NULL,
    "priority" "ActivityPriority" NOT NULL,
    "direction" "ActivityDirection",
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3),
    "reminderAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "outcome" TEXT,
    "completionNotes" TEXT,
    "cancelReason" TEXT,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "authorMembershipId" TEXT NOT NULL,
    "leadId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "dealId" TEXT,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadTag" (
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "addedByMembershipId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadTag_pkey" PRIMARY KEY ("organizationId","leadId","tagId")
);

-- CreateTable
CREATE TABLE "ContactTag" (
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "addedByMembershipId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactTag_pkey" PRIMARY KEY ("organizationId","contactId","tagId")
);

-- CreateTable
CREATE TABLE "CompanyTag" (
    "organizationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "addedByMembershipId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyTag_pkey" PRIMARY KEY ("organizationId","companyId","tagId")
);

-- CreateTable
CREATE TABLE "DealTag" (
    "organizationId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "addedByMembershipId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealTag_pkey" PRIMARY KEY ("organizationId","dealId","tagId")
);

-- CreateTable
CREATE TABLE "CustomFieldDefinition" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "entityType" "ConfigEntityType" NOT NULL,
    "key" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "displayLabel" TEXT NOT NULL,
    "description" TEXT,
    "fieldType" "CustomFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "visibleInTable" BOOLEAN NOT NULL DEFAULT true,
    "visibleInForm" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 180,
    "options" JSONB,
    "defaultValue" JSONB,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldValue" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "entityType" "ConfigEntityType" NOT NULL,
    "recordId" TEXT NOT NULL,
    "fieldDefinitionId" TEXT NOT NULL,
    "valueText" TEXT,
    "valueNumber" DECIMAL(18,4),
    "valueBoolean" BOOLEAN,
    "valueDate" DATE,
    "valueDateTime" TIMESTAMP(3),
    "valueJson" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedView" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "entityType" "ConfigEntityType" NOT NULL,
    "ownerMembershipId" TEXT,
    "name" TEXT NOT NULL,
    "columnOrder" JSONB NOT NULL,
    "columnVisibility" JSONB NOT NULL,
    "columnWidths" JSONB NOT NULL,
    "sortRules" JSONB NOT NULL,
    "filterRules" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityLabelConfiguration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "entityType" "ConfigEntityType" NOT NULL,
    "singularLabel" TEXT NOT NULL,
    "pluralLabel" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityLabelConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryTemplateApplication" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "appliedByMembershipId" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "templateVersion" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndustryTemplateApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_normalizedEmail_key" ON "User"("normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_clerkOrganizationId_key" ON "Organization"("clerkOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_id_slug_key" ON "Organization"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_clerkMembershipId_key" ON "OrganizationMembership"("clerkMembershipId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_userId_idx" ON "OrganizationMembership"("userId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_organizationId_roleId_idx" ON "OrganizationMembership"("organizationId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_id_key" ON "OrganizationMembership"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_userId_key" ON "OrganizationMembership"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_organizationId_id_key" ON "Role"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_organizationId_key_key" ON "Role"("organizationId", "key");

-- CreateIndex
CREATE INDEX "RolePermission_permission_idx" ON "RolePermission"("permission");

-- CreateIndex
CREATE INDEX "RolePermission_organizationId_roleId_idx" ON "RolePermission"("organizationId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_organizationId_roleId_permission_key" ON "RolePermission"("organizationId", "roleId", "permission");

-- CreateIndex
CREATE INDEX "OrganizationModuleEntitlement_organizationId_status_idx" ON "OrganizationModuleEntitlement"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationModuleEntitlement_organizationId_id_key" ON "OrganizationModuleEntitlement"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationModuleEntitlement_organizationId_moduleKey_key" ON "OrganizationModuleEntitlement"("organizationId", "moduleKey");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_id_key" ON "Subscription"("organizationId", "id");

-- CreateIndex
CREATE INDEX "SubscriptionItem_organizationId_status_idx" ON "SubscriptionItem"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionItem_organizationId_id_key" ON "SubscriptionItem"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionItem_organizationId_subscriptionId_moduleKey_key" ON "SubscriptionItem"("organizationId", "subscriptionId", "moduleKey");

-- CreateIndex
CREATE INDEX "InvitationProjection_organizationId_status_idx" ON "InvitationProjection"("organizationId", "status");

-- CreateIndex
CREATE INDEX "InvitationProjection_organizationId_normalizedEmail_idx" ON "InvitationProjection"("organizationId", "normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationProjection_organizationId_id_key" ON "InvitationProjection"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationProjection_tokenHash_key" ON "InvitationProjection"("tokenHash");

-- CreateIndex
CREATE INDEX "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_organizationId_entityType_entityId_idx" ON "AuditEvent"("organizationId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_requestId_idx" ON "AuditEvent"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditEvent_organizationId_id_key" ON "AuditEvent"("organizationId", "id");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_organizationId_scope_createdAt_idx" ON "IdempotencyRecord"("organizationId", "scope", "createdAt");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_organizationId_status_idx" ON "IdempotencyRecord"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_organizationId_key_key" ON "IdempotencyRecord"("organizationId", "key");

-- CreateIndex
CREATE INDEX "WebhookEvent_organizationId_status_idx" ON "WebhookEvent"("organizationId", "status");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_receivedAt_idx" ON "WebhookEvent"("status", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_externalEventId_key" ON "WebhookEvent"("provider", "externalEventId");

-- CreateIndex
CREATE INDEX "Pipeline_organizationId_position_idx" ON "Pipeline"("organizationId", "position");

-- CreateIndex
CREATE INDEX "Pipeline_organizationId_archivedAt_idx" ON "Pipeline"("organizationId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_organizationId_id_key" ON "Pipeline"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_organizationId_name_key" ON "Pipeline"("organizationId", "name");

-- CreateIndex
CREATE INDEX "PipelineStage_organizationId_archivedAt_idx" ON "PipelineStage"("organizationId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineStage_organizationId_id_key" ON "PipelineStage"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineStage_organizationId_pipelineId_position_key" ON "PipelineStage"("organizationId", "pipelineId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineStage_organizationId_pipelineId_name_key" ON "PipelineStage"("organizationId", "pipelineId", "name");

-- CreateIndex
CREATE INDEX "Lead_organizationId_archivedAt_idx" ON "Lead"("organizationId", "archivedAt");

-- CreateIndex
CREATE INDEX "Lead_organizationId_ownerMembershipId_idx" ON "Lead"("organizationId", "ownerMembershipId");

-- CreateIndex
CREATE INDEX "Lead_organizationId_status_idx" ON "Lead"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Lead_organizationId_createdAt_idx" ON "Lead"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_organizationId_updatedAt_idx" ON "Lead"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "Lead_organizationId_nextActivityAt_idx" ON "Lead"("organizationId", "nextActivityAt");

-- CreateIndex
CREATE INDEX "Lead_organizationId_normalizedEmail_idx" ON "Lead"("organizationId", "normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_organizationId_id_key" ON "Lead"("organizationId", "id");

-- CreateIndex
CREATE INDEX "Contact_organizationId_archivedAt_idx" ON "Contact"("organizationId", "archivedAt");

-- CreateIndex
CREATE INDEX "Contact_organizationId_ownerMembershipId_idx" ON "Contact"("organizationId", "ownerMembershipId");

-- CreateIndex
CREATE INDEX "Contact_organizationId_lifecycleStage_idx" ON "Contact"("organizationId", "lifecycleStage");

-- CreateIndex
CREATE INDEX "Contact_organizationId_createdAt_idx" ON "Contact"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_organizationId_updatedAt_idx" ON "Contact"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "Contact_organizationId_nextActivityAt_idx" ON "Contact"("organizationId", "nextActivityAt");

-- CreateIndex
CREATE INDEX "Contact_organizationId_normalizedEmail_idx" ON "Contact"("organizationId", "normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_organizationId_id_key" ON "Contact"("organizationId", "id");

-- CreateIndex
CREATE INDEX "Company_organizationId_archivedAt_idx" ON "Company"("organizationId", "archivedAt");

-- CreateIndex
CREATE INDEX "Company_organizationId_ownerMembershipId_idx" ON "Company"("organizationId", "ownerMembershipId");

-- CreateIndex
CREATE INDEX "Company_organizationId_type_idx" ON "Company"("organizationId", "type");

-- CreateIndex
CREATE INDEX "Company_organizationId_createdAt_idx" ON "Company"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Company_organizationId_updatedAt_idx" ON "Company"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "Company_organizationId_normalizedDomain_idx" ON "Company"("organizationId", "normalizedDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Company_organizationId_id_key" ON "Company"("organizationId", "id");

-- CreateIndex
CREATE INDEX "Deal_organizationId_archivedAt_idx" ON "Deal"("organizationId", "archivedAt");

-- CreateIndex
CREATE INDEX "Deal_organizationId_ownerMembershipId_idx" ON "Deal"("organizationId", "ownerMembershipId");

-- CreateIndex
CREATE INDEX "Deal_organizationId_stageId_idx" ON "Deal"("organizationId", "stageId");

-- CreateIndex
CREATE INDEX "Deal_organizationId_createdAt_idx" ON "Deal"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Deal_organizationId_updatedAt_idx" ON "Deal"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "Deal_organizationId_nextActivityAt_idx" ON "Deal"("organizationId", "nextActivityAt");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_organizationId_id_key" ON "Deal"("organizationId", "id");

-- CreateIndex
CREATE INDEX "DealLineItem_organizationId_dealId_idx" ON "DealLineItem"("organizationId", "dealId");

-- CreateIndex
CREATE UNIQUE INDEX "DealLineItem_organizationId_id_key" ON "DealLineItem"("organizationId", "id");

-- CreateIndex
CREATE INDEX "DealStageHistory_organizationId_dealId_changedAt_idx" ON "DealStageHistory"("organizationId", "dealId", "changedAt");

-- CreateIndex
CREATE INDEX "DealStageHistory_organizationId_toStageId_changedAt_idx" ON "DealStageHistory"("organizationId", "toStageId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DealStageHistory_organizationId_id_key" ON "DealStageHistory"("organizationId", "id");

-- CreateIndex
CREATE INDEX "Activity_organizationId_ownerMembershipId_idx" ON "Activity"("organizationId", "ownerMembershipId");

-- CreateIndex
CREATE INDEX "Activity_organizationId_status_idx" ON "Activity"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Activity_organizationId_createdAt_idx" ON "Activity"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "Activity_organizationId_updatedAt_idx" ON "Activity"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "Activity_organizationId_scheduledAt_idx" ON "Activity"("organizationId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_organizationId_id_key" ON "Activity"("organizationId", "id");

-- CreateIndex
CREATE INDEX "Note_organizationId_createdAt_idx" ON "Note"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Note_organizationId_id_key" ON "Note"("organizationId", "id");

-- CreateIndex
CREATE INDEX "Tag_organizationId_archivedAt_idx" ON "Tag"("organizationId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_organizationId_id_key" ON "Tag"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_organizationId_name_key" ON "Tag"("organizationId", "name");

-- CreateIndex
CREATE INDEX "LeadTag_organizationId_tagId_idx" ON "LeadTag"("organizationId", "tagId");

-- CreateIndex
CREATE INDEX "ContactTag_organizationId_tagId_idx" ON "ContactTag"("organizationId", "tagId");

-- CreateIndex
CREATE INDEX "CompanyTag_organizationId_tagId_idx" ON "CompanyTag"("organizationId", "tagId");

-- CreateIndex
CREATE INDEX "DealTag_organizationId_tagId_idx" ON "DealTag"("organizationId", "tagId");

-- CreateIndex
CREATE INDEX "CustomFieldDefinition_organizationId_archivedAt_idx" ON "CustomFieldDefinition"("organizationId", "archivedAt");

-- CreateIndex
CREATE INDEX "CustomFieldDefinition_organizationId_createdAt_idx" ON "CustomFieldDefinition"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomFieldDefinition_organizationId_updatedAt_idx" ON "CustomFieldDefinition"("organizationId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldDefinition_organizationId_id_key" ON "CustomFieldDefinition"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldDefinition_organizationId_entityType_key_key" ON "CustomFieldDefinition"("organizationId", "entityType", "key");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldDefinition_organizationId_entityType_systemName_key" ON "CustomFieldDefinition"("organizationId", "entityType", "systemName");

-- CreateIndex
CREATE INDEX "CustomFieldValue_organizationId_fieldDefinitionId_idx" ON "CustomFieldValue"("organizationId", "fieldDefinitionId");

-- CreateIndex
CREATE INDEX "CustomFieldValue_organizationId_entityType_recordId_idx" ON "CustomFieldValue"("organizationId", "entityType", "recordId");

-- CreateIndex
CREATE INDEX "CustomFieldValue_organizationId_createdAt_idx" ON "CustomFieldValue"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomFieldValue_organizationId_updatedAt_idx" ON "CustomFieldValue"("organizationId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldValue_organizationId_id_key" ON "CustomFieldValue"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldValue_organizationId_fieldDefinitionId_recordId_key" ON "CustomFieldValue"("organizationId", "fieldDefinitionId", "recordId");

-- CreateIndex
CREATE INDEX "SavedView_organizationId_ownerMembershipId_idx" ON "SavedView"("organizationId", "ownerMembershipId");

-- CreateIndex
CREATE INDEX "SavedView_organizationId_archivedAt_idx" ON "SavedView"("organizationId", "archivedAt");

-- CreateIndex
CREATE INDEX "SavedView_organizationId_createdAt_idx" ON "SavedView"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "SavedView_organizationId_updatedAt_idx" ON "SavedView"("organizationId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedView_organizationId_id_key" ON "SavedView"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedView_organizationId_entityType_name_key" ON "SavedView"("organizationId", "entityType", "name");

-- CreateIndex
CREATE UNIQUE INDEX "EntityLabelConfiguration_organizationId_id_key" ON "EntityLabelConfiguration"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityLabelConfiguration_organizationId_entityType_key" ON "EntityLabelConfiguration"("organizationId", "entityType");

-- CreateIndex
CREATE INDEX "IndustryTemplateApplication_organizationId_createdAt_idx" ON "IndustryTemplateApplication"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "IndustryTemplateApplication_organizationId_templateKey_idx" ON "IndustryTemplateApplication"("organizationId", "templateKey");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryTemplateApplication_organizationId_id_key" ON "IndustryTemplateApplication"("organizationId", "id");

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_roleId_fkey" FOREIGN KEY ("organizationId", "roleId") REFERENCES "Role"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_invitedByMembershipI_fkey" FOREIGN KEY ("organizationId", "invitedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_organizationId_roleId_fkey" FOREIGN KEY ("organizationId", "roleId") REFERENCES "Role"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationModuleEntitlement" ADD CONSTRAINT "OrganizationModuleEntitlement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationModuleEntitlement" ADD CONSTRAINT "OrganizationModuleEntitlement_moduleKey_fkey" FOREIGN KEY ("moduleKey") REFERENCES "Module"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationModuleEntitlement" ADD CONSTRAINT "OrganizationModuleEntitlement_organizationId_grantedBySubs_fkey" FOREIGN KEY ("organizationId", "grantedBySubscriptionId") REFERENCES "Subscription"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_organizationId_subscriptionId_fkey" FOREIGN KEY ("organizationId", "subscriptionId") REFERENCES "Subscription"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_moduleKey_fkey" FOREIGN KEY ("moduleKey") REFERENCES "Module"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationProjection" ADD CONSTRAINT "InvitationProjection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationProjection" ADD CONSTRAINT "InvitationProjection_organizationId_roleId_fkey" FOREIGN KEY ("organizationId", "roleId") REFERENCES "Role"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationProjection" ADD CONSTRAINT "InvitationProjection_organizationId_invitedByMembershipId_fkey" FOREIGN KEY ("organizationId", "invitedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationProjection" ADD CONSTRAINT "InvitationProjection_organizationId_acceptedByMembershipId_fkey" FOREIGN KEY ("organizationId", "acceptedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_actorMembershipId_fkey" FOREIGN KEY ("organizationId", "actorMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_organizationId_membershipId_fkey" FOREIGN KEY ("organizationId", "membershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStage" ADD CONSTRAINT "PipelineStage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStage" ADD CONSTRAINT "PipelineStage_organizationId_pipelineId_fkey" FOREIGN KEY ("organizationId", "pipelineId") REFERENCES "Pipeline"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_ownerMembershipId_fkey" FOREIGN KEY ("organizationId", "ownerMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_companyId_fkey" FOREIGN KEY ("organizationId", "companyId") REFERENCES "Company"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_convertedContactId_fkey" FOREIGN KEY ("organizationId", "convertedContactId") REFERENCES "Contact"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_convertedCompanyId_fkey" FOREIGN KEY ("organizationId", "convertedCompanyId") REFERENCES "Company"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_convertedDealId_fkey" FOREIGN KEY ("organizationId", "convertedDealId") REFERENCES "Deal"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_convertedByMembershipId_fkey" FOREIGN KEY ("organizationId", "convertedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_ownerMembershipId_fkey" FOREIGN KEY ("organizationId", "ownerMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_organizationId_companyId_fkey" FOREIGN KEY ("organizationId", "companyId") REFERENCES "Company"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_ownerMembershipId_fkey" FOREIGN KEY ("organizationId", "ownerMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_primaryContactId_fkey" FOREIGN KEY ("organizationId", "primaryContactId") REFERENCES "Contact"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_ownerMembershipId_fkey" FOREIGN KEY ("organizationId", "ownerMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_companyId_fkey" FOREIGN KEY ("organizationId", "companyId") REFERENCES "Company"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_primaryContactId_fkey" FOREIGN KEY ("organizationId", "primaryContactId") REFERENCES "Contact"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_pipelineId_fkey" FOREIGN KEY ("organizationId", "pipelineId") REFERENCES "Pipeline"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_stageId_fkey" FOREIGN KEY ("organizationId", "stageId") REFERENCES "PipelineStage"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealLineItem" ADD CONSTRAINT "DealLineItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealLineItem" ADD CONSTRAINT "DealLineItem_organizationId_dealId_fkey" FOREIGN KEY ("organizationId", "dealId") REFERENCES "Deal"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealStageHistory" ADD CONSTRAINT "DealStageHistory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealStageHistory" ADD CONSTRAINT "DealStageHistory_organizationId_dealId_fkey" FOREIGN KEY ("organizationId", "dealId") REFERENCES "Deal"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealStageHistory" ADD CONSTRAINT "DealStageHistory_organizationId_fromStageId_fkey" FOREIGN KEY ("organizationId", "fromStageId") REFERENCES "PipelineStage"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealStageHistory" ADD CONSTRAINT "DealStageHistory_organizationId_toStageId_fkey" FOREIGN KEY ("organizationId", "toStageId") REFERENCES "PipelineStage"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealStageHistory" ADD CONSTRAINT "DealStageHistory_organizationId_changedByMembershipId_fkey" FOREIGN KEY ("organizationId", "changedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizationId_ownerMembershipId_fkey" FOREIGN KEY ("organizationId", "ownerMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizationId_leadId_fkey" FOREIGN KEY ("organizationId", "leadId") REFERENCES "Lead"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizationId_contactId_fkey" FOREIGN KEY ("organizationId", "contactId") REFERENCES "Contact"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizationId_companyId_fkey" FOREIGN KEY ("organizationId", "companyId") REFERENCES "Company"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizationId_dealId_fkey" FOREIGN KEY ("organizationId", "dealId") REFERENCES "Deal"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_authorMembershipId_fkey" FOREIGN KEY ("organizationId", "authorMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_leadId_fkey" FOREIGN KEY ("organizationId", "leadId") REFERENCES "Lead"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_contactId_fkey" FOREIGN KEY ("organizationId", "contactId") REFERENCES "Contact"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_companyId_fkey" FOREIGN KEY ("organizationId", "companyId") REFERENCES "Company"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_dealId_fkey" FOREIGN KEY ("organizationId", "dealId") REFERENCES "Deal"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTag" ADD CONSTRAINT "LeadTag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTag" ADD CONSTRAINT "LeadTag_organizationId_leadId_fkey" FOREIGN KEY ("organizationId", "leadId") REFERENCES "Lead"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTag" ADD CONSTRAINT "LeadTag_organizationId_tagId_fkey" FOREIGN KEY ("organizationId", "tagId") REFERENCES "Tag"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTag" ADD CONSTRAINT "LeadTag_organizationId_addedByMembershipId_fkey" FOREIGN KEY ("organizationId", "addedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_organizationId_contactId_fkey" FOREIGN KEY ("organizationId", "contactId") REFERENCES "Contact"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_organizationId_tagId_fkey" FOREIGN KEY ("organizationId", "tagId") REFERENCES "Tag"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_organizationId_addedByMembershipId_fkey" FOREIGN KEY ("organizationId", "addedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_organizationId_companyId_fkey" FOREIGN KEY ("organizationId", "companyId") REFERENCES "Company"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_organizationId_tagId_fkey" FOREIGN KEY ("organizationId", "tagId") REFERENCES "Tag"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_organizationId_addedByMembershipId_fkey" FOREIGN KEY ("organizationId", "addedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealTag" ADD CONSTRAINT "DealTag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealTag" ADD CONSTRAINT "DealTag_organizationId_dealId_fkey" FOREIGN KEY ("organizationId", "dealId") REFERENCES "Deal"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealTag" ADD CONSTRAINT "DealTag_organizationId_tagId_fkey" FOREIGN KEY ("organizationId", "tagId") REFERENCES "Tag"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealTag" ADD CONSTRAINT "DealTag_organizationId_addedByMembershipId_fkey" FOREIGN KEY ("organizationId", "addedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldDefinition" ADD CONSTRAINT "CustomFieldDefinition_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_organizationId_fieldDefinitionId_fkey" FOREIGN KEY ("organizationId", "fieldDefinitionId") REFERENCES "CustomFieldDefinition"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_organizationId_ownerMembershipId_fkey" FOREIGN KEY ("organizationId", "ownerMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityLabelConfiguration" ADD CONSTRAINT "EntityLabelConfiguration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryTemplateApplication" ADD CONSTRAINT "IndustryTemplateApplication_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryTemplateApplication" ADD CONSTRAINT "IndustryTemplateApplication_organizationId_appliedByMember_fkey" FOREIGN KEY ("organizationId", "appliedByMembershipId") REFERENCES "OrganizationMembership"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Postgres-specific integrity and performance additions for Phase 0A.
ALTER TABLE "Lead"
  ADD CONSTRAINT "Lead_score_check" CHECK ("score" >= 0 AND "score" <= 100);

ALTER TABLE "Deal"
  ADD CONSTRAINT "Deal_valueMinor_check" CHECK ("valueMinor" >= 0),
  ADD CONSTRAINT "Deal_probability_check" CHECK ("probability" >= 0 AND "probability" <= 100);

ALTER TABLE "PipelineStage"
  ADD CONSTRAINT "PipelineStage_probability_check" CHECK ("probability" >= 0 AND "probability" <= 100);

ALTER TABLE "Subscription"
  ADD CONSTRAINT "Subscription_seats_check" CHECK ("seats" >= 1);

ALTER TABLE "SubscriptionItem"
  ADD CONSTRAINT "SubscriptionItem_quantity_check" CHECK ("quantity" >= 1),
  ADD CONSTRAINT "SubscriptionItem_unitAmountMinor_check" CHECK ("unitAmountMinor" >= 0);

ALTER TABLE "DealLineItem"
  ADD CONSTRAINT "DealLineItem_quantity_check" CHECK ("quantity" > 0),
  ADD CONSTRAINT "DealLineItem_unitPriceMinor_check" CHECK ("unitPriceMinor" >= 0);

ALTER TABLE "Activity"
  ADD CONSTRAINT "Activity_related_record_check" CHECK (
    "leadId" IS NOT NULL
    OR "contactId" IS NOT NULL
    OR "companyId" IS NOT NULL
    OR "dealId" IS NOT NULL
  ),
  ADD CONSTRAINT "Activity_completed_requires_completedAt_check" CHECK (
    "status" <> 'COMPLETED' OR "completedAt" IS NOT NULL
  ),
  ADD CONSTRAINT "Activity_direction_type_check" CHECK (
    "direction" IS NULL OR "type" IN ('CALL', 'EMAIL')
  ),
  ADD CONSTRAINT "Activity_duration_positive_check" CHECK (
    "durationMinutes" IS NULL OR "durationMinutes" > 0
  );

ALTER TABLE "Note"
  ADD CONSTRAINT "Note_exactly_one_parent_check" CHECK (
    (CASE WHEN "leadId" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN "contactId" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN "companyId" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN "dealId" IS NULL THEN 0 ELSE 1 END) = 1
  );

CREATE UNIQUE INDEX "Pipeline_one_default_per_organization_key"
  ON "Pipeline" ("organizationId")
  WHERE "isDefault" = TRUE AND "archivedAt" IS NULL;

CREATE UNIQUE INDEX "InvitationProjection_pending_email_key"
  ON "InvitationProjection" ("organizationId", "normalizedEmail")
  WHERE "status" = 'PENDING';

CREATE UNIQUE INDEX "Company_unique_normalizedDomain_per_organization_key"
  ON "Company" ("organizationId", "normalizedDomain")
  WHERE "normalizedDomain" IS NOT NULL;

CREATE INDEX "Deal_organizationId_pipelineId_idx" ON "Deal" ("organizationId", "pipelineId");
CREATE INDEX "Activity_organizationId_ownerMembershipId_scheduledAt_idx"
  ON "Activity" ("organizationId", "ownerMembershipId", "scheduledAt");
CREATE INDEX "Activity_organizationId_dueAt_idx" ON "Activity" ("organizationId", "dueAt");
CREATE INDEX "CustomFieldDefinition_organizationId_entityType_archivedAt_idx"
  ON "CustomFieldDefinition" ("organizationId", "entityType", "archivedAt");
CREATE INDEX "SavedView_organizationId_entityType_archivedAt_idx"
  ON "SavedView" ("organizationId", "entityType", "archivedAt");

CREATE OR REPLACE FUNCTION "validate_custom_field_value"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  definition_field_type "CustomFieldType";
  definition_entity_type "ConfigEntityType";
  populated_count INTEGER;
BEGIN
  SELECT "fieldType", "entityType"
  INTO definition_field_type, definition_entity_type
  FROM "CustomFieldDefinition"
  WHERE "organizationId" = NEW."organizationId"
    AND "id" = NEW."fieldDefinitionId";

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Custom field definition % not found in organization %.',
      NEW."fieldDefinitionId",
      NEW."organizationId";
  END IF;

  IF definition_entity_type <> NEW."entityType" THEN
    RAISE EXCEPTION 'Custom field entity type mismatch. Definition % expects %, received %.',
      NEW."fieldDefinitionId",
      definition_entity_type,
      NEW."entityType";
  END IF;

  populated_count :=
    (CASE WHEN NEW."valueText" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN NEW."valueNumber" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN NEW."valueBoolean" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN NEW."valueDate" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN NEW."valueDateTime" IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN NEW."valueJson" IS NULL THEN 0 ELSE 1 END);

  IF populated_count <> 1 THEN
    RAISE EXCEPTION 'Custom field values must populate exactly one typed value column.';
  END IF;

  CASE definition_field_type
    WHEN 'TEXT', 'LONG_TEXT', 'SINGLE_SELECT', 'EMAIL', 'PHONE', 'URL' THEN
      IF NEW."valueText" IS NULL THEN
        RAISE EXCEPTION 'Field definition % requires valueText.', NEW."fieldDefinitionId";
      END IF;
    WHEN 'NUMBER', 'CURRENCY', 'PERCENTAGE' THEN
      IF NEW."valueNumber" IS NULL THEN
        RAISE EXCEPTION 'Field definition % requires valueNumber.', NEW."fieldDefinitionId";
      END IF;
    WHEN 'CHECKBOX' THEN
      IF NEW."valueBoolean" IS NULL THEN
        RAISE EXCEPTION 'Field definition % requires valueBoolean.', NEW."fieldDefinitionId";
      END IF;
    WHEN 'DATE' THEN
      IF NEW."valueDate" IS NULL THEN
        RAISE EXCEPTION 'Field definition % requires valueDate.', NEW."fieldDefinitionId";
      END IF;
    WHEN 'DATE_TIME' THEN
      IF NEW."valueDateTime" IS NULL THEN
        RAISE EXCEPTION 'Field definition % requires valueDateTime.', NEW."fieldDefinitionId";
      END IF;
    WHEN 'MULTI_SELECT' THEN
      IF NEW."valueJson" IS NULL OR jsonb_typeof(NEW."valueJson") <> 'array' THEN
        RAISE EXCEPTION 'Field definition % requires valueJson as a JSON array.', NEW."fieldDefinitionId";
      END IF;
  END CASE;

  RETURN NEW;
END;
$$;

CREATE TRIGGER "CustomFieldValue_validate_type_trigger"
BEFORE INSERT OR UPDATE ON "CustomFieldValue"
FOR EACH ROW
EXECUTE FUNCTION "validate_custom_field_value"();
