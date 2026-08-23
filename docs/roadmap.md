# Roadmap — What to Make & What to Work On

This document collects what the project advertises as planned, what is known to be missing, and concrete improvement candidates. It is a living list — update it as work is completed.

Legend: 🟢 small · 🟡 medium · 🔴 large

## What the README advertises as planned

- **Role-Based Access Control (RBAC)** with config-driven UI and **multi-tenant** support — marked *planned*. 🟡
  - `Users` and `Roles` screens already exist as UI (`dashboard/users`, `dashboard/roles`) but are backed by static mock data and grant no real access.
- No other "planned screens" remain (the README states all planned screens are shipped).

## High-priority gaps to close

### 1. Automated tests 🔴
There is **no test setup at all** (`package.json` has no `test` script; no vitest/jest/Playwright).

- Add **Vitest + React Testing Library** for unit/component tests (utils, formatters, Zod schemas, table columns, preference store logic).
- Add **Playwright** end-to-end tests for critical journeys: login screens render, dashboard shell, theme/layout switching persists, invoice prints.
- Add `npm test` + CI wiring; document commands in `README.md` and `AGENTS.md`.

### 2. Backend / data layer 🔴
The frontend is still mock-driven. Phase 0A database foundations now exist, but to become a real CRM product:

- Introduce an API/data access layer (Route Handlers, or a headless CMS/DB adapter), keeping screen components UI-only.
- Real **authentication** (Auth.js / Better Auth / session-based) + protecting routes. See [`security.md`](./security.md).
- Server-enforced **RBAC** keyed off roles/permissions, replacing client-only mock role UI.
- Multi-tenant scoping (tenant id on data + middleware).

> **Architecture milestone update:** the production backend architecture is designed in four documents — [`backend-architecture-plan.md`](./backend-architecture-plan.md) (tenancy, auth, modules & entitlements, API, reporting, security), [`data-model-plan.md`](./data-model-plan.md) (entities, relationships, lead conversion, archive strategy), [`authorization-matrix.md`](./authorization-matrix.md) (roles × permissions), and [`frontend-backend-migration-plan.md`](./frontend-backend-migration-plan.md) (staged migration from mock stores with parity gates). Phase 0A is now implemented as a Prisma schema, initial SQL migration, deterministic seed, and Prisma client helper. Live auth, APIs, enforcement, and UI migration work remain 🔴.

### 3. Complete "coming soon" stubs 🟢
Several screens render dashed "Coming soon" placeholders. Either build or remove them:

- `dashboard/finance` — `12-months` (Accounts) and `custom` (Transactions) tabs (`page.tsx:84-94`).
- `dashboard/roles` — `Permission sets` and `Access reviews` tabs (`roles.tsx:210-219`).
- `dashboard/coming-soon` — dead route (badge `soon`, disabled).
- `(legacy)` dashboards — decide whether to keep or archive; they duplicate modern screens.

