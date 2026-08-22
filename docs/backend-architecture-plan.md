# Backend Architecture Plan

Status: **Planning — not implemented.** This document defines the production backend architecture for the CRM platform (LynxMind). It is design and documentation only: no database, API, authentication, permission, subscription, or middleware code exists yet, and none is introduced by this document.

Companion documents:

- [`data-model-plan.md`](./data-model-plan.md) — persistent entities, relationships, lead conversion, deal architecture, archive strategy.
- [`authorization-matrix.md`](./authorization-matrix.md) — roles, permissions, and the full permission matrix.
- [`frontend-backend-migration-plan.md`](./frontend-backend-migration-plan.md) — staged migration from mock Zustand stores to backend data.

---

## 1. Current state (verified)

The repository today is a frontend-only Next.js application. Verified facts that constrain this design:

| Area | State |
| --- | --- |
| Framework | Next.js `16.2.12` (App Router), React `19.2.8`, TypeScript `5.9.3` strict |
| UI | Tailwind CSS v4, shadcn/ui (`radix-nova`), Radix + Base UI primitives |
| Validation | Zod `4.4.3` schemas colocated with each screen (`schema.ts`) |
| Client state | Zustand `5.0.14` — preferences store plus CRM stores (`useLeadStore`, `useContactStore`, `useCompanyStore`, `useDealStore`, `useActivityStore`) seeded from mock data |
| Data | Static mock modules co-located per screen; no database |
| Authentication | **None.** `/auth/v1` and `/auth/v2` are UI-only screens. No auth library in `package.json`. No sessions, no cookies beyond theme/layout preferences |
| Database / ORM | **None.** No Prisma schema, no ORM config, no `.env*` files committed |
| API routes | **None.** No `src/app/api/**` directory |
| Server actions | Only preference cookie helpers in `src/server/server-actions.ts` |
| Middleware/proxy | `src/proxy.disabled.ts` template exists, disabled |
| Deployment | None configured (Vercel-ready template; no `vercel.json`, no Dockerfile) |

Because there is **no existing authentication system**, there is nothing to replace — the recommendation below introduces one for the first time. The existing mock auth screens remain untouched as visual references.

## 2. Goals and non-goals

### Goals

1. Multiple organizations with multiple users per organization.
2. Strict tenant isolation enforced at every query, not only in the UI.
3. Organization invitations with acceptance flow.
4. Role-based permissions (see [`authorization-matrix.md`](./authorization-matrix.md)).
5. CRM as the first module, with Finance and Human Resources as future modules.
6. Module-based subscriptions gating feature access.
7. Optional subdomain-based module access without hardcoding domains.
8. Audit history for sensitive actions.
9. Recoverable archive and restore for normal CRM records.
10. Secure APIs with consistent validation, errors, and rate limiting.
11. A staged migration path from the current mock Zustand stores.

### Non-goals (first version)

- Microservices, event buses, or multi-region infrastructure. One Next.js application, one PostgreSQL database, one deployment target.
- A data warehouse or OLAP layer for reporting.
- Email/mailbox integration (already deferred in [`crm-frontend-scope.md`](./crm-frontend-scope.md) §9).
- Custom-field builder, workflow automation, quoting/products catalog (future; the deal model reserves a line-items extension point).
- Real billing charges — subscriptions are modeled provider-agnostically first; Stripe integration is a later, separate task.

## 3. Tenancy model

### Decision: Organization is the tenant

**Organization acts as the tenant. A separate Workspace entity is not introduced in v1.**

Rationale:

- Every requirement (users per org, invitations, role assignments, module entitlements, subscriptions, audit scope) attaches naturally to one tenant boundary.
- The frontend already speaks "organization" language for companies/accounts; adding a second grouping noun ("workspace") would create ambiguity between a *customer Company* record and a *tenant* concept.
- A workspace layer can be added later by inserting `Workspace` between `User` and `Organization` (memberships point at workspaces; workspaces belong to organizations) without rewriting business tables — only the tenant-context resolver changes. Documented here so the escape hatch is explicit.

Consequences:

- Every CRM business record (Lead, Contact, Company, Deal, Pipeline, Activity, Note, Tag) carries an `organizationId` and belongs to exactly one organization.
- Users are global identities; they reach organization data only through an **Organization Membership** carrying a role.
- A user may belong to multiple organizations and switch between them; sessions track the active organization explicitly (§5).

### Entities

