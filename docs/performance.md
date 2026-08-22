# Performance

Principles and checklist for keeping LynxMind fast. This is a client-heavy admin dashboard, so the biggest levers are bundle size, avoiding hydration work, and not re-rendering unnecessarily.

## What is already in place

- **React Compiler** is enabled (`reactCompiler: true` in `next.config.mjs`). Components are automatically memoized — do **not** hand-add `useMemo`/`useCallback` unless profiling proves a need.
- **`removeConsole`** strips all `console.*` calls in production builds.
- **Server Components by default** — most `page.tsx` files are server components; client boundaries are explicit.
- **Fonts via `next/font/google`** — self-hosted, no external font requests, `display: swap` semantics handled by Next.
- **`prefetch={false}`** is used on external/sidebar links to avoid wasted prefetches.
- **Print styles** are isolated to a `[data-print-root]` subtree so the invoice screen doesn't render a full page layout on screen.

## Core principles

1. **Default to Server Components.** Only add `"use client"` when a component genuinely needs browser APIs, state, or interactivity. Keep `page.tsx` composing server components.
2. **Keep client boundaries small.** Each `"use client"` file and its imports are added to the client bundle. Prefer server-rendering data-heavy widgets and passing primitives down.
3. **Trust the React Compiler.** Don't memoize by habit; memoize after measuring.
4. **Watch bundle size.** `recharts`, `@fullcalendar/react`, `@dnd-kit`, `radix-ui` are heavy. They should only be imported by the screens that need them (they already are). Verify with `npx next build` output or `@next/bundle-analyzer` when adding a new heavy dependency.
5. **Lazy load what isn't needed above the fold** (e.g. dynamic `next/dynamic` for heavy charts/modals) only when it measurably helps.
6. **Avoid `use client` modules that pull in server-only code** — keep `src/server/` and cookie helpers isolated.

## Rendering & state

- Use the **preferences store** with narrow selectors (`useShallow` + destructured slices) so only subscribed components re-render on theme/layout changes. This is already the pattern in `AppSidebar` and `LayoutControls`.
- The theme boot script mutates `data-*` attributes **before hydration**; this avoids a flash and an extra server render. Keep `RootLayout` static — do not make it dynamic (`dynamic = "force-dynamic"` or cookie reads) unless required. Currently only the dashboard layout reads cookies server-side (sidebar state + preferences), which is the correct scope.
- Preference writes are fire-and-forget (`void persistPreference(...)`) — don't block the UI on cookie writes.
- Table screens (TanStack Table) already paginate client-side; keep `pageSize` sensible for large mock datasets.

## Images & assets

- Use `next/image` (`noImgElement` is a warning in Biome). The only raw `<img>`/avatar usage is data-driven avatars — prefer `next/image` or `<Avatar>` with `Image` when adding new imagery.
- Flag icons are CSS classes (`src/styles/flag-icons/flags.css`) — no image requests.
- Keep `media/` assets optimized and compressed when committing screenshots.

## Fonts

- The registry loads **19 fonts** upfront in `src/lib/fonts/registry.ts` (`fontVars` is applied to `<body>`). Each Google font is its own `@font-face` payload.
  - **Consideration:** this is a deliberate trade-off for the font switcher feature. If build size matters, investigate loading fonts on demand or trimming the registry to the commonly used set. Re-measure after `npm run build`.

## Charts & heavy widgets

- `recharts` renders client-side. Keep chart data small, derive series with `useMemo` only when profiling shows it matters, and avoid re-creating formatters/functions inline inside render-heavy components where React Compiler doesn't help.
- The calendar (`@fullcalendar/react`) is heavy — it's isolated to the calendar route. Don't import it into shared/layout code.

## Production checks

- Run `npm run build` before shipping and read the **Route (app) sizes** and **First Load JS** per route in the build output.
- Prefer static rendering: the more routes that render `● (Static)`, the faster first paint and the cheaper the server.
- Keep the client JS of the dashboard shell (layout) small since it loads on every screen.

## Performance checklist for new screens

- [ ] `page.tsx` is a Server Component.
- [ ] Interactive parts are isolated in small client components.
- [ ] No new heavy dependency without a bundle-size review.
- [ ] No hand-rolled `useMemo`/`useCallback` without a measured need.
- [ ] Uses `next/image` for images.
- [ ] No `console.*` left in code (stripped in prod, but don't rely on it for sensitive logs).
- [ ] Data is paginated/virtualized if the list is long.
- [ ] Dark mode + light mode both render the same DOM (no client-only theme branching that could cause a hydration mismatch).
