# Rules & Conventions

These are the must-follow rules for working in this repository. They are the union of `AGENTS.md`, `CONTRIBUTING.md`, the Biome configuration, and observed conventions in the codebase.

## Department scoping (hard rules)

The repository is split by **department** (CRM, Finance, and other dashboards/pages). These rules protect work that belongs to other departments.

- **Never delete** existing pages, routes, components, mock data, or features belonging to another department.
- When working on one department, unrelated departments are **only hidden from its sidebar configuration** (`src/navigation/sidebar/sidebar-items.ts`). Their source code must remain **untouched and available** for later work.
- **Hiding something from navigation is not access control.** When authentication is added later, permissions must also be enforced on the **server** (see [`security.md`](./security.md)).
- For CRM work, Finance and the other departments disappear **only from the CRM navigation experience**. Their files stay exactly where they are so they can be activated and developed later.

### Scope limits

- Always **reuse** the existing dashboard shell, shadcn components, theme tokens, typography, spacing, borders, cards, tables, forms, and interaction patterns.
- **Before creating anything**, inspect the closest existing modern screen and reuse its components and patterns.
- A new component may only be created when **no suitable existing component exists**. It must remain visually consistent with the current design system and be placed **inside the department route** unless it is genuinely reused elsewhere.
- **Never modify** `src/components/ui`, `src/components/calendar`, legacy routes, or generated theme code.
- **Every change must be small and limited to the requested department.** No unrelated refactoring, cleanup, renaming, dependency changes, or architectural modifications.

## Tooling

- Use **npm**. Do not introduce yarn/pnpm/bun.
- Run validation with: `npm run lint`, `npm run format`, `npm run check`, `npm run check:fix`.
- There is currently **no automated test command**. Run build/lint/check only when the user explicitly requests validation.
- Before any Next.js work, read the relevant doc in `node_modules/next/dist/docs/` — training data goes stale; the installed docs are the source of truth.

## Code style (enforced by Biome)

Biome is configured in `biome.json` (`vcs` + git-ignore aware). These settings are **enforced** by `check` and by the husky pre-commit hook:

- **Double quotes**, **semicolons**, **two-space indentation**, **120-character line width**.
- **Sorted imports** with explicit groups: `react/**`, then `next/**`, then packages, then `@/` aliases, then relative paths — separated by blank lines.
- Trailing commas, arrow parens always.
- TypeScript **strict mode** is enabled. Use precise types; **avoid `any`**.
- Use the `@/` import alias (`@/*` → `./src/*`).
- Do not add comments unless explicitly asked.

### Notable lint rules

- `noCommonJs` (error) — use ESM.
- `noUndeclaredDependencies`, `noUndeclaredVariables`, `noImportCycles` (error).
- `noFloatingPromises`, `noMisusedPromises` (error) — `void` async calls explicitly (e.g. `void persistPreference(...)`).
- `noParameterAssign`, `noUselessElse`, `noInferrableTypes`, `noNamespace` (error).
- `useFilenamingConvention` (error) — consistent file naming.
- `noNestedComponentDefinitions` (error) — define components at module scope.
- `useSortedClasses` (on) — Tailwind classes are sorted automatically by `check:fix`.
- `noImgElement` (warn) — use `next/image` instead of raw `<img>`.
- `noArrayIndexKey` (warn) — prefer stable keys.
- `noDangerouslySetInnerHtml` — only allowed with an explicit biome-ignore comment (see `theme-boot.tsx`).

## shadcn/ui rules

- Use the shadcn skill for any shadcn/ui component, styling, composition, registry, preset, or `components.json` work.
- This repo uses the **`radix-nova`** style; the CLI reports `base: "radix"` (Radix UI). Some wrappers use Base UI primitives. **Always inspect the local component source before use.**
- **Do not modify** `src/components/ui/**` or `src/components/calendar/**`. Keep them intact; apply styling/customization at the usage site.
- New shadcn components are added with the CLI (`npx shadcn add ...`) so they land in the right style and stay upgradeable.

## File-system / colocation conventions

- Keep feature code close to the route that owns it (see [`architecture.md`](./architecture.md) for the pattern).
- Screen-specific components, data, and schemas go in `dashboard/<screen>/_components/`.
- Shared dashboard components: `dashboard/_components/`.
- Shared application components: `src/components/`.
- Shared hooks/utilities: `src/hooks/`, `src/lib/`.
- Theme presets: `src/styles/presets/`.
- Keep a component inside its route until it is reused by another feature; do not preemptively promote code to shared folders.
- Add new screens to `src/navigation/sidebar/sidebar-items.ts` when they belong in navigation.
- Do not use `(legacy)` routes as references for new screens.

## Creating or extending a screen

1. Inspect the closest current screen first (Finance, Infrastructure, CRM, Analytics are good references).
2. When reproducing a UI from a screenshot, follow its visual direction closely, but implement with existing components and **semantic theme tokens** (see below) — never hardcode raw colors.
3. Reuse the existing dashboard shell, local components, layout controls, and theme tokens.
4. Break each page into focused components in `_components/`; keep `page.tsx` small.
5. Keep `page.tsx` a **Server Component** by default; move interactive/browser code into dedicated **Client Components**.
6. Match nearby screens in card density, borders, radius, spacing, content width, and responsive behavior.
7. Handle loading, empty, error, disabled, and overflow states.
8. Keep screens accessible: semantic HTML, keyboard support, visible focus states, labels, ARIA attributes.

## Theme & styling

- Use **semantic theme tokens** (`bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-sidebar`, `text-foreground`, etc.) so screens work in light mode, dark mode, and all presets.
- If a design needs a color not available through theme tokens (or the user explicitly requests a non-theme color), use a **named Tailwind palette color**. Do **not** use arbitrary hex/RGB/HSL/OKLCH values inline.
- Layout-dependent styling is driven by `data-*` attributes on `<html>` (e.g. `[html[data-content-layout=centered]_&>...]`, `[html[data-navbar-style=sticky]_&]`). Follow this pattern rather than adding new bespoke toggles.

## Preferences system rules

- New user-facing preferences must be added to `PREFERENCE_REGISTRY` in `src/lib/preferences/preferences-config.ts`.
- Layout-critical preferences must use `defineSSRPreference` (never `localStorage`).
- If a new theme preset is added, create a CSS file in `src/styles/presets/` with `label:` and `value:` comments and run `npm run generate:presets` (also runs on commit).
- Never hand-edit the `generated:themePresets:start/end` block in `src/lib/preferences/theme.ts`.

## Git & contributions

- Use **conventional commit prefixes**: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, etc.
- Work on a dedicated branch (`git checkout -b feature/...`) and open a PR when ready.
- Include screenshots for new screens and material visual changes — mobile and dark-theme states when relevant.
- Husky pre-commit hook runs: `generate:presets` → stages `theme.ts` → `lint-staged` (Biome check with autofix). The commit is blocked if errors remain.
- Follow `CONTRIBUTING.md` for the full contribution workflow.
- Do not commit secrets or local env files (`.env*.local` is gitignored).

## Dependency rules

- Avoid unnecessary dependencies — prefer existing utilities (e.g. `cn()`, existing components).
- Explain new dependencies and reusable patterns in the PR.
- Never hand-edit `package-lock.json`; commit regenerated lockfile changes as-is.

## Documentation

- Keep this `docs/` folder accurate as the codebase evolves.
- New screens: document them in `docs/overview.md` (screens list) and `docs/roadmap.md` when relevant.
