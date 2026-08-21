CRM Frontend Scope

This document is the source of truth for the CRM frontend module in Studio Admin. It defines the CRM navigation, pages, workflows, UI states, and mock data required before backend implementation.

1. Purpose

Build a complete sales CRM frontend that helps a company manage leads, contacts, companies, deals, activities, and team performance.

The first implementation uses realistic mock data only. Authentication, persistence, APIs, billing, server authorization, and database architecture are explicitly outside this phase.

The CRM must feel like one connected product rather than a collection of unrelated dashboard screens.

2. Non-negotiable implementation rules

Preserve every existing route, page, component, mock dataset, and feature that belongs to another department.

Hide unrelated departments from the CRM sidebar only. Never delete their source files.

Reuse the existing dashboard shell, navigation system, layout preferences, semantic theme tokens, typography, spacing, cards, tables, forms, dialogs, drawers, charts, and interaction patterns.

Inspect the closest modern screen before implementing a new page. Never use a legacy route as a reference.

Do not modify src/components/ui/**, src/components/calendar/**, generated theme code, or legacy routes.

Keep page.tsx as a Server Component. Isolate filters, forms, tables, charts, drag and drop, and other interactions inside focused Client Components.

Keep CRM-specific code colocated inside the CRM route until a second module genuinely reuses it.

Use semantic theme tokens. Do not hardcode arbitrary colors.

New components must match the current Studio Admin visual language in light mode, dark mode, and every existing theme preset.

Do not add a dependency unless the required behavior cannot be built correctly with the installed packages.

Do not perform unrelated refactoring, file renaming, package upgrades, or cleanup during CRM tasks.

Mock frontend permission checks are visual demonstrations only and must never be described as real security.

3. CRM navigation

The CRM sidebar should expose only CRM features and useful shared productivity tools.

Primary navigation

Label

Purpose

Suggested route

Overview

Sales performance and work requiring attention

/dashboard/crm

Leads

Unqualified prospects entering the sales process

/dashboard/crm/leads

Contacts

Individual people and their relationship history

/dashboard/crm/contacts

Companies

Customer and prospect organizations

/dashboard/crm/companies

Deals

Sales opportunities in table and pipeline views

/dashboard/crm/deals

Activities

Calls, meetings, emails, notes, and follow-ups

/dashboard/crm/activities

Reports

Sales performance and conversion reporting

/dashboard/crm/reports

Shared workspace navigation

Reuse existing pages when suitable instead of cloning them:

Label

Existing capability

Tasks

Team tasks, ownership, priorities, and due dates

Calendar

Calls, meetings, demos, deadlines, and reminders

Email

DEFERRED — see section 9. Hidden from the CRM sidebar in the current release. The existing `/dashboard/mail` route, components, and mock data remain in the source tree untouched so the workspace can be restored later, but it is not part of the visible CRM product.

Chat

Internal team communication if retained in the CRM product

Hidden from the CRM sidebar

Finance, Analytics, Productivity, Ecommerce, Academy, Logistics, Infrastructure, Invoice, Users, and Roles should not appear in the initial CRM navigation unless a later CRM requirement explicitly needs them.

Their routes and source code must remain untouched.

4. Core CRM data relationships

The frontend mock data should reflect these relationships consistently:

flowchart TD
    L[Lead] -->|Qualified| C[Contact]
    L -->|Qualified| CO[Company]
    C --> D[Deal]
    CO --> D
    D --> A[Activities]
    C --> A
    CO --> A

A qualified lead can create or connect to a contact, a company, and optionally a deal. Activities can belong to a lead, contact, company, or deal.

Mock records must reuse the same names, owners, companies, stages, and identifiers across pages so the product feels connected.

5. Page specifications

5.1 CRM Overview

The current Pipeline Overview is the foundation and should be preserved rather than replaced.

Keep from the existing screen

Lead pipeline value

Qualified lead rate

Open opportunities

Lead-to-deal rate

Qualified lead flow chart

Discovery calls booked

Upcoming meetings

Monthly proposal goal

Recent opportunities table

Improvements required

Add a global period filter with options such as this month, last 30 days, this quarter, and custom range.

Add team or owner filtering.

Make metric cards link visually to their relevant pages.

Add a compact attention section for overdue activities, deals without recent activity, and leads requiring follow-up.

Keep the overview focused. Do not turn it into a long page containing every CRM feature.

Add loading skeleton, empty, and no-results states using mock state controls during development.

Main actions

Add lead

Add contact

Add company

Add deal

Schedule activity

These actions should use the existing Quick Create pattern rather than separate inconsistent buttons.

5.2 Leads

The Leads page manages prospects before they are qualified into active sales opportunities.

Summary area

Total active leads

New leads this month

Qualified rate

Average response time

Leads requiring follow-up

Main table

Recommended columns:

Lead name

Company

Email or phone

Source

Status

Score

Owner

Last activity

Next activity

Created date

Required controls

Search by person, company, email, or phone

Filter by status, source, owner, score range, creation date, and follow-up state

Sort by newest, score, last activity, and next activity

Saved-view frontend examples such as All leads, My leads, New, Unassigned, Hot, and Needs follow-up

Row selection and mock bulk actions for assign owner, change status, add tag, and archive

Import and export buttons as frontend-only demonstrations

Lead statuses

Use a clear default lifecycle:

New, Contacted, Qualified, Unqualified, Nurturing

Lead detail experience

Use a dedicated detail route or a large side sheet consistent with the existing design. It should contain:

Identity and contact information

Company and job title

Status, source, score, tags, and owner

Next action and follow-up date

Activity timeline

Notes

Related tasks

Files placeholder

Edit, assign, qualify, and archive actions

Qualify lead flow

The frontend flow should demonstrate converting a qualified lead into:

A new or existing contact

A new or existing company

An optional deal with value, stage, expected close date, and owner

No data needs to persist during this phase, but the complete interaction should be represented.

5.3 Contacts

The Contacts page stores the people the sales team communicates with.

Summary area

Total contacts

New contacts this month

Contacts with open deals

Contacts requiring follow-up

Main table

Recommended columns:

Contact

Job title

Company

Email

Phone

Lifecycle stage

Owner

Open deals

Last contacted

Next activity

Required controls

Search

Filter by company, lifecycle stage, owner, tags, and last-contacted range

Saved views such as All contacts, My contacts, Customers, Prospects, and No recent activity

Mock import, export, assignment, tagging, and archive actions

Contact detail

Profile and contact methods

Company relationship

Lifecycle stage, owner, and tags

Activity timeline

Open and closed deals

Tasks and upcoming activities

Notes

Files placeholder

Communication actions such as call and schedule meeting (email actions are deferred with the Email workspace — see section 9)

5.4 Companies

The Companies page provides an account-level view of organizations.

Summary area

Total companies

Active customers

Prospect companies

Total open pipeline value

Main table

Recommended columns:

Company

Industry

Website

Location

Company size

Primary contact

Owner

Open deals

Pipeline value

Last activity

Required controls

Search by company or domain

Filter by type, industry, size, location, owner, and activity state

Saved views such as All companies, Customers, Prospects, Partners, Inactive, and Archived

Archive and restore actions (frontend session state only; resets on browser refresh)

Company detail

Company profile and business information

Primary contact and all related contacts

Open and closed deals

Pipeline value and won revenue summary

Activity timeline

Tasks and upcoming activities

Notes

Files placeholder

Company-level custom fields placeholder

5.5 Deals

Deals represent qualified revenue opportunities. This page needs both pipeline and table views backed by the same mock records.

✅ Table view — implemented at `/dashboard/crm/deals`. Includes search, filters (stage, health, priority, owner, source), saved views (All, My Deals, Open, Closing This Month, Overdue, Closed Won, Closed Lost), sorting, pagination, summary cards, row selection, and 50 deterministic mock deals. Pipeline view is not yet implemented.

✅ Pipeline view — implemented at `/dashboard/crm/deals`. Board layout with 4 open-stage columns (Discovery, Qualified, Proposal Sent, Negotiation), drag-and-drop reordering via @dnd-kit following the existing Kanban pattern, move-to-stage context menu on each card, backward move confirmation via Change Stage dialog, forward moves update probability automatically, deal cards with name, company, value, health badge, owner avatar, expected close date, overdue indicator, primary contact, and View Deal link. View toggle (list/pipeline) in the Deals page header. Shares the same Zustand store and filter/search state as the table view. Summary cards, saved views, and filter row work in both modes. Responsive horizontal scrolling on desktop, cards stack on mobile.

✅ Add Deal / Edit Deal — unified Sheet-based form with react-hook-form + zod, Zustand store for client-side state. Add wired from Deals page header button; Edit wired from table row menu and deal detail page header. Includes company search (Popover + Command), contact search filtered by company, stage selection (open stages for Add; locked for closed deals in Edit), probability with stage-based auto-suggestion, value with currency, tags, products/line items with totals, and initial note on Add only. Frontend session state only.

✅ Deal detail — implemented at `/dashboard/crm/deals/[dealId]`. Includes deal header with stage/health badges, stage progression visualization, summary cards (value, probability, weighted value, expected close, last/next activity, source, status), tabbed activity timeline / tasks / notes sections, products table, deal information sidebar, related company link, primary contact link, empty states, loading skeleton, and Edit Deal action. Table deal name links and View Deal action route to the detail page.

Pipeline view

Use the installed drag-and-drop capability and the existing Kanban visual pattern where suitable.

Default stages:

Discovery

Qualified

Proposal sent

Negotiation

Closed won

Closed lost

Each stage column should show:

Deal count

Total stage value

Deal cards with company, value, owner, expected close date, priority, and health

A clear add-deal action

Dragging a card between stages may update local component state for demonstration. It must not pretend to persist.

Table view

Recommended columns:

Deal name

Company

Primary contact

Stage

Value

Probability

Health

Owner

Last activity

Expected close date

Required controls

Switch between pipeline and table views

Search

Filter by stage, owner, health, priority, value, and close date

Sort by value, close date, activity, and creation date

Saved views such as My deals, Closing this month, At risk, No activity, Won, and Lost

✅ Bulk owner, stage, and tag changes in table view — functional bulk actions via selection toolbar with assign owner, change stage, add tag, archive, and restore dialogs

Deal detail

✅ Deal name, company, contact, value, currency, stage, probability, and expected close date

✅ Owner, priority, health, source, and tags

✅ Stage progression display (non-interactive)

✅ Activity timeline with deterministic mock entries

✅ Tasks and next step with overdue/due today/upcoming/completed states

✅ Products and line-items with quantity, unit price, and totals

Proposal and document placeholder (deferred)

✅ Notes with author, timestamp, content, and pinned state

✅ Won, lost, stage change, and reopen actions — frontend session state only: Change Stage dialog (forward/backward with backward confirmation), Mark Won dialog (with actual close date and final value), Mark Lost dialog (with required loss reasons and custom reason), Reopen Deal dialog (with new stage, expected close date, and required reason); all with Zod validation, deterministic timeline entries, summary recalculation, saved-view updates, accessible toasts.

✅ Deal archive and restore — frontend session state only: archive/restore from row menu and detail page, Archived saved view, archived indicator banner, workflow actions disabled while archived, bulk archive/restore via toolbar, no permanent deletion

5.6 Activities

Activities give the team one place to manage all customer-facing work.

✅ Activities page — implemented at `/dashboard/crm/activities`. Includes summary cards (Upcoming, Due Today, Overdue, Completed This Month), saved views (All Activities, My Activities, Upcoming, Due Today, Overdue, Completed, Canceled), search across title/description/outcome/owner/related records, filters (Type, Status, Owner incl. Unassigned, Related Record Type, Scheduled date bucket, Priority), sorting, pagination, row actions, empty/no-results states with clear-filters action, loading skeleton, and 120 deterministic mock activities (`act-001`–`act-120`) anchored to real leads, contacts, companies, and deals, including overdue, due-today, unassigned, canceled-with-reason, completed-with-outcome, and long-title edge cases.

✅ Activity types — Call, Meeting, Email, Task, Note (Follow-up is represented through scheduled Task/Call activities rather than a distinct type).

✅ Add Activity / Edit Activity — shared Sheet-based form (`ActivityForm`) with react-hook-form + zod cross-field validation: schedule required for non-Note types, at least one related record required, positive integer duration, direction rules per type (Inbound/Outbound for Call, Incoming/Outgoing for Email), record existence checks, archived records excluded from pickers but preserved when editing, smart prefill (deal → company + primary contact; contact → company), unsaved-changes confirmation, and Note creating instantly as Completed. Wired from the Activities page header, all four CRM detail pages, and the contact detail quick actions (Call / Schedule buttons prefill type and contact; the Email quick action is deferred with the Email workspace — see section 9).

✅ Activity workflows — Mark Complete dialog (required outcome, optional completion notes, actual duration for Call/Meeting/Task), Cancel Activity dialog (optional reason), Reschedule Activity dialog (future date/time validation, returns activity to Scheduled). All frontend session state only via a centralized Zustand store seeded from mock data; no permanent deletion (cancel/reschedule instead).

✅ Activity detail — dedicated route at `/dashboard/crm/activities/[activityId]` with header badges, status-appropriate actions, description, completion details (outcome, notes, actual duration) or cancellation details, details sidebar (owner, schedule, direction, planned duration, created/updated), related-record links, empty states, loading skeleton, and `notFound()` handling.

✅ Shared timelines — lead, contact, company, and deal detail pages merge their existing static timeline entries with the shared activity store (sorted newest first) and expose an Add Activity action prefilled to the current record. Contact detail's Call/Schedule quick actions create prefilled activities (the Email quick action is deferred — see section 9). Company timeline schema extended with a `task` entry type so shared tasks render there.

5.7 Tasks

Tasks are CRM work items (follow-ups, prep, reviews) stored in the same centralized Zustand activity store as Activities (`type: "Task"`), so a task created anywhere appears everywhere immediately.

✅ Tasks page — implemented at `/dashboard/tasks` replacing the previous static demo table (demo files preserved but no longer rendered). Includes summary cards computed from the store (Open Tasks, Due Today, Overdue, Completed This Month, Unassigned), saved views (All Tasks, My Tasks, Due Today, Upcoming, Overdue, Completed, Canceled, Unassigned), search across title/description/outcome/owner/related records, filters (Status, Priority, Owner incl. Unassigned, Related Record Type, Due Date bucket, Completion State), sorting (default due date ascending), pagination, row selection with bulk actions, empty/no-results states with clear-filters action, and a List/Board layout switcher.

✅ Task list view — columns for selection checkbox, Task (status icon + title/description link to the task detail route), Status, Priority, Related To (linked record chips with archived strikethrough), Owner (avatar + name or Unassigned), Due Date (with Overdue/Due Today badges beyond color), Reminder, Last Updated, and status-gated Actions menu (View, Edit, Start Task, Mark Complete, Reschedule, Cancel Task, Reopen Task).

✅ Task board view — @dnd-kit columns for To Do / In Progress / Completed (Canceled excluded; reachable via the Canceled saved view). Cards show title, priority, overdue/due-today state, owner, due date, related records, and reminder. Dragging a card into Completed opens the required-outcome Complete dialog instead of bypassing it; card click navigates to the task detail route.

✅ Add Task / Edit Task — the shared `ActivityForm` locked to type Task (`defaultType="Task"` + `lockType`) with due date/time ("Due" labels), optional reminder date/time pair validation, priority, owner, description, and ≥1 related record requirement. New tasks start as To Do.

✅ Task workflows — Start Task (To Do → In Progress), Mark Complete dialog (required outcome, optional notes, completed-date override), Cancel Task dialog (optional reason), Reschedule dialog (future due date/time, optional reminder + reason for tasks; restores canceled tasks to To Do), Reopen Task dialog (required new due date, optional reason; clears the completed timestamp while preserving prior outcome/notes). All transitions validated by a central transition map; invalid moves are rejected with feedback instead of corrupting state.

✅ Bulk task actions — Assign Owner, Change Priority, Change Status (To Do/In Progress only), Reschedule, Complete (shared required outcome), Cancel (shared reason); selection-based dialogs following the deals bulk-action pattern.

✅ Task detail — dedicated route at `/dashboard/crm/tasks/[taskId]` with header badges, due-date display with Overdue/Due Today emphasis, status-gated actions, description, completion details (outcome, notes) or cancellation details, details sidebar (owner, due date, reminder, created/updated), related-record links, loading skeleton, and `notFound()` handling for unknown ids or non-task activities.

✅ Calendar integration — open tasks appear as timed events on `/dashboard/calendar` colored by state (sky = open, red = overdue, emerald = completed all-day "(Completed)" events); canceled tasks are omitted. Clicking a task event navigates to its task detail route via FullCalendar's event URL handling. The protected `src/components/calendar/**` wrappers were not modified.

✅ Cross-module wiring — lead, contact, company, and deal detail timelines expose an "Add Task" button opening the task-locked form prefilled to the current record; tasks created there appear on the Tasks page, board, summaries, calendar, and the record's own timeline instantly through the shared store.

Activity types

Task

Call

Meeting

Email

Note

Follow-up

Views

My upcoming activities

Overdue

Completed

All team activities

Timeline

Main table or list

Recommended fields:

Activity

Type

Related record

Owner

Due date and time

Priority

Status

Outcome

Required controls

Search

Filter by type, owner, status, priority, due date, and related record type

Mark complete

Reschedule

Reassign

Add outcome or note

Open the related CRM record

The existing Tasks and Calendar pages should be reused or connected visually. Do not build duplicate task and calendar systems inside this route.

5.7 Reports

Reports should answer practical sales questions without becoming a general analytics department.

✅ Reports & Analytics — implemented at `/dashboard/crm/reports` (sidebar entry after Activities). Five report tabs share one global filter context: Sales Overview, Pipeline, Lead Performance, Activity Performance, and Team Performance. All metrics are computed client-side from the shared deals/leads/activities/companies Zustand stores; no new data files or dependencies were added.

Global controls — date-range presets (Last 7/30/90 days, This month, Last month, This quarter, This year) plus a custom range via the existing DateRangePicker; owner, pipeline stage, lead source, and company selects; Reset filters button shown only when filters are active. Filters apply across every tab at once. Company filtering matches deals/activities by company id and leads by company name (the lead schema stores a name string).

Comparisons — period metrics compare against the prior equal-length window (e.g., Last 30 days vs the 30 days before it) with directional badges that pair icons with color so state is not color-only. Snapshot metrics (pipeline value, open deals, active/archived leads, average score/response time, overdue/stalled/expected-close counts) are labeled as current snapshots and intentionally show no comparison.

Metric definitions — weighted pipeline = open deal value × stage probability from a typed config (Discovery 10%, Qualified 25%, Proposal Sent 45%, Negotiation 70%); win rate = won ÷ all decided deals closed in range; average deal value = mean won-deal value in range; average sales cycle = mean days from creation to actual close over decided deals; expected-to-close = open deals with an expected close date within 30 days; stalled deals = open deals with no activity in 14+ days; converted leads = leads at Qualified status (explicit lead→contact conversion is not modeled, and captions say so); average response time = mean days from lead creation to last activity; task completion rate = completed ÷ all Task-type activities; average activities per deal = deal-linked activities ÷ distinct linked deals.

Data integrity rules — archived deals are excluded from every metric; archived leads are excluded from active totals but counted in a dedicated Archived Leads card; Canceled activities are excluded from completion totals; Completed tasks are never counted as overdue; activities are read once from the shared activity store so tasks never double-count through nested record arrays.

Interactions — clickable charts (won/lost donut, owner bars, stage bars), clickable table rows/buttons (stage names, sources, owners), and metric-card drill buttons open a drill-down Sheet listing matching records with links to their detail routes. Selecting an owner on the Team Performance tab focuses every report section on that owner. Lead-source, activity-owner, and team tables export to CSV client-side (Blob download, `crm-<report>_report_<from>_to_<to>.csv`).

Determinism — all reporting windows anchor to the same fixed mock-data date (Aug 16, 2026) used by the deals/leads/activities datasets, so server and client render identically with zero hydration drift. Time-series charts bucket weekly for ranges ≤31 days and monthly otherwise.

Deferred within reports — average time-in-stage per stage (requires stage-history events that the data model does not track; the stage table shows "Not Available"), target-versus-actual (no targets exist in mock data), and expected revenue by close month beyond the existing expected-close window.

Global report controls

Date range

Team or owner

Pipeline

Lead source

Compare with previous period

Mock export action

Report sections

Pipeline performance

Pipeline value by stage

Deal count by stage

Weighted pipeline value

Expected revenue by close month

Average deal size

Average sales-cycle duration

Conversion funnel

New leads

Contacted leads

Qualified leads

Deals created

Closed won

Conversion percentage between each step

Sales performance

Revenue won

Win rate

Deals won and lost

Performance by owner

Target versus actual

Leaderboard table

Source performance

Leads by source

Qualified rate by source

Deals created by source

Won revenue by source

Activity performance

Calls completed

Meetings completed

Emails recorded

Overdue activities

Activity volume by team member

Relationship between activity volume and deals won

All reports use Recharts and existing card patterns. Charts must remain readable, responsive, theme-safe, and limited to useful information.

6. Shared CRM UI patterns

6.1 Quick Create

The existing Quick Create entry should offer CRM-specific actions:

New lead

New contact

New company

New deal

New task

Log call

Schedule meeting

Add note

Forms should reuse the same dialog, drawer, fields, validation style, and footer actions.

6.2 Record activity timeline

Lead, contact, company, and deal detail experiences should reuse one consistent visual timeline pattern.

Timeline items should support calls, meetings, emails, notes, tasks, stage changes, assignments, and record creation. Mock entries must include actor, timestamp, activity type, and related details.

6.3 Ownership and teamwork

Every operational record should support a mock owner selected from the shared users dataset.

Teamwork behavior represented in the frontend should include:

Owner avatar and name

Assignment and reassignment

Mentions in notes as a visual demonstration

Shared tasks

Recent activity attribution

Team and individual filters

6.4 Search and filtering

Use consistent filter controls across all CRM pages. Active filters should be visible and removable. A clear-all action should appear when multiple filters are applied.

Search, filters, sorting, pagination, and saved views may run against local mock data during this phase.

6.5 Record detail behavior

Choose one consistent pattern for operational record details:

Dedicated routes are preferred for deep records and shareable future URLs.

Side sheets may be used for quick preview and editing.

Do not implement a different detail behavior on every page.

7. Required UI states

Every CRM page and important component must include:

Normal state

Loading skeleton

Empty state with a useful primary action

No search results state

Filtered empty state with clear-filters action

Validation error state

Disabled and submitting form states

Long-content and overflow handling

Mobile and tablet layout

Dark mode and all theme presets

Because the phase uses mock data, loading and failure states can be demonstrated through controlled local states or dedicated development fixtures.

8. Mock data requirements

Use enough realistic data to test density, filtering, pagination, and responsive behavior.

Recommended minimum:

Entity

Minimum records

Users or owners

8

Leads

80

Contacts

60

Companies

30

Deals

45

Activities

120

Requirements:

Use stable IDs.

Reuse the same related records across pages.

Include realistic empty values, long names, overdue dates, unassigned records, and edge cases.

Keep monetary values and dates internally consistent.

Use Zod schemas for mock record structures.

Keep mock data colocated with the feature that owns it unless several CRM routes truly require the same records.

Never include real personal or sensitive information.

9. Features intentionally deferred

These features should not be built during the frontend CRM phase unless separately approved:

Email workspace and provider integration (deferred from the current release)

The Email workspace (`/dashboard/mail`) is deferred from the current CRM frontend scope. It is hidden from the CRM sidebar, and Email-specific entry points (such as the contact detail Email quick action) are hidden. The route, page, components, icons, and mock data remain in the source tree untouched so the workspace can be restored later without rebuilding it.

Historical Email activity records (activities with type `Email` in the shared activity store) remain valid CRM records. They continue to appear in Activities lists, filters, and record timelines as historical communication history. What is deferred is email management itself: users cannot compose, send, sync, or manage emails in the current version. Logging an Email-type activity manually through the shared ActivityForm remains available as generic activity-type support.

A future implementation may include:

Google Workspace integration

Microsoft 365 integration

OAuth account connection

Inbox synchronization

Sending and receiving

Email threads

Templates

Tracking

Provider webhooks

None of these features are part of the current mock frontend release.

Real authentication or sessions

Database and ORM integration

API routes or external API integrations

Server-enforced RBAC or tenant isolation

Subdomain routing

Subscription billing and department entitlements

Real email sending or mailbox synchronization

Calling or telephony integration

File storage

Audit-log persistence

Workflow automation engine

Custom-field builder

Products, catalog, quoting, and advanced forecasting

Marketing campaign management

Customer support ticketing

Visual placeholders are allowed only where they help explain a future workflow. They must be clearly non-functional.

10. Recommended frontend implementation order

Implement one controlled task at a time:

CRM-only sidebar configuration without deleting other modules

CRM Overview refinement

Shared mock data model and consistent fixtures

Leads list and lead detail

Lead creation and qualification frontend flow

Contacts list, contact detail, and Add/Edit Contact frontend (session state only)

Companies list and company detail

✅ Deals table view — implemented at `/dashboard/crm/deals`

✅ Deal stage and outcome workflows — Change Stage, Mark Won, Mark Lost, Reopen Deal (frontend session state only)

✅ Deals pipeline view — board layout with drag-and-drop, view toggle, shared store with table view

✅ Deal archive and restore — frontend session state only: archive/restore from row menu and detail page, Archived saved view, archived indicator banner, workflow actions disabled while archived, bulk archive/restore via toolbar, no permanent deletion

✅ Deals bulk actions — bulk assign owner, bulk change stage, bulk add tag, bulk archive, and bulk restore; functional toolbar, selection-based dialogs, row-level assign owner via submenu

✅ Activities page — implemented at `/dashboard/crm/activities` with a shared activity store surfaced on the Activities page, the activity detail route, and the lead/contact/company/deal detail timelines (see section 5.6). Calendar remains a separate workspace page; CRM tasks now surface through the dedicated Tasks module (see section 5.7) and as calendar events.

✅ Tasks module — implemented at `/dashboard/tasks` with the task detail route at `/dashboard/crm/tasks/[taskId]`, both backed by the shared activity store filtered to `type: "Task"` (see section 5.7).

✅ Reports — implemented at `/dashboard/crm/reports` with five tabs, global filters, comparisons, drill-downs, and CSV export (see section 5.7).

Shared Quick Create actions

Loading, empty, error, responsive, accessibility, and theme verification pass

Do not ask OpenCode to build the entire CRM in one prompt. Each numbered item should be divided into small implementation prompts with explicit file scope and acceptance criteria.

11. Frontend completion criteria

The CRM frontend phase is complete when:

The CRM sidebar presents a focused CRM product while all unrelated source routes remain preserved.

Every defined CRM page exists and follows the Studio Admin design system.

Leads, contacts, companies, deals, and activities use consistent connected mock data.

Core list, detail, create, edit, filter, sort, pagination, and local demonstration workflows are represented.

Shared Tasks and Calendar capabilities are reused rather than duplicated.

Every page has loading, empty, no-results, validation, overflow, and responsive states.

Light mode, dark mode, and every theme preset remain correct.

No backend behavior, persistence, authorization, or integration is falsely represented as production-ready.

Existing non-CRM pages and components have not been deleted or unnecessarily modified.

Project documentation reflects the routes and frontend-only status accurately.