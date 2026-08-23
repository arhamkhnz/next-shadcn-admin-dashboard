# Data Model Plan

Status: **Phase 0A foundation implemented.** This document designs the persistent entities for the CRM platform. The repository now includes a Prisma schema, an initial SQL migration, and a deterministic seed aligned to this model. API usage, auth integration, and live frontend reads/writes are still pending.

Reads alongside [`backend-architecture-plan.md`](./backend-architecture-plan.md) (tenancy, enforcement) and [`authorization-matrix.md`](./authorization-matrix.md) (who may touch what).

---

## 1. Conventions

These conventions apply to **every** entity below and are not repeated per table.

| Convention | Rule |
| --- | --- |
| Primary key | `id: string` (UUID/cuid), generated server-side. Mock ids (`lead-001`, `act-120`) are never reused as real ids. |
| Organization ownership | Every tenant-owned row carries `organizationId` (required, FK → Organization). Platform-global tables (User, Role, Module) have none. |
| Timestamps | `createdAt` and `updatedAt` (`timestamptz`, DB-managed) on every table unless marked append-only. |
| Audit columns | `createdBy` / `updatedBy` (nullable FK → User; null = system/seed). Not shown per field below. |
| Archive fields | Archive-capable entities carry `archivedAt: timestamptz?` and `archivedBy: string?` — see §8. |
| Money | Integer minor units (cents) + ISO currency code. The frontend's `value: number` + `currency: "USD"` maps to this pair. |
| Dates/times | `timestamptz` everywhere; the API serializes ISO-8601 strings, matching current Zod schemas. |
| Enums | Initial values mirror the colocated frontend schemas exactly (listed in §5–§6). Static enums where users cannot customize; config rows (Pipeline/Stage/Tag) where they can. |
| Deletes | No user-facing hard deletes for business records in v1 — archive instead (§8). |
| Indexes | Every tenant table indexes `organizationId` first; additional composite indexes listed per entity. Unique constraints are organization-scoped unless stated global. |

## 2. Entity catalog overview

**Platform & access:** User · Organization · Organization Membership · Role · Role Permission · Module · Organization Module Entitlement · Subscription · Invitation · Audit Event
**CRM:** Lead · Contact · Company · Deal · Pipeline · Pipeline Stage · Deal Stage History · Activity · Note · Tag · Record Tag

## 3. Platform & access entities

### User

- **Purpose:** a person who can sign in; global identity across organizations.
- **PK:** `id`.
- **Organization ownership:** none (global). Reach to organizations only via memberships.
- **Fields:** `email` (required, unique global, lowercase), `name` (required), `avatarUrl` (nullable), `passwordHash` (managed by the auth library), `emailVerifiedAt` (nullable), `lastLoginAt` (nullable), `deactivatedAt` (nullable — account suspension/deletion).
- **Relationships:** many Memberships; actor on Audit Events, Notes, Activities (`createdBy`/`ownerId`).
- **Unique:** `email`.
- **Indexes:** `email` (unique).
- **Archive fields:** none — uses `deactivatedAt` instead.

### Organization

- **Purpose:** the tenant; owns all business records, entitlements, and the subscription.
- **PK:** `id`.
- **Organization ownership:** is the tenant.
- **Fields:** `name` (required), `slug` (required, unique, URL-safe; used for future subdomains), `logoUrl` (nullable), `defaultCurrency` (default `"USD"`), `deletedAt` (nullable tombstone for org deletion flow).
- **Relationships:** many Memberships, Entitlements, Subscription, Invitations, and every CRM record.
- **Unique:** `slug`.
- **Indexes:** `slug` (unique).

### Organization Membership

- **Purpose:** joins User ↔ Organization with a role; the unit of suspension inside one organization.
- **PK:** `id`.
- **Organization ownership:** `organizationId` required.
- **Fields:** `userId` (required), `roleKey` (required FK → Role), `status` (enum `active` / `suspended`, default `active`), `invitedByUserId` (nullable), `joinedAt` (required).
- **Relationships:** one User, one Organization, one Role.
- **Unique:** `(organizationId, userId)`.
- **Indexes:** unique above + `userId` (org switcher lookup).