Defined fully in [`data-model-plan.md`](./data-model-plan.md); summarized here to fix terminology:

| Entity | Purpose |
| --- | --- |
| **User** | A person who can sign in. Global across organizations. |
| **Organization** | The tenant. Owns all business records, entitlements, and the subscription. |
| **Organization Membership** | Join of User ↔ Organization with a role; one membership per user per organization. |
| **Module** | Registered product capability: `crm` now; `finance`, `hr` later. |
| **Organization Module Entitlement** | Grants one organization access to one module, derived from its subscription; carries status (active/trial/suspended/canceled). |
| **Subscription** | The billing relationship of an organization; provider-agnostic in v1 (Stripe later). Defines which modules and how many seats. |
| **Role** | Named set of permissions scoped to a membership (Owner, Administrator, Sales Manager, Sales Representative, Viewer). |
| **Permission** | Atomic capability string `resource.action` (e.g. `deals.edit`). Roles map to permission sets. |

Permissions are **separate from module entitlements**: a user may hold `reports.view` but cannot exercise it unless the organization owns the module that provides Reports (CRM). Enforcement is the conjunction: *entitlement AND permission* (§7).

### Tenant context resolution

Every request resolves a **tenant context** before touching tenant data:

```
TenantContext {
  userId            // authenticated user
  organizationId    // active organization (from session, never from client input)
  membershipId      // membership row for (user, organization)
  role              // role key resolved from the membership
  permissions       // effective permission set for the role
}
```

Resolution order:

1. Authenticate the session cookie → `userId`.
2. Read the active `organizationId` stored **inside the server-side session** (set at login or organization switch). Query parameters, headers, and request bodies can never select the tenant.
3. Load the membership for `(userId, organizationId)`. If none exists → deny (403). If the user or membership is suspended → deny (403 with account-suspended semantics).
4. Resolve role → permissions once per request; cache within the request lifetime.

For Server Components the same resolution runs through a shared `getTenantContext()` helper on the server. For Route Handlers it runs as the first stage of the request pipeline (§8).

### How every query prevents cross-organization access

Isolation is enforced in the **data-access layer**, not left to each call site:

- All tenant-owned reads and writes go through repository functions in a server-only module (`src/server/data-access/**`, never imported by client code). Each function takes `TenantContext` (or at minimum `organizationId`) as a required argument.
- Every generated query includes `where: { ... , organizationId: ctx.organizationId }` as part of the base scope. Fetching by primary key is always `findFirst({ where: { id, organizationId } })`, never a bare `find(id)` — a wrong-organization id simply returns "not found" (404), which also avoids leaking existence.
- Relations are traversed only from an already-scoped root (e.g. `deal.activities` after the deal was fetched through the scoped finder), so nested data inherits isolation.
- Cross-entity references are validated on write: when attaching an Activity to a Deal, the Deal must be fetched through the scoped finder first; otherwise the write is rejected.
- Organization-scoped aggregates (reports, summary cards) run their filters inside the same scoped queries.
- Defense in depth: the ORM schema places `organizationId` on every tenant table with a composite index `(organizationId, …)`; a lint-level convention (code review checklist until tooling exists) forbids raw queries that omit it. If a query helper cannot derive the organization, it does not compile into the data-access layer.

This makes "forgetting the tenant filter" structurally difficult: the unscoped path does not exist in the layer the UI calls.

## 4. Authentication plan

### Recommendation

Introduce **Better Auth** with its organization plugin, backed by the same PostgreSQL database via its Prisma-compatible adapter.

Rationale (documented technical reasons, since this is a first introduction rather than a replacement):

- The requirements — organizations, memberships, invitation tokens, acceptance, role assignment, session-scoped active organization — match Better Auth's organization plugin almost one-to-one, avoiding hand-rolled invitation/session plumbing.
- TypeScript-first API fits the strict-mode codebase; session data is typed end-to-end.
- Credentials (email + password) are supported natively, matching the existing `/auth/*` screen designs; OAuth providers can be added later without schema churn.
- Alternative considered: Auth.js v5 — mature, but has no built-in organization/invitation model, so those flows would be custom-built anyway. Recorded as an alternative if the team prefers it (Open Decision D2).

The final library choice requires confirmation (Open Decision D2). Everything else in this plan is library-agnostic.

### Flows