### 4. Loading / error / empty states 🟢
Screens mostly render static data with no `loading.tsx`, `error.tsx`, or empty states (they aren't needed for static data, but will be once async data lands). Add Suspense boundaries, `loading.tsx`, and `error.tsx` per route group when introducing async data.

## Medium & nice-to-have improvements

- **Documentation upkeep** 🟢 — keep `docs/` current; add screen-specific docs as new screens land (this folder).
- **Font bundle review** 🟡 — 19 fonts are loaded up front in `src/lib/fonts/registry.ts`. Consider loading fonts on demand or trimming the set; measure with `next build`. See [`performance.md`](./performance.md).
- **Remote image policy** 🟡 — avatar URLs in `src/data/users.ts` point to GitHub; configure `next/image` `remotePatterns` or self-host avatars before production.
- **Enable `proxy.ts` with security headers** 🟡 — rename `src/proxy.disabled.ts` → `src/proxy.ts`, add CSP/frame/headers config, redirect unauth → `/auth` when auth lands.
- **i18n** 🔴 — the app is English-only (`lang="en"`). A locale system would be a major feature; keep strings centralized if planning it.
- **Accessibility pass** 🟡 — audit keyboard nav and focus rings on interactive widgets (calendar, kanban, tables, drawers) with an axe scan.
- **Dark-mode polish** 🟡 — verify every screen in dark mode + all presets (tangerine/brutalist/soft-pop) since tokens are preset-scoped.
- **Responsive/mobile pass** 🟡 — confirm tablet/mobile layouts for data-dense screens (users, roles, ecommerce tables, kanban).
- **Real error tracking** 🟡 — add an error boundary + optional Sentry for production builds.
- **`generate:presets` in CI** 🟢 — it runs on pre-commit; also consider a pre-push check that `theme.ts` is in sync (the script itself mentions a pre-push hook).
- **Search dialog wiring** 🟡 — `SearchDialog` exists in the header; wire it to real command-palette navigation (`cmdk` is already a dependency).
- **Settings & Help links** 🟢 — `AppSidebar` has commented-out `NavSecondary`/`NavDocuments` with placeholder links; either wire or remove.

## Suggested order of execution

1. **Phase 0 — foundations:** tests setup (vitest + RTL + Playwright), docs maintenance, `remotePatterns`, delete/complete `coming-soon` stubs.
2. **Phase 1 — data layer:** introduce typed data access + real auth + sessions + security headers; add loading/error states.
3. **Phase 2 — RBAC & multi-tenant:** server-enforced permissions, connect `users`/`roles` screens to real data.
4. **Phase 3 — polish:** i18n, a11y audit, dark/preset passes, bundle trimming.

## CRM frontend progress

- ✅ CRM sidebar configuration (Phase 1 shell with Overview + Workspace items)
- ✅ Leads list page (`/dashboard/crm/leads`) — local mock data, search, filters, sorting, pagination, row selection, saved views, summary cards
- ✅ Lead detail page (`/dashboard/crm/leads/[leadId]`) — contact info, sales info, company, notes, activity timeline, tasks
- ✅ Add Lead / Edit Lead — Sheet-based form with react-hook-form + zod, Zustand store for client-side state, wired from table row menu and detail page header
- ✅ Lead archive and restore — frontend session state only: archive/restore from row menu and detail page, Archived saved view, bulk archive/restore, archived indicator banner
- ✅ Leads table customization pilot — custom fields (13 types, plus-button creation, inline editing, archive/restore with value preservation, type-lock when values exist), core-field presentation customization (labels/order/widths/visibility with immutable technical keys), Reset Table Layout, organization entity terminology (Lead/Leads relabeling), saved views migrated to a reusable store-backed model (create/rename/duplicate/default/archive/restore), type-aware custom filters, custom values in search/forms/detail page; built on the shared `src/lib/crm-table-engine` engine with deterministic mock state only. Future: roll the same engine out to Contacts, Companies, and Deals, then add industry-specific field templates.
- 🔲 Lead qualification and conversion flow
- ✅ Contacts list page (`/dashboard/crm/contacts`) — local mock data, search, filters, sorting, pagination, row selection, saved views, summary cards, lifecycle stages
- ✅ Contact detail page (`/dashboard/crm/contacts/[contactId]`) — relationship summary, activity timeline, tasks, notes, contact info, company info, CRM details, related deals, important dates
- ✅ Add Contact / Edit Contact — Sheet-based form with react-hook-form + zod, Zustand store for client-side state, wired from table row menu, contacts page header button, and contact detail page header (frontend session state only; resets on browser refresh)
- ✅ Companies list page (`/dashboard/crm/companies`) — 30 mock companies, search, filters, sorting, pagination, row selection, saved views, summary cards, archive/restore, bulk archive/restore, Archived saved view
- ✅ Company detail page (`/dashboard/crm/companies/[companyId]`) — company profile, account summary, ownership, primary contact, related contacts, related leads, related deals, pipeline/revenue summary, activity timeline, tasks, notes, dates/tags, archive/restore
- ✅ Company archive and restore (frontend session state) — single archive, bulk archive, single restore, bulk restore, Archived saved view, archived company detail, no cascade to related records, no permanent deletion
- ✅ Deals table view (`/dashboard/crm/deals`) — search, filters (stage/health/priority/owner/source), saved views (All/My/Open/Closing This Month/Overdue/Won/Lost), sorting, pagination, summary cards, row selection, 50 deterministic deals across all stages
- ✅ Deal detail page (`/dashboard/crm/deals/[dealId]`) — deal header, stage progression, summary cards, activity timeline, tasks, notes, products, deal information, related company, primary contact, empty states, loading skeleton
- ✅ Add Deal / Edit Deal — unified Sheet-based form with react-hook-form + zod, Zustand store, company search, contact search filtered by company, stage selection (open stages for Add, locked for closed deals in Edit), probability auto-suggestion, value with currency, tags, products/line items, initial note on Add only; wired from table row menu, deals page header, and deal detail page header
- ✅ Deal stage and outcome workflows — Change Stage (forward/backward with confirmation), Mark Won, Mark Lost (with loss reasons), Reopen Deal; all with Zod validation, deterministic timeline entries, summary recalculation, saved-view updates, accessible toasts, and frontend session state only
- ✅ Deals pipeline view — board layout with 4 open-stage columns (Discovery, Qualified, Proposal Sent, Negotiation), drag-and-drop reordering via @dnd-kit, move-to-stage context menu, backward move confirmation via Change Stage dialog, deal cards with value/health/owner/due date/overdue indicator, view toggle (list/pipeline) in header, shared Zustand store and filters with table view, summary cards, responsive horizontal scrolling
- ✅ Deal archive and restore — frontend session state only: archive/restore from row menu and detail page, Archived saved view, archived indicator banner, workflow actions disabled while archived, no permanent deletion
- ✅ Deals bulk actions — bulk assign owner, bulk change stage, bulk add tag, bulk archive, bulk restore; functional toolbar buttons, selection-based dialogs, row-level assign owner via submenu
- ✅ Activities page (`/dashboard/crm/activities`) — 120 deterministic mock activities anchored to real leads/contacts/companies/deals, summary cards (Upcoming/Due Today/Overdue/Completed This Month), saved views (All/My/Upcoming/Due Today/Overdue/Completed/Canceled), search, filters (type/status/owner/related record type/scheduled date/priority), sorting, pagination, row actions, empty/no-results states, loading skeleton
- ✅ Activity detail page (`/dashboard/crm/activities/[activityId]`) — header badges, status-appropriate actions, description, completion/cancellation details, details sidebar, related-record links, loading skeleton, not-found handling
- ✅ Add/Edit Activity + workflows — shared Sheet form with zod cross-field validation (schedule rules, ≥1 related record, duration, direction per type, archived-record handling), Mark Complete / Cancel / Reschedule dialogs, centralized Zustand activity store; wired from the Activities page, all four CRM detail timelines, and contact quick actions (Email/Call/Schedule)
- ✅ Tasks module (`/dashboard/tasks`) — CRM tasks backed by the shared activity store (`type: "Task"`): summary cards, 8 saved views, search, filters (status/priority/owner/related type/due date/completion state), sorting, pagination, list + drag-and-drop board views, bulk actions (owner/priority/status/reschedule/complete/cancel), Add/Edit Task form with due date and reminder, Start/Complete/Reopen/Reschedule/Cancel workflows with transition validation, task detail route at `/dashboard/crm/tasks/[taskId]`, calendar events linking to task details, and Add Task buttons on all four CRM detail timelines
- ✅ Reports & Analytics (`/dashboard/crm/reports`) — five report tabs (Sales Overview, Pipeline, Lead Performance, Activity Performance, Team Performance) computed from the shared deals/leads/activities/companies stores; global filter bar (date-range presets + custom range, owner, pipeline stage, lead source, company, reset); period-over-period comparisons against the prior equal-length window; deterministic reporting anchor (Aug 16, 2026) matching the mock data; clickable charts, metric cards, and table rows with drill-down Sheet; CSV export for tabular reports; archived deals excluded and archived leads tracked separately; empty states and sr-only chart summaries. See [`crm-frontend-scope.md`](./crm-frontend-scope.md).
- ✅ Industry templates (`/dashboard/crm/templates`) — frontend-only mock configuration screen for reusable templates (General Sales, Automotive, Real Estate, Recruitment, Agency, SaaS). Templates are idempotent and only add missing fields, terminology labels, pipeline stages, and saved views. They preserve all existing records and custom values and do not introduce backend persistence, auth, authorization, or billing work.
- 🔲 Email workspace — **deferred** from the current CRM frontend scope: hidden from the CRM sidebar and stripped of Email entry points (contact detail Email quick action). The `/dashboard/mail` route, page, components, icons, and mock data remain in the source tree untouched for future restoration; historical Email-type activity records remain visible in Activities and timelines as communication history. Future scope may include Google Workspace integration, Microsoft 365 integration, OAuth account connection, inbox synchronization, sending and receiving, email threads, templates, tracking, and provider webhooks — none of which are part of the current mock frontend release.

## Adding a new screen (repeatable recipe)

1. Copy the pattern from `dashboard/finance` or `dashboard/infrastructure` (see [`rules-and-conventions.md`](./rules-and-conventions.md) — never copy from `(legacy)`).
2. Create `dashboard/<screen>/page.tsx` (Server Component) + `_components/`.
3. Add nav entry in `src/navigation/sidebar/sidebar-items.ts`.
4. Add to the screens list in `docs/overview.md` and this roadmap.
5. Screenshot the result (light + dark + mobile) for the PR.