### Role

- **Purpose:** named permission set. Five system roles at launch (see [`authorization-matrix.md`](./authorization-matrix.md)); schema supports custom roles later.
- **PK:** `key` (e.g. `owner`, `administrator`, `sales_manager`, `sales_representative`, `viewer`).
- **Organization ownership:** none in v1 (system roles are global); a nullable `organizationId` is reserved for future custom roles.
- **Fields:** `name` (display), `description` (nullable), `isSystem` (bool).
- **Relationships:** many Role Permissions; referenced by Memberships and Invitations.
- **Unique:** `key`.

### Role Permission

- **Purpose:** maps roles to atomic permissions.
- **PK:** composite `(roleKey, permission)`.
- **Fields:** `permission` (string `resource.action`, e.g. `deals.edit`).
- **Indexes:** PK covers role lookup; secondary index on `permission` ("which roles can X").

### Module

- **Purpose:** registered product capability: `crm` active; `finance`, `hr` reserved.
- **PK:** `key` (`crm`, `finance`, `hr`, …).
- **Fields:** `name`, `description` (nullable), `status` (enum `active` / `upcoming`), route prefix + sidebar group metadata (code registry mirrored here).
- **Unique:** `key`.

### Organization Module Entitlement

- **Purpose:** grants one organization one module; derived from its subscription; carries lifecycle status.
- **PK:** `id`.
- **Organization ownership:** `organizationId` required.
- **Fields:** `moduleKey` (required FK → Module), `status` (enum `active` / `trial` / `suspended` / `canceled`), `trialEndsAt` (nullable), `grantedBySubscriptionId` (nullable FK), `activatedAt` / `suspendedAt` / `canceledAt` (nullable).
- **Relationships:** one Organization, one Module, optionally one Subscription.
- **Unique:** `(organizationId, moduleKey)`.
- **Enforcement note:** status is evaluated at request time — an expired trial flips to denied without a background job being required.

### Subscription

- **Purpose:** billing relationship of an organization; provider-agnostic in v1 (Stripe attaches later via `provider`/`externalId`).
- **PK:** `id`.
- **Organization ownership:** `organizationId` required.
- **Fields:** `planKey` (required), `status` (enum `trialing` / `active` / `past_due` / `canceled` / `paused`), `seats` (int ≥ membership count rule), `currentPeriodStart` / `currentPeriodEnd` (nullable until billing lands), `provider` (nullable, e.g. `"stripe"`), `externalId` (nullable).
- **Relationships:** one Organization; grants Entitlements.
- **Unique:** partial unique — one non-terminal subscription per organization.
- **Indexes:** `organizationId`.

### Invitation

- **Purpose:** email invitation to join an organization with a preassigned role.
- **PK:** `id`.
- **Organization ownership:** `organizationId` required.
- **Fields:** `email` (required), `roleKey` (required), `tokenHash` (required; raw token only ever emailed), `status` (enum `pending` / `accepted` / `expired` / `revoked`), `invitedByUserId` (required), `expiresAt` (required, default +7 days), `acceptedAt` (nullable).
- **Unique:** `(organizationId, lower(email))` while `status = pending` (partial index prevents duplicate pending invites).
- **Indexes:** `tokenHash` (lookup), `organizationId, status`.

### Audit Event

- **Purpose:** immutable "who did what when" history for sensitive actions.
- **PK:** `id`.
- **Organization ownership:** `organizationId` required (platform-level events use a reserved null-org scope, restricted to operators).
- **Fields:** `actorUserId` (nullable — deleted-user anonymization), `action` (required dotted verb: `lead.created`, `deal.stage_changed`, `member.role_changed`, `record.exported`, …), `entityType` + `entityId` (required), `summary` (human-readable), `diff` (nullable JSONB field-level before/after), `requestId` (nullable correlation id), `ipAddress` (nullable).
- **Append-only:** no updates or deletes; no `updatedAt`. Retention policy tracked in roadmap.
- **Indexes:** `(organizationId, createdAt desc)`, `(entityType, entityId)`.

