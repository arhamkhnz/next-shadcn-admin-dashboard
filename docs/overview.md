# Overview

> This document describes what this project is, the stack it uses, exact versions, and the features it ships. It is the entry point for anyone (human or agent) working in this repository.

## What this project is

**LynxMind** is a modern, open-source **admin dashboard template / starter kit** built on the Next.js App Router. It ships a complete set of prebuilt dashboards, management pages (email, chat, kanban, tasks, invoice, calendar, users, roles), authentication screens, and a fully customizable **theme + layout preference system**.

The repository is derived from [`next-shadcn-admin-dashboard`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) by Mohammed Arham Khan (MIT licensed) and lives at `DashBoard-CRM`. It is used as the foundation for a CRM-oriented admin product, so most work happening here is about extending the dashboard screens (CRM, finance, analytics, etc.) and their features.

### Primary goals

- Provide a clean, minimal, production-quality dashboard shell.
- Be **themeable**: light/dark/system modes, color presets (Tangerine, Brutalist, Soft Pop), and a wide font registry.
- Be **configurable**: sidebar variants/collapsible behavior, navbar behavior, content width — all persisted per user.
- Be **extensible**: colocated feature code so new screens are easy to add.

### License

MIT — see [`LICENSE`](../LICENSE). Copyright (c) 2024 Mohammed Arham Khan.

## Tech stack

### Framework & language

| Layer | Choice | Installed version |
| --- | --- | --- |
| Framework | Next.js (App Router) | `16.2.12` |
| UI library | React | `19.2.8` |
| Language | TypeScript (strict mode) | `5.9.3` |
| Styling | Tailwind CSS v4 | `4.3.3` |
| UI components | shadcn/ui (`radix-nova` style, `radix` base) | `shadcn@4.16.0`, `@shadcn/react@0.1.0` |
| Runtime primitives | Radix UI (`radix-ui`) + Base UI (`@base-ui/react`) | `1.6.7` / `1.6.0` |

### Core dependencies

| Package | Purpose | Version |
| --- | --- | --- |
| `lucide-react` | Icons | `1.27.0` |
| `zod` | Validation schemas | `4.4.3` |
| `react-hook-form` | Forms | `7.83.0` |
| `@hookform/resolvers` | RHF + zod glue | `5.5.7` |
| `zustand` | Client state (preferences) | `5.0.14` |
| `@tanstack/react-table` | Data tables | `8.21.3` |
| `recharts` | Charts | `3.8.0` |
| `@fullcalendar/react` | Calendar | `7.0.2` |
| `@dnd-kit/*` | Drag & drop (kanban) | `core 6.3.1`, `modifiers 9.0.0`, `sortable 10.0.0` |
| `date-fns` | Date utilities | `4.4.0` |
| `class-variance-authority` | Variant handling | `0.7.1` |
| `clsx` + `tailwind-merge` | `cn()` utility | `2.1.1` / `3.6.0` |
| `sonner` | Toasts | `2.0.7` |
| `vaul` | Drawers | `1.1.2` |
| `cmdk` | Command palette | `1.1.1` |
| `react-resizable-panels` | Resizable panels | `4.12.2` |
| `react-day-picker` | Date picker | `10.0.1` |
| `d3-geo` + `topojson-client` | Maps (logistics) | `3.1.1` / `3.1.0` |
| `simple-icons` | Brand icons | `16.27.1` |
| `geist` | Geist font + pixel variant | `1.7.2` |
| `next-themes` | Theme provider (present) | `0.4.6` |
| `temporal-polyfill` | Temporal API | `1.0.1` |
| `input-otp` | OTP input | `1.4.2` |
| `embla-carousel-react` | Carousel | `8.6.0` |

### Tooling

| Package | Purpose | Version |
| --- | --- | --- |
| `@biomejs/biome` | Lint + format + imports | `2.5.5` |
| `husky` | Git hooks | `9.1.7` |
| `lint-staged` | Pre-commit formatting | `16.4.0` |
| `typescript` | Compiler | `5.9.3` |
| `postcss` / `@tailwindcss/postcss` | CSS pipeline | `8.5.23` / `4.3.3` |
| `tw-animate-css` | Tailwind animations | `1.4.0` |
| `ts-node` | Scripts (theme preset generation) | `10.9.2` |
| `babel-plugin-react-compiler` | React Compiler support | `1.0.0` |

