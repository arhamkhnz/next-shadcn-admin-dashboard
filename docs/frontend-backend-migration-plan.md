# Frontend ↔ Backend Migration Plan

Status: **Planning — not implemented.** Defines the staged migration of the CRM frontend from mock Zustand stores to the production backend described in [`backend-architecture-plan.md`](./backend-architecture-plan.md) and [`data-model-plan.md`](./data-model-plan.md).

Prime directive: **no mock data is deleted during early phases**, and no screen changes behavior until its backend parity is verified. The CRM remains fully usable at the end of every phase.

---

## 1. Starting point

- Server state lives in five Zustand stores seeded from co-located mock modules: `useLeadStore`, `useContactStore`, `useCompanyStore`, `useDealStore`, `useActivityStore` (activities + tasks).
- UI-only state (filters, saved views, row selection, view mode, dialog state) lives in component/store local state and **stays client-side forever** — it is not "migrated", it is re-keyed to work against fetched data.
- Reports compute metrics client-side in `report-selectors.ts` over those stores ([crm-frontend-scope §5.7](./crm-frontend-scope.md)) — metric definitions there are the contract the backend must reproduce.
- All dates render deterministically against the mock anchor (`MOCK_DATA_ANCHOR = 2026-08-16`). Real data replaces the anchor with wall-clock time; formulas stay identical.

## 2. Strategy: seams, flags, parity

1. **Resource-by-resource switching via a data-source seam.** Each screen reads through a thin hook layer (`use-leads.ts` returning `{ data, isLoading, error, … }`). During migration a per-resource flag (`DATA_SOURCE_<RESOURCE> = "mock" | "api"`, env-driven, default `mock`) selects between the existing mock-backed implementation and the new query-backed one. Unfinished resources keep working unchanged.
2. **Zustand shrinks, not dies.** Server-state fields leave the stores as resources migrate; the stores (or lighter module state) retain UI concerns until each screen's refactor lands. Preferences store is untouched throughout.
3. **Parity before removal.** A resource's mock files are removed only after its parity checklist (§6) is signed off. Removal order runs last, after all resources are live.
4. **Seeded development database** reproduces the mock datasets (deterministic generator using the same names/companies/stages/dates as the fixtures) so local development and parity comparisons are apples-to-apples.

## 3. Phases

| # | Phase | Scope | Exit criteria |
| --- | --- | --- | --- |
| 0 | **Foundation** | Database provisioned; ORM wired; schema migrated ([data model](./data-model-plan.md)); auth library integrated behind existing `/auth/*` screens (register/login/logout/email verify/reset); tenant context resolver; request pipeline skeleton; seed script; `proxy.ts` enabled with security headers + route protection. Mocks untouched. | Can register, log out/in, create an organization, invite a member, accept invite, switch organizations — all against real DB. |
| 1 | **Read APIs** | `GET /api/v1/{leads,contacts,companies,deals,activities}` + detail routes with pagination/filtering/sorting/search allowlists mirroring current saved views; archived filtering per data-model §8. | curl-able endpoints return scoped data for seeded org; cross-org ids 404; unauthenticated 401. |
| 2 | **Query layer** | Introduce TanStack Query (**new dependency — justified**: cache, retries, invalidations, optimistic updates; no equivalent installed). Query keys designed: `["org", orgId, resource, params]`. Wire read paths for Leads first (pilot), then Contacts, Companies, Deals, Activities/Tasks/Calendar. Screens render from queries; loading/error/empty states already built for mocks now bind to real states. | Each switched screen renders real data behind its flag; mock path still toggleable. |
| 3 | **Create & update mutations** | POST/PATCH endpoints with Zod validation + field allowlists; forms submit via mutations; Quick Create and all Add/Edit Sheets write through; audit events recorded. | Created records persist, appear in lists/timelines everywhere the mock store made them appear (lists, timelines, calendar, pickers). |
| 4 | **Archive & restore** | Archive/restore endpoints; Archived saved views read `archived=true`; archived indicator banners and workflow gating driven by server state; restore clears fields. | Single/bulk single-resource archive+restore behave exactly as today but survive reload. |
| 5 | **Bulk operations** | Bulk assign/stage/tag/archive/restore endpoints with per-item results and size caps; toolbar dialogs submit real batches with idempotency keys. | Bulk actions match current UX incl. partial-failure reporting. |
| 6 | **Optimistic updates, errors, cache invalidation** | `onMutate` snapshots + rollback for stage moves, task status, archives; error envelope mapped to toasts/inline errors; 401→login redirect; `MODULE_NOT_ENTITLED`→upgrade surface; targeted invalidations (mutation → list/detail/summary/report keys); org switch clears the cache root. | Failed mutations roll back visibly; no stale cross-screen data after any mutation. |
| 7 | **Deal workflows & conversion** | Stage change/won/lost/reopen endpoints writing Deal Stage History; lead conversion transaction endpoint with duplicate-conflict UX (choose existing vs create); reopen requires reason. | Time-in-stage becomes computable ("Not Available" report cells gain data); conversion preserves lead + activities and is retry-safe. |
| 8 | **Reports migration** | `/api/v1/reports/*` aggregations reproducing every metric definition verbatim (weighted pipeline 10/25/45/70%, win rate, avg deal value/cycle, stalled 14d, expected-close 30d, funnel, source/activity/team tables); global filter bar drives query params; period comparisons server-side; CSV export streams server-side (audited). Snapshot metrics labeled as today. | Report numbers match the mock-computed baseline on the seeded dataset within rounding tolerance. |
| 9 | **Mock removal** | Only after all resources pass parity (§6): flip defaults to `"api"`, delete mock modules, mock-seeded store internals, dead selector code, and per-resource flags; docs updated. | No runtime reference to mock CRM data; `npm run check` clean; all screens verified light/dark/mobile. |