## 4. CRM entities

All CRM entities are tenant-owned (`organizationId` required) and archive-capable where noted.

### Lead

A prospect before qualification. Mirrors `leads-data/schema.ts`.

- **PK:** `id`. **Archive:** yes (`archivedAt`, `archivedBy`).
- **Fields:** `name` (req), `jobTitle` (null), `email` (req), `phone` (null), `companyName` (null — free text, matching the frontend's company string), `companyId` (null, optional link when the lead names a known Company), `source` (enum §6.1), `status` (enum §6.1), `score` (int 0–100), `ownerId` (null FK → User), `location`, `timezone`, `preferredContact` (enum), `companyWebsite`, `companyIndustry`, `companySize` (all nullable display mirrors of the frontend), `lastActivityAt` (null), `nextActivityAt` (null), plus conversion fields (§7): `convertedAt`, `convertedByUserId`, `convertedContactId`, `convertedCompanyId`, `convertedDealId` (all nullable).
- **Status enum stays unchanged on conversion** — the frontend defines `New | Contacted | Qualified | Unqualified | Nurturing` and reports count converted leads as Qualified; conversion is recorded via `convertedAt` + links, not a new status value.
- **Relationships:** owner User; optional Company link; Activities, Tasks (via Activity), Notes, Record Tags; conversion targets.
- **Unique:** none beyond id (duplicate leads are allowed and surfaced by conversion-time duplicate checks, §7).
- **Indexes:** `(organizationId, status)`, `(organizationId, ownerId)`, `(organizationId, email)`, `(organizationId, createdAt desc)`.

### Contact

A person the team communicates with. Mirrors `contacts-data/schema.ts`.

- **PK:** `id`. **Archive:** yes.
- **Fields:** `name` (req), `jobTitle` (null), `email` (req), `phone` (null), `companyId` (null FK), `lifecycleStage` (enum §6.2), `source` (enum, nullable), `ownerId` (null), `location`, `timezone`, `preferredContact`, `profileUrl` (all nullable), `lastContactedAt` (null), `nextActivityAt` (null).
- Derived counts shown by the UI (`openDealCount`, `openDealValue`, closed equivalents) are **computed at query time**, never stored.
- **Relationships:** Company (many contacts per company); `Company.primaryContactId` marks the primary one; Deals via `Deal.primaryContactId`; Activities, Notes, Record Tags.
- **Unique:** none in v1 (duplicate tolerance matches mock behavior); conversion-time checks warn on same-email duplicates.
- **Indexes:** `(organizationId, companyId)`, `(organizationId, ownerId)`, `(organizationId, lifecycleStage)`, `(organizationId, email)`.

### Company

An account-level organization (customer/prospect). Mirrors `companies-data/schema.ts`.

- **PK:** `id`. **Archive:** yes.
- **Fields:** `name` (req), `domain` (null), `website` (null), `industry` (enum §6.3), `type` (enum §6.3), `size` (enum §6.3), `location` (null), `phone` (null), `address` (null), `description` (null), `source` (enum, nullable), `ownerId` (null), `primaryContactId` (null FK → Contact), `lastActivityAt` (null).
- Pipeline/won summaries are computed, not stored.
- **Relationships:** many Contacts, Deals, Leads (via `Lead.companyId`), Activities, Notes, Record Tags.
- **Unique:** `(organizationId, lower(domain))` treated as a soft warning at write time, not a hard constraint (matches tolerant mock behavior; enforced in service layer).
- **Indexes:** `(organizationId, type)`, `(organizationId, ownerId)`, `(organizationId, name)`.

### Pipeline

- **Purpose:** a named sales pipeline containing ordered stages; multiple pipelines per organization supported.
- **PK:** `id`. **Archive:** no (deactivate instead; orgs rarely delete pipelines).
- **Fields:** `name` (req), `isDefault` (bool; exactly one default per org), `position` (ordering int).
- **Unique:** `(organizationId, name)`.
- **Indexes:** `(organizationId, position)`.

### Pipeline Stage

- **Purpose:** configurable stage within a pipeline: ordering, probability, outcome kind.
- **PK:** `id`.
- **Fields:** `pipelineId` (req FK), `name` (req), `position` (req int, unique per pipeline), `probability` (int 0–100; seeds 10/25/45/70 for open stages, matching the weighted-pipeline config), `kind` (enum `open` / `won` / `lost`; exactly one `won` + one `lost` stage per pipeline recommended).
- **Unique:** `(pipelineId, position)`, `(pipelineId, lower(name))`.
- **Indexes:** `pipelineId, position`.
- Seed stages reproduce the frontend set: Discovery, Qualified, Proposal Sent, Negotiation (open) + Closed Won, Closed Lost.

### Deal

A revenue opportunity. Mirrors `deals-data/schema.ts` minus embedded arrays (those become relations).

- **PK:** `id`. **Archive:** yes.
- **Fields:** `name` (req), `companyId` (req FK), `primaryContactId` (null FK), `pipelineId` (req FK), `stageId` (req FK → Pipeline Stage), `value` (req, integer cents ≥ 0), `currency` (req, default org currency), `probability` (int 0–100; auto-suggested from stage, editable), `health` (enum `Healthy` / `Attention` / `At Risk`), `priority` (enum `Low` / `Medium` / `High` / `Critical`), `source` (enum §6.4), `ownerId` (null), `expectedCloseDate` (null date), `actualCloseDate` (null date; set on won/lost), `lostReason` (null text; required when moving to a `lost` stage), `reopenReason` (null text; last reopen rationale), `lastActivityAt` / `nextActivityAt` (null), `proposalSummary` (null), `products` (JSONB array of `{ name, quantity, unitPrice }` — preserves the current line-item form exactly; promoted to a `DealLineItem` table when catalog/quoting arrives, §9).
- **Relationships:** Company (req), primary Contact, Pipeline, Stage, owner, Stage History rows, Activities, Notes, Record Tags.
- **Indexes:** `(organizationId, stageId)`, `(organizationId, pipelineId)`, `(organizationId, ownerId)`, `(organizationId, expectedCloseDate)`, `(organizationId, archivedAt)`.

### Deal Stage History

- **Purpose:** immutable record of every stage transition — enables time-in-stage reporting (currently "Not Available" in reports) and full auditability of moves/reopens.
- **PK:** `id`. **Append-only.**
- **Fields:** `dealId` (req), `fromStageId` (null on creation entry), `toStageId` (req), `changedByUserId` (req), `reason` (null text; required for backward moves, lost, and reopens — mirroring the frontend dialogs), `changedAt` (req).
- **Indexes:** `(dealId, changedAt)`, `(organizationId, toStageId, changedAt)`.

### Activity

One shared model for Calls, Meetings, Emails, Tasks, and Notes-type timeline entries. Mirrors `activity-schema.ts` exactly; **Tasks are activities with `type = "Task"`** (the `/dashboard/tasks` surface filters this type).

- **PK:** `id`. **Archive:** no — cancellation replaces archiving (matches frontend: cancel/reschedule workflows, no archive UI).
- **Fields:** `type` (enum `Call` / `Meeting` / `Email` / `Task` / `Note`), `title` (req), `description` (null), `status` (enum `Scheduled` / `To Do` / `In Progress` / `Completed` / `Canceled`), `priority` (enum `Low` / `Medium` / `High` / `Urgent`), `ownerId` (null — unassigned allowed), `scheduledAt` (req), `dueAt` (null; tasks), `reminderAt` (null), `completedAt` (null; required when Completed), `durationMinutes` (null int > 0), `outcome` (null; required on completion), `completionNotes` (null), `cancelReason` (null), `direction` (null enum; Call `Inbound|Outbound`, Email `Incoming|Outgoing`), related-record FKs `leadId` / `contactId` / `companyId` / `dealId` (all nullable, **at least one required** — enforced by check constraint + service validation).
- Status transitions follow the frontend transition map (Start: To Do→In Progress; Complete from active states; Cancel from active states; Reschedule restores Scheduled/To Do; Reopen clears `completedAt` while preserving prior outcome/notes).
- **Indexes:** `(organizationId, scheduledAt)`, `(organizationId, ownerId, scheduledAt)`, each FK column, `(organizationId, type, status)`.

### Note

Pinned/freeform notes on records (distinct from Note-*type* activities, which remain timeline entries — both exist in the frontend today).

- **PK:** `id`. **Archive:** no; editable/deletable with audit events.
- **Fields:** `entityType` (enum `Lead` / `Contact` / `Company` / `Deal`), `entityId` (req), `content` (req text), `pinned` (bool, default false), `authorUserId` (req).
- **Indexes:** `(entityType, entityId, createdAt desc)`, `(organizationId, entityType)`.
- Polymorphic pair enforced in the data-access layer (writes resolve the entity through scoped finders first).

### Tag

- **Purpose:** organization-defined labels colorable in UI later.
- **PK:** `id`.
- **Fields:** `name` (req), `color` (null).
- **Unique:** `(organizationId, lower(name))`.

### Record Tag

- **Purpose:** attaches tags to any CRM record.
- **PK:** composite `(tagId, entityType, entityId)`.
- **Fields:** `entityType` (same enum as Note), `entityId`, `tagId`, `addedByUserId`.
- **Indexes:** PK + `(entityType, entityId)` (list a record's tags).

## 5. Enumerations (canonical initial values)

Mirrored verbatim from the frontend schemas; changing them is a breaking product decision.

**6.1 Lead** — statuses: `New, Contacted, Qualified, Unqualified, Nurturing` · sources: `Website, Referral, LinkedIn, Event, Partner, Outbound, Organic Search, Paid Campaign` · preferred contact: `email, phone, linkedin, in_person`
**6.2 Contact** — lifecycle: `Subscriber, Lead, Marketing Qualified, Sales Qualified, Opportunity, Customer, Former Customer` (sources as lead)
**6.3 Company** — types: `Prospect, Customer, Partner, Former Customer` · industries: `Technology, Healthcare, Financial Services, Retail, Manufacturing, Logistics, Professional Services, Education, Real Estate, Hospitality` · sizes: `1-10, 11-50, 51-200, 201-500, 501-1000, 1001+` · sources: `Inbound, Outbound, Referral, Partner, Event, Website, Other`
**6.4 Deal** — sources: `Inbound, Outbound, Referral, Partner, Event, Website, Cold Call` · health: `Healthy, Attention, At Risk` · priority: `Low, Medium, High, Critical`
**6.5 Activity** — types: `Call, Meeting, Email, Task, Note` · statuses: `Scheduled, To Do, In Progress, Completed, Canceled` · priorities: `Low, Medium, High, Urgent`

## 6. CRM relationships

```
Lead ──convertedTo──▶ Contact ──belongsTo──▶ Company
 │                      │                       │
 └─optional link───────┴───────────────────────┴──▶ Deal ◀──primaryContact── Contact
                                                        │
              Company ◀──belongsTo───────────────────────┘
Activities/Tasks (Activity rows) ──attach to──▶ Lead | Contact | Company | Deal   (≥1 required)
Notes ──attach to──▶ Lead | Contact | Company | Deal
Tags ──(RecordTag)──▶ Lead | Contact | Company | Deal
Owner (User) on: Lead, Contact, Company, Deal, Activity
```

- **Lead → Company:** free-text `companyName` always available; optional `companyId` link once the company exists (created at conversion or attached manually).
- **Lead → Contact after conversion:** `convertedContactId` (+ `convertedAt`, `convertedByUserId`) preserves provenance; the original Lead is never deleted or mutated into the contact.
- **Lead → Deal:** only through conversion (`convertedDealId`); ad-hoc deals attach to Company/Contact directly.
- **Contact ↔ Company:** `Contact.companyId`; `Company.primaryContactId` selects the primary.
- **Contact/Company → Deals:** `Deal.companyId` (required) and `Deal.primaryContactId` (optional).
- **Activities:** polymorphic-but-typed FKs (`leadId/contactId/companyId/dealId`, ≥1 required) — queries stay simple and indexed; tasks ride the same table filtered by `type = "Task"`.
- **Owner assignments:** nullable `ownerId` on Lead/Contact/Company/Deal/Activity (unassigned states exist in the UI); reassignment requires the resource's `assign` permission and writes an audit event.

## 7. Lead conversion (transactional design)

One transaction creates Contact, optionally Company, optionally Deal, and stamps the Lead. Safe to retry, duplicate-aware, fully audited.

**Input:** `leadId`, decisions: contact (`create` | `linkExisting: contactId`), company (`create` | `linkExisting: companyId` | `skip`), deal (optional payload: name, value, expectedCloseDate, ownerId, stage defaults to pipeline entry).

**Transaction steps:**

1. Re-fetch the Lead through the tenant-scoped finder; reject if missing (404), archived, or already converted (`convertedAt != null` → return the previous result unchanged — **retry safety**).
2. **Duplicate prevention:** if creating a Contact, look up existing contact by `(organizationId, lower(email))`; if creating a Company, by `(organizationId, lower(domain))` then `lower(name)`. A match returns `CONFLICT` with the candidate ids unless the caller explicitly confirms creation anyway (frontend shows the "use existing?" choice).
3. Create the Contact: copy name/email/phone/jobTitle/source/tags/preferredContact; `lifecycleStage = "Sales Qualified"`; owner defaults to the lead's owner.
4. Optionally create the Company from the lead's `companyName/companyWebsite/companyIndustry/companySize` fields; backfill `Lead.companyId` and `Contact.companyId`.
5. Optionally create the Deal linked to company + contact, entering the default pipeline's first open stage, probability auto-suggested from stage, owner defaulting to the lead owner.
6. Stamp the Lead: `convertedAt`, `convertedByUserId`, `convertedContactId`, `convertedCompanyId?`, `convertedDealId?`. Status remains `Qualified` (no enum change — see §4 Lead).
7. **Preserve history:** Activities/Tasks keep their `leadId` attachments untouched (timelines stay intact); new work continues on the Contact/Deal. Open tasks may be reassigned afterward via normal task editing.
8. Write Audit Event `lead.converted` (actor, diff of created ids) in the same transaction.

The endpoint requires an `Idempotency-Key`; step 1 makes replays no-ops returning the original created records.

## 8. Archive strategy

Recoverable archive for normal CRM records: **Lead, Contact, Company, Deal** (matching the frontend's existing `archivedAt/archivedBy` fields and Archived saved views).

- **Archive:** sets `archivedAt = now()`, `archivedBy = actor`. Writes an audit event. Idempotent (archiving an archived record is a no-op).
- **Restore:** clears both fields; audit event `record.restored`. Permission-gated (`*.restore`).
- **Default query filtering:** every list/detail query excludes archived rows unless the request explicitly asks for them (`archived=true` filter → the Archived views; `archived=all` for admin tooling). Reports exclude archived deals entirely and count archived leads separately — preserving current report semantics.
- **Relationship behavior:** no cascade. Archiving a Company leaves its contacts, deals, and activities untouched and reachable (mirrors the documented frontend behavior "no cascade to related records"). Archived records disappear from relation pickers but remain resolvable on existing records (activities keep rendering their links, with strikethrough styling as today).
- **Workflow gating:** archived deals reject stage/outcome mutations (frontend disables those actions while archived); reads remain allowed.
- **Future permanent deletion policy:** v1 ships no user-facing permanent delete. A later policy adds: retention window after archival, explicit `*.manage`-gated purge, and cascade rules defined per entity — deliberately deferred so no destructive path exists prematurely. Organization deletion (backend plan §10) is the only eventual bulk purge and runs after a confirm window.

## 9. Future extensions (reserved, not designed in detail)

- **DealLineItem** table replacing the `products` JSONB when catalog/quoting arrives (fields sketched: dealId, name, quantity, unitPrice, position).
- **Custom roles** (`Role.organizationId`), **custom fields** (per-entity definition + value tables), **file attachments** (Open Decision D10), **email/thread sync**, **workflow automation** — all additive under the same tenancy conventions.
