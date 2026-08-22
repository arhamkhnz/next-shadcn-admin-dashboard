# Authorization Matrix

Status: **Planning — not implemented.** Defines the initial roles, permissions, and the permission matrix for the CRM platform. Enforcement is server-side only (see [`backend-architecture-plan.md`](./backend-architecture-plan.md) §8); any client-side checks are cosmetic mirrors, never security.

---

## 1. Model recap

- **Permission** = atomic string `resource.action` (e.g. `deals.edit`).
- **Role** = named set of permissions (data rows in `Role` / `Role Permission`, seeded — not hardcoded conditionals).
- **Membership** = user ↔ organization ↔ role.
- **Module entitlement** gates everything: a permission is exercisable **only while** the organization's entitlement for the owning module is active/trial. Permissions describe *what a role may do*; entitlements describe *what the organization owns*. They are evaluated together, entitlement first.
- Enforcement order per request: authentication → tenant context → **module entitlement** → **permission** → **ownership scope**.

### Module ownership of resources

| Module | Resources |
| --- | --- |
| `crm` | Overview, Leads, Contacts, Companies, Deals, Activities, Tasks, Calendar, Reports |
| *(platform)* | Settings, Users (organization members), Billing |

Tasks and Calendar are CRM-backed in v1 (they render the shared Activity model filtered to `type = "Task"` and calendar events), so they sit inside the `crm` module. When Chat or Email return as standalone products they register as their own modules with their own permission namespaces.

## 2. Initial roles

| Role | Intent |
| --- | --- |
| **Organization Owner** | Founder/payer. Everything, including billing, ownership transfer, organization deletion. Exactly one (transferable). Cannot be suspended or demoted by other roles. |
| **Administrator** | Runs the organization day-to-day. All CRM + member/settings management; sees billing, cannot change it; cannot delete the organization or touch the Owner. |
| **Sales Manager** | Full CRM authority org-wide: create/edit/archive/restore/assign/export anything, configure nothing. |
| **Sales Representative** | Sells. Creates and works **their own** records; views the whole organization's CRM data; no destructive or administrative power beyond their own records. |
| **Viewer** | Read-only stakeholder (e.g. finance oversight): view CRM lists/details and reports; no mutations, no exports. |

## 3. Action vocabulary

| Action | Meaning |
| --- | --- |
| `view` | See lists, details, timelines. |
| `create` | Create new records. |
| `edit` | Modify existing records (field edits, stage moves, workflows). |
| `archive` / `restore` | Soft-archive and recover (see [data model §8](./data-model-plan.md)). |
| `convert` | Lead-specific: run lead conversion. |
| `assign` | Change `ownerId` on records (reassignment), bulk-assign included. |
| `export` | Trigger CSV/data exports (audited). |
| `manage` | Administrative control of the resource itself (configuration, membership, subscription state) — distinct from record-level CRUD. |

Ownership-scoped actions (`Own`) apply only where the actor is the record's `ownerId` (or its assignee/creator for activities/tasks/notes).

## 4. Permission matrix

Legend: **Full** = org-wide · **Own** = records the user owns/is assigned · **—** = not granted.

