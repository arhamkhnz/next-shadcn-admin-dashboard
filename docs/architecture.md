# Architecture

This project follows a **colocation-based file system**: every feature keeps its pages, components, and logic inside its own route folder. Shared code lives at the top level. This keeps the codebase modular and easy to extend.

## High-level structure

```
src/
├── app/                        # Next.js App Router
│   ├── (external)/             # Public landing page
│   ├── (main)/
│   │   ├── auth/               # Auth layouts & screens (v1, v2) — UI only
│   │   ├── chat/               # Chat app
│   │   ├── dashboard/          # All dashboard screens
│   │   ├── mail/               # Email app
│   │   └── unauthorized/
│   ├── layout.tsx              # Root layout (theme boot, providers)
│   ├── globals.css             # Tailwind v4 + theme tokens + presets
│   ├── not-found.tsx
├── components/
│   ├── calendar/               # FullCalendar wrapper (do not edit)
│   └── ui/                     # 60 shadcn/ui components (do not edit)
├── config/app-config.ts        # App name/version/metadata
├── data/users.ts               # Mock users
├── hooks/                      # use-mobile, use-lg
├── lib/
│   ├── fonts/registry.ts       # next/font/google registry (19 fonts)
│   ├── preferences/            # Preference registry, storage, theme utils
│   ├── cookie.client.ts        # Client-side cookie helpers
│   ├── local-storage.client.ts # Client-side localStorage helpers
│   └── utils.ts                # cn(), getInitials(), formatCurrency()
├── navigation/sidebar/         # Sidebar config (sidebar-items.ts)
├── scripts/                    # theme-boot.tsx, generate-theme-presets.ts
├── server/server-actions.ts    # Server actions (cookie read/write, getPreference)
├── stores/preferences/         # Zustand store + provider
└── styles/
    ├── flag-icons/             # Country flag classes
    └── presets/                # brutalist.css, soft-pop.css, tangerine.css
```

## Routing groups

- `(external)` — public landing page (`/`).
- `(main)` — everything behind the dashboard shell:
  - `dashboard` — all dashboards and management pages, plus the shared dashboard layout and sidebar.
  - `auth`, `chat`, `mail` — standalone app layouts.
  - `unauthorized` — access-denied placeholder.
- Route groups (`(main)`, `(external)`) do not affect the URL.

### Dashboard layout chain

1. `src/app/layout.tsx` — root layout: applies `data-*` attributes from `PREFERENCE_DEFAULTS`, injects `<ThemeBootScript />` in `<head>`, wraps children in `TooltipProvider`, `PreferencesStoreProvider`, and a `Toaster`.
2. `src/app/(main)/dashboard/layout.tsx` — the shell: `SidebarProvider` + `AppSidebar`, sticky/scroll header with search, layout controls, theme switcher, account switcher. Reads `sidebar_variant` / `sidebar_collapsible` preferences on the server. Redirects `/dashboard` → `/dashboard/crm` via `next.config.mjs`.

### Screen pattern

Each dashboard screen follows:

```
dashboard/<screen>/
├── page.tsx                 # Server Component: composes widgets (keep small)
└── _components/             # Screen-specific components, data, schemas
    ├── <widget>.tsx
    ├── data.ts | data.json  # Mock data
    ├── schema.ts            # Zod schemas for tables
    └── columns.tsx / table.tsx
```

Rules (from `AGENTS.md`):

- Keep `page.tsx` a **Server Component** by default; move interactive/browser code into a **Client Component** (`"use client"`).
- Inspect the closest existing screen (Finance, Infrastructure, CRM, Analytics) before writing new ones.
- Do **not** use `(legacy)` routes as references for new screens.
- Do not promote screen-specific code into shared folders preemptively — move it only when a second feature reuses it.

## The preferences & theming system

This is the most distinctive subsystem. It lets users customize theme mode, preset, font, content layout, navbar style, and sidebar behavior — persisted across sessions and applied **before hydration** to avoid flicker.

### 1. Preference registry — `src/lib/preferences/preferences-config.ts`

Every preference is a typed definition:

```ts
{
  values: readonly string[];      // allowed values
  defaultValue: string;           // fallback
  persistence: "none" | "client-cookie" | "server-cookie" | "localStorage";
  attribute: `data-${string}`;    // HTML attribute it maps to
}
```

Current keys: `theme_mode`, `theme_preset`, `font`, `content_layout`, `navbar_style`, `sidebar_variant`, `sidebar_collapsible`.

Persistence rules:

- `client-cookie` → cookie written from the browser only (`cookie.client.ts`).
- `server-cookie` → cookie written through a Server Action (`server-actions.ts`).
- `localStorage` → client only, for non-layout data.
- `none` → ephemeral.

> **Important:** layout-critical preferences (`sidebar_variant`, `sidebar_collapsible`) must stay consistent during SSR, so they are defined with `defineSSRPreference` and can never use `localStorage`.

### 2. Boot script — `src/scripts/theme-boot.tsx`

Injected in `<head>` by the root layout. Reads cookies/localStorage for every preference, sets the matching `data-*` attribute on `<html>`, resolves `system` theme mode via `matchMedia`, and toggles the `.dark` class **before** React hydrates. This keeps `RootLayout` fully static and prevents theme/layout flicker.

### 3. Zustand store — `src/stores/preferences/`

- `preferences-store.ts` — vanilla store: `values`, `resolvedThemeMode`, `isSynced`, `setPreference`, `resetPreferences`. `setPreference` applies the attribute to the DOM, updates state, then persists.
- `preferences-provider.tsx` — client provider that seeds the store with SSR defaults, then re-syncs from the DOM on mount and subscribes to system theme changes when mode is `system`.
- `usePreferencesStore` — typed selector hook (must be used inside the provider).

### 4. Theme presets

- `src/styles/presets/*.css` define full light/dark token overrides scoped under `:root[data-theme-preset="..."]` / `.dark:root[data-theme-preset="..."]`, plus custom shadows and radius.
- `src/scripts/generate-theme-presets.ts` scans those CSS files for `label:`, `value:`, and `--primary` comments/values and regenerates the `THEME_PRESET_OPTIONS` block in `src/lib/preferences/theme.ts`. Run `npm run generate:presets` after adding a preset; it also runs automatically on commit via the husky `pre-commit` hook.

### 5. Server actions — `src/server/server-actions.ts`

- `getValueFromCookie` / `setValueToCookie` — low-level cookie access.
- `getPreference(key)` — returns the persisted value for a preference (or its default) using `next/headers` cookies. Used by the dashboard layout to render the correct sidebar variant server-side.

## Sidebar & navigation

- `src/navigation/sidebar/sidebar-items.ts` — the single source of truth for nav groups/items. Add new screens here when they should appear in navigation (`NavGroup`, `NavMainItem`, `NavSubItem`).
- The sidebar is currently configured as a **CRM product shell** (Phase 1): a `CRM` group (Overview → `/dashboard/crm`) and a `Workspace` group (Tasks, Calendar, Email, Chat). All other department routes (Default, Finance, Analytics, Productivity, E-commerce, Academy, Logistics, Infrastructure, Kanban, Invoice, Users, Roles, legacy dashboards, coming-soon) still exist and remain reachable via their direct URLs — they are hidden only from the CRM sidebar, not removed. Their source files must remain untouched.
- `src/app/(main)/dashboard/_components/sidebar/` — `AppSidebar`, `NavMain`, `NavUser`, `AccountSwitcher`, `SearchDialog`, `ThemeSwitcher`, `LayoutControls`. The GitHub repository shortcut and the `SidebarSupportCard` are intentionally not rendered in the CRM shell but their components/source remain available.
- Layout controls (`LayoutControls`) drive every preference through the store: theme preset, fonts, theme mode, page layout, navbar behavior, sidebar style, sidebar collapse mode, and "Restore defaults".

## Fonts

- `src/lib/fonts/registry.ts` loads 19 Google Fonts + Geist Pixel via `next/font/google`. Each registers a `--font-*` CSS variable. The active font is selected via the `font` preference and applied in `globals.css` under `html[data-font="..."] body { --font-sans: var(--font-...) }`.
- `fontVars` is applied on `<body>` so every variable is available.

## Data flow (current, mock-only)

- All screen data is static: `data.ts` / `data.json` modules co-located with each screen.
- Tables use `@tanstack/react-table` with Zod schemas for types/validation (`schema.ts`).
- There are **no API routes or real authentication** yet. A Prisma/PostgreSQL foundation now exists under `prisma/` plus `src/server/db/prisma.ts`, but the UI is still mock-driven and not connected to it yet. `src/proxy.disabled.ts` is a disabled template (`src/proxy.ts`) for rewrites/redirects/headers.

## What not to touch

- `src/components/ui/**` and `src/components/calendar/**` — generated/local shadcn components. Style them at usage sites instead.
- The `generated:themePresets:start/end` block in `src/lib/preferences/theme.ts` — script-managed.
- `package-lock.json` — commit it but never hand-edit it.