Phases 0–2 block everything else; 3–5 can overlap per resource once 2 lands for that resource; 7–8 depend on 3–6; 9 is terminal.

## 4. What stays client-side

- Filters, saved-view definitions (now persisted server-side later if desired — out of scope), selection state, view toggles, dialog/sheet state, unsaved-form drafts.
- Optimistic shadows of in-flight mutations.
- Theme/layout preferences (existing system, untouched).

## 5. Error handling contract

Server envelope (`error.code/message/details/requestId`) maps centrally:

| Code | Client behavior |
| --- | --- |
| `UNAUTHENTICATED` | Redirect to login with return URL. |
| `FORBIDDEN` / `ACCOUNT_SUSPENDED` | Toast + hide action; no retry loop. |
| `MODULE_NOT_ENTITLED` | Upgrade/module-disabled surface. |
| `VALIDATION_ERROR` | Field-level errors into RHF forms. |
| `CONFLICT` | Duplicate-choice UI (conversion) or stale-reload prompt. |
| `RATE_LIMITED` | Backoff + informative toast. |
| `INTERNAL` | Generic error state with `requestId` surfaced for support. |

## 6. Parity checklist (per resource, gates mock removal)

1. List: column set, default sort, filters, saved views, search behavior, pagination density.
2. Detail: sections, timelines, related-record resolution (live-store fix semantics preserved).
3. Workflows: create/edit/stage/outcome/archive/restore/bulk produce identical visible outcomes plus persistence across reload (the delta mocks couldn't provide).
4. Summaries/KPIs equal mock-baseline values on the seeded dataset.
5. States: loading skeletons, empty, no-results, validation errors exercised against real latency/failures.
6. Light/dark/presets and mobile layouts unaffected.
7. Sign-off recorded in the roadmap progress list before deleting anything.

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Hydration/date drift when leaving the fixed anchor | Centralize "today" behind one server-provided value; keep SSR/client windows derived from it. |
| Store-era code paths missed (e.g. `getState()` lookups in cell callbacks) | Pilot resource first (Leads), codify the hook-based replacement pattern, grep-audit per resource during phase 9. |
| Metric drift in reports | Golden-file tests: run selectors over fixtures vs API output over the same seeded rows; differences must be explained, then fixed at the source. |
| New dependency (TanStack Query) | Single addition, isolated to the data layer; documented in the PR per dependency rules. |