## Key architecture decisions

- **React Compiler is enabled** (`reactCompiler: true` in `next.config.mjs`) — do not hand-tune `useMemo`/`useCallback` prematurely.
- **`removeConsole` is stripped in production builds.**
- **Colocation-based file system**: each screen keeps its own `page.tsx` and `_components/` folder.
- **`/dashboard` redirects to `/dashboard/crm`.**
- The dashboard shell is configured as a **CRM-focused product shell** (Phase 1). The CRM sidebar shows only the CRM Overview and shared workspace tools (Tasks, Calendar, Email, Chat). All other department routes (Default, Finance, Analytics, Productivity, E-commerce, Academy, Logistics, Infrastructure, Kanban, Invoice, Users, Roles, legacy dashboards, coming-soon) **still exist** and remain reachable via their direct URLs — they are hidden only from the CRM sidebar, not removed.
- **Preferences system** (theme, layout, fonts) is persisted via cookies/localStorage and applied pre-hydration by a boot script to avoid flicker. See [`architecture.md`](./architecture.md).
- **There is no live backend integration yet.** All current screens still render local mock data (`data.ts`, `data.json`), and the auth screens remain UI-only. A Phase 0A Prisma/PostgreSQL foundation now exists in the repo, but real auth/RBAC/API wiring is still planned work (see [`roadmap.md`](./roadmap.md)).

## Features

- Responsive, mobile-friendly dashboard shell with collapsible sidebar (icon / offcanvas), three sidebar variants (sidebar / inset / floating), sticky or scroll navbar, centered or full-width content.
- Theme presets: **Default**, **Tangerine**, **Brutalist**, **Soft Pop** — each defines full light + dark CSS variable sets.
- Light / Dark / System theme modes with system preference subscription.
- 19 switchable fonts loaded via `next/font/google` + Geist pixel.
- Prebuilt dashboards and management screens (see list below).
- RBAC + multi-tenant support marked **planned** in the README.
- Print-ready invoice screen with a dedicated `@media print` stylesheet.

## Screens

| Group | Routes |
| --- | --- |
| Dashboards | `default`, `crm`, `crm/leads`, `finance`, `analytics`, `productivity`, `ecommerce`, `academy`, `logistics`, `infrastructure` |
| Pages | `mail`, `chat`, `calendar`, `kanban`, `tasks`, `invoice`, `users`, `roles` |
| Auth | `/auth/v1/login`, `/auth/v1/register`, `/auth/v2/login`, `/auth/v2/register` (UI only) |
| Legacy | `default-v1`, `crm-v1`, `finance-v1`, `analytics-v1` under `dashboard/(legacy)` |
| Misc | `coming-soon`, 404, unauthorized |

> Legacy routes live under `src/app/(main)/dashboard/(legacy)/`. Do **not** use them as references for new screens (see [`rules-and-conventions.md`](./rules-and-conventions.md)).

> [!NOTE]
> All routes listed above still exist and remain reachable via their direct URLs. The CRM sidebar (Phase 1) intentionally exposes only the CRM Overview and the shared workspace tools; the other department routes are hidden from navigation only — never deleted.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Available commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Biome lint |
| `npm run format` | Biome format (write) |
| `npm run check` | Biome check |
| `npm run check:fix` | Biome check + autofix |
| `npm run generate:presets` | Regenerate `theme.ts` preset metadata from `src/styles/presets/*.css` |
| `npm run prepare` | Install husky hooks |

## Related docs

- [Architecture](./architecture.md) — folder layout, routing, preferences & theming system, data flow.
- [Rules & Conventions](./rules-and-conventions.md) — must-follow coding and contribution rules.
- [Performance](./performance.md) — performance principles and checklist.
- [Security](./security.md) — security principles and checklist.
- [Roadmap](./roadmap.md) — what to build next and known gaps to work on.