| Permission | Owner | Administrator | Sales Manager | Sales Rep | Viewer |
| --- | :-: | :-: | :-: | :-: | :-: |
| overview.view | Full | Full | Full | Full | Full |
| leads.view · contacts.view · companies.view · deals.view · activities.view · tasks.view · calendar.view | Full | Full | Full | Full | Full |
| leads.create · contacts.create · companies.create · deals.create · activities.create · tasks.create | Full | Full | Full | Full | — |
| leads.edit · contacts.edit · companies.edit · deals.edit | Full | Full | Full | Own | — |
| leads.archive · contacts.archive · companies.archive · deals.archive | Full | Full | Full | Own | — |
| leads.restore · contacts.restore · companies.restore · deals.restore | Full | Full | Full | Own | — |
| leads.convert | Full | Full | Full | Own | — |
| leads.assign · contacts.assign · companies.assign · deals.assign · activities.assign · tasks.assign | Full | Full | Full | — | — |
| leads.export · contacts.export · companies.export · deals.export · activities.export · tasks.export | Full | Full | Full | — | — |
| reports.view | Full | Full | Full | Full | Full |
| reports.export | Full | Full | Full | — | — |
| activities.edit · tasks.edit | Full | Full | Full | Own¹ | — |
| settings.view | Full | Full | Full | — | — |
| settings.manage (org profile, pipelines/stages, tags) | Full | Full | — | — | — |
| users.view (members list) | Full | Full | Full | — | — |
| users.manage (invite, roles, suspend memberships)² | Full | Full | — | — | — |
| billing.view | Full | Full | — | — | — |
| billing.manage (plans, subscription state, cancellation)³ | Full | — | — | — | — |
| organization.delete | Full | — | — | — | — |
| ownership.transfer | Full⁴ | — | — | — | — |

¹ *Representatives may edit/complete/cancel/reschedule tasks and activities they own or that are unassigned; they cannot modify other people's.*
² *Administrators may invite/manage everyone **except** the Organization Owner. Only an Owner can suspend another Owner after transfer (there is exactly one Owner at a time).*
³ *`billing.manage` is reserved for the Owner until Stripe lands (Open Decision D3); it exists in the matrix now so the gate does not move later.*
⁴ *Transfer is initiated by the Owner and confirmed by the receiving member.*

Notes:

- Bulk operations inherit the underlying action (`bulkAssignOwner` → `.assign`, `bulkArchive` → `.archive`, …) and are capped per backend plan §8 (Open Decision D7).
- Every mutation writes an Audit Event; exports write `record.exported`.
- Granting `users.manage` never confers billing rights, and vice versa — the columns are independent.

## 5. Worked examples

| Scenario | Outcome |
| --- | --- |
| Sales Rep drags a colleague's deal to Won | Denied: `deals.edit` is Own-scoped for reps; manager or above required. |
| Sales Manager archives any company | Allowed: `companies.archive` is Full for managers. |
| Viewer opens Reports and drills into rows | Allowed (`reports.view`); CSV export button hidden and API returns `FORBIDDEN`. |
| Administrator invites a user while seats are exhausted | Denied with `SEATS_EXHAUSTED` despite `users.manage` — subscription seat count is an entitlement-side limit. |
| Any role uses Leads while org's CRM entitlement is `suspended` | Denied with `MODULE_NOT_ENTITLED`, regardless of permissions. |
| Sales Rep converts their own qualified lead | Allowed: `leads.convert` Own. Converting a teammate's lead requires manager+. |
| Sales Rep bulk-restores 30 of their own archived deals | Allowed: Own scope passes item-by-item; any foreign id in the batch fails that item with `FORBIDDEN` (partial success reported per id). |

## 6. Enforcement points

1. **Route Handlers** — guards 3–4 of the pipeline (permission + entitlement) before validation.
2. **Data-access layer** — ownership scope applied inside scoped queries (a rep's update filter includes `ownerId = ctx.userId` where the action is Own-scoped).
3. **Server Components** — same context resolution renders allowed UI only; absence of a permission hides controls but is never trusted as protection.
4. **Sidebar/navigation** — filters items by entitlement + coarse permission; presentation only ([rules-and-conventions](./rules-and-conventions.md): hiding ≠ access control).

## 7. Assumptions

1. Fixed five roles at launch; custom roles are schema-supported but not exposed (Open Decision D5).
2. "Own" means `ownerId == actor`; records with no owner are editable by anyone holding the Full-scoped action, and editable-by-rep only after assignment.
3. Reports expose org-wide aggregates to every CRM seat (matches current mock behavior where all users see team reports); per-user report restriction would be a new product decision.
