# CRM Frontend Stabilization Audit

Date: 2026-08-21 · Scope: CRM module (`src/app/(main)/dashboard/crm`, shared Tasks/Calendar surfaces) · Mode: frontend-only, mock data, no backend changes.

## Method

Static review of every CRM route, store, form, dialog, selector, and date utility, followed by `npm run check`, `npm run build`, and SSR verification of every sidebar-visible route plus detail routes against a running dev server.

## Issues found

1. **Stale related-record lookups (architecture)** — `activity-utils.ts` built module-level `Map`s from the static mock arrays (`leads`, `contacts`, `deals`) while the app mutates live Zustand stores (`useLeadStore`, `useContactStore`, `useDealStore`, `useCompanyStore`). Any record created or renamed at runtime resolved to "Unknown lead/contact/deal" in activity lists, search haystacks, task boards, and detail pages.
2. **Same stale pattern in deal/company components** — static `contacts.find(...)`, `leads.filter(...)`, and `companyById.get(...)` lookups in `deals-columns.tsx`, `pipeline-deal-card.tsx`, `deal-pipeline.tsx`, `deal-workflows.tsx`, `deal-detail.tsx`, `companies-columns.tsx`, `company-detail.tsx`.
3. **Form pickers ignored new records** — `activity-form.tsx` and `deal-form.tsx` built Lead/Contact/Company/Deal combobox options from static arrays, so records created during the session never appeared. Worse, `activity-form`'s zod `superRefine` validated ids against the static arrays, rejecting activities linked to newly created records ("This contact no longer exists").
4. **Live-clock hydration risks** — `crm-data/period.ts` exported `today = startOfDay(new Date())`, feeding meetings, qualified-flow, attention items, and every CRM filter window. Server prerender and client hydration could compute different windows/dates (timezone or midnight crossing), producing hydration mismatches.
5. **Calendar hydration risks** — `calendar/events-data.ts` generated demo events from `startOfMonth(new Date())`; `calendar.tsx` initialized its header state from `new Date()`; FullCalendar opened on the real current month while task-overdue coloring used a pinned reference — three independent mismatch sources.
6. **Calendar navigation buttons had no accessible names** (icon-only prev/next).
7. **Lint errors** — unused imports (`activity-performance.tsx`, orphaned `crm-dashboard.tsx`), over-specified effect deps (`opportunities-section.tsx`), import ordering/format drift in several overview files.

## Issues fixed

1. `activity-utils.ts` now resolves related records through the live stores at call time (`useLeadStore.getState().getLeadById(id)` etc., including companies via `useCompanyStore`). No duplicate stores were created; archived flags now resolve for companies too.
2. All deal/company component lookups listed above now read from the live stores (hooks where inside components, `getState()` inside table cell/accessor callbacks).
3. `activity-form.tsx` / `deal-form.tsx` subscribe to store arrays for picker options; existence validation reads live store state, so newly created records can be linked immediately.
4. `period.ts` pins `today` to the shared mock-data anchor (`MOCK_DATA_ANCHOR = new Date(2026, 7, 16)`), matching the convention already used by `report-dates.ts`, all seed data files, and every screen-level `today` constant. SSR/client output is now deterministic.
5. `events-data.ts` generates demo events from the same anchor month; `calendar.tsx` initializes its header from the anchor and passes `initialDate` so FullCalendar opens on the anchor month where both demo and task events live.
6. Added `aria-label="Previous period"` / `"Next period"` to the calendar navigation buttons.
7. Fixed all lint errors; `npm run check` reports 0 errors.

## Pre-existing issues (not changed)

- Orphaned first-iteration composition (`crm-dashboard.tsx`, `kpi-cards.tsx`, `pipeline-activity.tsx`, `task-reminders.tsx`, `opportunities-section.tsx`, `attention-needed.tsx`) retained intentionally per no-delete rules; it carries cosmetic lint warnings (nested ternaries, class sort order).
- `noArrayIndexKey` warning in `deal-detail.tsx`.
- Static-to-static lookups (`task-reminders` meetings → `companyById`, `attention-items` → `companyByName`) are safe because both sides are immutable fixtures.
- `buildFlowBuckets` weekly shares are rounded independently and may not sum exactly to the period total (cosmetic, chart-only).

## Deferred limitations

- Store lookups via `getState()` inside table cell callbacks re-resolve on each render but do not themselves trigger re-renders when a *related* record changes; row data comes from subscribed stores, so this only delays cosmetic name updates until the next render of that list.
- Mock data is anchored to Aug 16, 2026; "last N days" windows are relative to that anchor, not the wall clock. This is required for deterministic rendering and matches the seeded datasets.
- No persistence: Zustand state resets on reload (by design for this phase).

## Runtime verification results

- `npm run check`: **0 errors** (7 pre-existing warnings, 8 infos).
- `npm run build`: **success**, all 40 routes compiled; every CRM route present in output.
- Dev server SSR checks (HTTP 200 + expected content):
  - `/dashboard/crm`, `/dashboard/crm/{leads,contacts,companies,deals,activities,reports}`, `/dashboard/tasks`, `/dashboard/calendar` → 200.
  - Detail routes `leads/lead-001`, `contacts/con-001`, `companies/c1`, `deals/dl-001`, `activities/act-001`, `tasks/act-00N` → 200.
  - Unknown id renders graceful "Lead not found" empty state; no crash boundaries.
  - Calendar SSR shows the pinned "August 2026" header with demo events; CRM overview KPIs render.
  - No new runtime errors in the dev log after the final code state.