| Flow | Design |
| --- | --- |
| **Registration** | Email + password against the existing `/auth/register` screens. Creates the `User`; sends verification email. Passwords hashed by the auth library (bcrypt/argon2 per its defaults). Rate-limited. |
| **Email verification** | Signed, single-use token emailed on registration and on address change. Unverified users can log in but land in a "verify email" state; tenant data stays blocked until verified (configurable grace period — Open Decision D6). |
| **Login** | Email + password; optional OAuth later. On success the session records the user's **default organization** (single membership → that org; multiple → last used or chosen). Generic error on failure; rate-limited per IP + email. |
| **Logout** | Destroys the server session and clears the session cookie. |
| **Session handling** | httpOnly + Secure + SameSite=Lax session cookie; sliding expiration (e.g. 7 days idle, 30 days absolute — Open Decision D6). Session payload holds `{ userId, activeOrganizationId }`. Nothing sensitive in localStorage; existing preference cookies stay non-security UI state. |
| **Organization creation** | Post-registration step ("Create your organization"). Creator becomes **Organization Owner** membership automatically. Name + optional subdomain slug (validated, reserved-word list, unique). |
| **User invitations** | Owner/Administrator invites by email to the organization, assigning a role at invite time. Invitation row stores email, organization, role, single-use token, expiry (e.g. 7 days), inviter, status. Inviting an existing user links the membership directly; new users get a signup link bound to the token. |
| **Invitation acceptance** | Tokenized URL → verify token validity/expiry → create membership (or attach signup) → mark invitation accepted → land in the organization. Declined/expired tokens produce clear states; re-invite allowed. |
| **Organization switching** | Switcher in the dashboard shell lists the user's memberships. Switching updates `activeOrganizationId` in the session (server action), then reloads tenant-scoped data. All caches keyed by organization are invalidated on switch. |
| **Account suspension** | Two levels: **membership suspension** (blocks one user in one organization) and **user deactivation** (blocks sign-in globally, e.g. for abuse/deletion requests). Suspended sessions are rejected at tenant-context resolution; live sessions are revoked on suspension. |
| **Session expiration** | Idle timeout revokes the session; next request redirects to login with a return URL. Absolute cap forces re-login regardless of activity. Expired-session API calls return 401, never 403, so clients can distinguish "sign in again" from "not allowed". |

## 5. Authorization plan (summary)

Full detail lives in [`authorization-matrix.md`](./authorization-matrix.md). Summary:

- Five initial roles: **Organization Owner**, **Administrator**, **Sales Manager**, **Sales Representative**, **Viewer**.
- Permissions are atomic strings `resource.action` over resources: Overview, Leads, Contacts, Companies, Deals, Activities, Tasks, Calendar, Reports, Settings, Users, Billing — with actions View, Create, Edit, Archive, Restore, Assign, Export, Manage (+ a few flow-specific ones like `leads.convert`).
- Role → permission mapping is data (seeded rows), not hardcoded conditionals, so custom roles can be added later without schema change.
- Ownership scoping: Sales Representatives see all organization records but can only edit/archive/delete their own (owner-scoped actions); Managers and above act org-wide. Viewer is read-only everywhere.
- Enforcement order per request: **authentication → tenant context → module entitlement → permission → ownership scope**. All five run server-side; UI checks are cosmetic mirrors only (per [`security.md`](./security.md)).

## 6. Department & module architecture

### Module registry

Modules are registered in a seed/config table (code-defined registry persisted to the DB so entitlements can reference stable keys):

| Key | Status | Provides |
| --- | --- | --- |
| `crm` | Active (first module) | Overview, Leads, Contacts, Companies, Deals, Activities/Tasks, Calendar wiring, Reports |
| `finance` | Future | Invoices, accounts, transactions (existing Finance screens become its UI) |
| `hr` | Future | People, time off, org chart |
| *(reserved)* | Future | Any new department follows the same registration pattern |

Each module registration declares: key, name, sidebar group(s), route prefix(es) (`/dashboard/crm/**`), required permissions namespace, and the entitlement it maps to.

### Entitlements

- An **Organization Module Entitlement** exists per (organization, module) and carries status: `active`, `trial`, `suspended`, `canceled`, plus trial end date and activation dates.
- Entitlements are derived from the organization's **Subscription**: subscribing to a plan grants/updates entitlement rows; suspending or canceling a subscription flips entitlement statuses. Trials are entitlements with status `trial` and an expiry checked at enforcement time.
- **Module activation/suspension/cancellation** are administrative operations on the entitlement (and reflected in billing later): activation turns the module on; suspension freezes access while preserving data; cancellation ends access (data retained read-only for export for a defined window — Open Decision D8).

### Access control layering

A user can use a module feature only when **all** hold:

1. Valid session and non-suspended membership in the organization.
2. The organization's entitlement for the module is `active` (or `trial` not expired).
3. The user's role grants the specific permission.

### Sidebar visibility & route protection

- `sidebar-items.ts` entries gain an optional `module?: "crm" | "finance" | …` marker; the sidebar filters groups/items whose module entitlement is missing. This remains **presentation only**.
- Route protection: the dashboard layout chain resolves tenant context server-side; a module layout segment (`/dashboard/crm/layout.tsx` pattern) verifies the entitlement and redirects unauthorized users to an "upgrade / module disabled" page rather than leaking the screen. Client-side navigation guards mirror this purely for UX.

### Backend enforcement

Route Handlers and data-access functions check entitlement as pipeline stage 4 (§8). Entitlement failures return a distinct error code (`MODULE_NOT_ENTITLED`) so the UI can offer upgrade paths instead of a generic forbidden message.

### Domain strategy (subdomains)

Future module subdomains follow this strategy — **no placeholder domains are hardcoded anywhere**:

- The root domain is environment configuration (`APP_ROOT_DOMAIN`, e.g. read from env; unset in local dev).
- Module hostnames are computed as `<module>.<root>` (e.g. `crm.<root>`) only when subdomain mode is enabled (`MODULE_ROUTING=subdomain|path`, default `path`).
- The proxy/middleware layer (enabling `src/proxy.disabled.ts` → `src/proxy.ts`) maps host → module claim and validates it against the tenant's entitlements; path routing continues to work identically, so subdomains are an additive deployment concern, not a code fork.
- Custom per-organization domains (e.g. `sales.acme.com` → acme's CRM) are noted as a later extension using the same host-resolution seam.

## 7. Subscriptions (provider-agnostic v1)

- `Subscription` stores: plan key, status (`trialing`, `active`, `past_due`, `canceled`, `paused`), seat count, period bounds, and a nullable external provider reference (`provider`, `externalId`) so Stripe can be attached later without migration pain.
- Webhook ingestion is designed but deferred: a single internal endpoint shape (`subscription.changed`) will be mapped to Stripe events when billing lands.
- Seat count gates invitations (cannot exceed seats; upgrading prompts when reached).
- `past_due` suspends entitlements after a grace period (Open Decision D8); data is never auto-deleted by billing state.

## 8. API architecture

### Approach

**Route Handlers under `/api/v1/**` as the client-facing API, over a server-only data-access layer.** Rationale:

- The migration plan (TanStack Query cache replacing server-state in Zustand stores) needs real HTTP endpoints for reads, mutations, bulk operations, and optimistic-update rollback.
- Route Handlers keep the API testable and callable by future non-page clients (mobile, integrations).
- Server Components may bypass HTTP and call the data-access layer directly for initial renders — same functions, same enforcement, no duplicated logic.
- Existing Server Actions remain limited to preferences; new mutations go through versioned REST-style handlers so validation/errors/rate limits have one home.

### Boundaries & organization

```
src/server/
├── auth/                 # session/auth-library glue
├── tenant/               # tenant-context resolution
├── permissions/          # role→permission resolution, guards
├── entitlements/         # module entitlement checks
├── data-access/          # tenant-scoped repositories (crm/, org/, admin/)
│   └── crm/              # leads, contacts, companies, deals, pipelines, activities…
├── services/             # cross-repository workflows (lead conversion, reporting)
└── api/
    └── v1/
        ├── leads/        # route.ts, [leadId]/route.ts, convert/route.ts …
        ├── contacts/ …   # same pattern per resource
        ├── org/          # members, invitations, switching, settings
        └── reports/
```

Handlers stay thin: parse → validate → delegate to services/data-access → format response. Business rules live below the handler layer.

### Request pipeline (every tenant endpoint)

1. **Authentication** — session cookie → `userId` (401 on failure).
2. **Tenant context** — resolve active organization + membership + role (403 on suspension/no membership).
3. **Permission guard** — required `resource.action` for the route (403).
4. **Module entitlement guard** — module active for the organization (403 + `MODULE_NOT_ENTITLED`).
5. **Input validation** — Zod schemas for body, query params, and path params (422 on failure). Schemas mirror the colocated frontend schemas and evolve with them.
6. **Handler** — scoped data-access/service call.
7. **Response formatting** — envelope below; audit logging for mutations.

### Input validation & mass-assignment protection

- Every endpoint validates with Zod server-side; clients cannot widen types.
- Update endpoints accept explicit allowlisted field sets (per resource, per permission level) — unknown/system fields (`id`, `organizationId`, `createdAt`, audit fields, `archivedAt`) are stripped, never merged blindly. `organizationId` and owner changes go only through dedicated flows guarded by `assign`/`manage` permissions.

### Pagination, filtering, sorting, search

- Pagination: cursor-based (`limit` + `cursor`) for feeds/timelines; offset pagination acceptable for admin tables ≤10k rows. Standard envelope: `{ data, pageInfo { hasNextPage, nextCursor, total? } }`.
- Filtering: allowlisted filter params per resource mirroring existing saved views (status, owner, source, archived state…). Unknown params rejected (422) rather than ignored.
- Sorting: allowlisted `(field, direction)` pairs; default sort documented per resource (e.g. Deals by `createdAt desc`).
- Search: parameterized `ILIKE`/trigram search on name/email/domain fields; full-text search deferred until needed.

### Transactions, idempotency, rate limiting

- Multi-row writes (lead conversion, bulk ops, stage moves with history) run in a single DB transaction; partial failure rolls back completely.
- Mutating endpoints accept an optional `Idempotency-Key` header; key + request hash stored briefly (24h) to make retries safe — mandatory for conversion and bulk endpoints.
- Rate limiting: per-IP + per-account sliding windows on auth endpoints (strict), mutation endpoints (moderate), reads (loose). Implementation via middleware + a counters store (Redis when infrastructure allows; DB-backed fallback acceptable at launch scale).

### Error response format

```jsonc
{
  "error": {
    "code": "VALIDATION_ERROR",      // stable machine code
    "message": "Human-readable summary.",
    "details": [ { "path": "value", "message": "Must be ≥ 0" } ],
    "requestId": "req_…"             // correlates with logs/audit
  }
}
```

Codes: `UNAUTHENTICATED`, `FORBIDDEN`, `ACCOUNT_SUSPENDED`, `MODULE_NOT_ENTITLED`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`. HTTP status pairs with each; `NOT_FOUND` is returned for cross-tenant probes (no existence leak).

### Audit logging

Mutations emit **Audit Events** (actor, organization, action, entity, diff summary, requestId, timestamp) inside the same transaction as the change. Reads are not audited in v1 except sensitive exports. See [`data-model-plan.md`](./data-model-plan.md) §Audit Event.

## 9. Reporting architecture

Reports move from frontend selectors (`report-selectors.ts` computing over Zustand stores) to backend queries **with identical metric definitions** (documented in [`crm-frontend-scope.md`](./crm-frontend-scope.md) §5.7 — weighted pipeline uses stage probabilities 10/25/45/70%, win rate = won ÷ decided closed in range, stalled = open with no activity 14+ days, expected-to-close = open closing within 30 days, etc.). Any definitional change is a breaking product decision, not an implementation detail.

Layering:

- **Operational queries** — data-access repositories serving list/detail pages; row-shaped, tenant-scoped.
- **Aggregated reporting queries** — SQL aggregations (`GROUP BY` stage/owner/source/date bucket) executed in PostgreSQL over the same tables, exposed via `/api/v1/reports/*` with the same global filters (date range, owner, stage, source, company). Period comparisons run as two windowed aggregates in one round trip.
- **Future analytics** — materialized views or a scheduled rollup table if report latency becomes an issue; a warehouse is explicitly out of scope. The reporting service interface hides whether a metric comes from a live aggregate or a rollup, keeping that swap internal.

Snapshot vs interval metrics keep their current semantics: snapshot metrics (pipeline value, open deals) evaluate "now"; interval metrics compare range vs prior equal-length range. Archived deals are excluded everywhere; archived leads excluded from active totals but reported separately — matching current behavior.

## 10. Security plan

Extends [`security.md`](./security.md) with backend-specific commitments:

| Area | Commitment |
| --- | --- |
| Tenant isolation | §3 mechanisms: session-held active org, scoped finders only, composite indexes, 404 on cross-tenant ids. |
| Authorization | Five-stage pipeline (§8); server-side only; UI mirrors cosmetic. |
| Input validation | Zod at every boundary (body/query/path); reject-on-unknown for filters; allowlisted update fields. |
| Mass-assignment | Explicit field allowlists per endpoint; system fields immutable through generic update paths. |
| Session security | httpOnly/Secure/SameSite=Lax cookies; rotation on privilege change (login, org switch, role change); revocation on suspension/logout. |
| CSRF | SameSite=Lax + Origin checking on mutating Route Handlers; auth-library CSRF protections kept enabled. |
| XSS | React escaping preserved; no new `dangerouslySetInnerHTML`; rich text (notes) stored as sanitized plain text/markdown rendered through safe components. |
| Rate limiting | §8 policy; stricter on auth + invitation + export endpoints. |
| Audit logs | Append-only Audit Events for mutations, permission changes, invitations, exports, subscription changes. |
| Sensitive log filtering | Structured logging with redaction list (passwords, tokens, cookies, emails optionally pseudonymized); `removeConsole` stays enabled in production builds. |
| Secrets management | Env-only (`DATABASE_URL`, auth secret, future Stripe keys); `.env*.local` gitignored; example file documents required vars; no secrets in code/logs/repo. |
| Backups | Managed PostgreSQL daily snapshots + PITR where the host allows; restore tested before launch (operational task, tracked in roadmap). |
| Data export | Org-scoped CSV/JSON export per resource (permission-gated `*.export`), audited. |
| Account deletion | User-initiated: deactivate identity, anonymize PII, retain audit integrity (actor references become "deleted user"); memberships removed. |
| Organization deletion | Owner-initiated, two-step (request + confirm window): entitlements suspended immediately, data purged after retention window (Open Decision D9), tombstone + final audit trail retained. |
| Subscription suspension | `past_due`/manual suspension flips entitlements to `suspended`: modules read-blocked with upgrade messaging; data retained; no destructive action ever triggered by billing state. |

## 11. Migration overview

Staged migration from mock stores is specified in [`frontend-backend-migration-plan.md`](./frontend-backend-migration-plan.md): foundation → read APIs → query layer → mutations → archive/restore → bulk ops → optimistic updates/error handling/cache invalidation → reports → parity-verified mock removal. Mock data is **not deleted** during early phases.

## 12. Assumptions

1. Single PostgreSQL database, single Next.js deployment (Vercel or equivalent Node host) is sufficient for launch scale (< a few thousand organizations).
2. The existing `/auth/v1|v2` screens are visual templates; the production auth UI adapts them rather than preserving pixel parity.
3. Mock-data enums (lead statuses/sources, deal stages/health/priority/source, activity types/statuses/priorities, contact lifecycle stages, company types/industries/sizes) are the canonical initial value sets; they become DB-backed config where users may customize them (pipelines/stages/tags) and static enums elsewhere.
4. Reporting anchors ("today") switch from the mock-data anchor (Aug 16, 2026) to wall-clock time when real data lands; metric formulas themselves do not change.
5. Email delivery (verification, invitations) uses a transactional provider; provider choice is an implementation detail behind a mailer interface.

## 13. Open decisions (require confirmation)

| # | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| D1 | Database engine + ORM | PostgreSQL with Prisma / Drizzle / raw `postgres.js` | PostgreSQL + Prisma (typed, migrations, fits strict TS) |
| D2 | Auth library | Better Auth (org plugin) / Auth.js v5 / custom sessions | Better Auth — org/invitation model matches requirements |
| D3 | Plan/pricing shape for subscriptions | Per-module plans / bundles / seat tiers | Defer pricing; schema already provider- and plan-shape-agnostic |
| D4 | Subdomain rollout timing | Path-only at launch / subdomains from day one | Path-only first; enable subdomain mode after auth stabilizes |
| D5 | Custom roles at launch | Fixed five roles / role editor UI | Fixed five roles; schema supports custom later |
| D6 | Session lifetimes & verification grace | Values TBD | 7-day idle / 30-day absolute; configurable grace for unverified users |
| D7 | Bulk-operation size caps | e.g. 50 / 100 / 500 items | 100 with explicit error above cap |
| D8 | Trial length, dunning grace, canceled-module data-retention window | Business values TBD | 14-day trial, 7-day grace, 30-day read-only retention (defaults pending confirmation) |
| D9 | Organization deletion retention | Immediate purge / 30-day window | 30-day window with restore option |
| D10 | File attachments storage (detail pages show Files placeholders) | Defer entirely / object storage design | Defer; reserve an attachment entity sketch in the data model doc |
