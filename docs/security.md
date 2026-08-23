# Security

LynxMind is currently a **frontend-first application** with a committed Phase 0A database foundation: the repository now includes a Prisma schema, an initial SQL migration, a deterministic seed, and a server-only Prisma client helper. The CRM UI is still mock-driven, there are still no API routes or real authentication flows, and the frontend is not connected to the database yet. Treat the notes below as the baseline to maintain now and the checklist to honor once real auth/data/APIs are introduced.

## Current state & honest limits

- Auth screens (`/auth/v1`, `/auth/v2`) are **UI only**. They do not authenticate anyone.
- There are no API routes and no real sessions yet.
- A database foundation now exists in `prisma/` and `src/server/db/prisma.ts`, but it is not wired into the frontend or request handling yet.
- `src/proxy.disabled.ts` is a disabled `proxy.ts` template for rewrites/redirects/headers — enabling real middleware/proxy work is a future step.
- Preferences (theme/layout) are stored in **cookies** (`client-cookie`/`server-cookie`) or **localStorage**. These values are non-sensitive UI state, but they are writable by the user — they must never be treated as trusted security data.

## Hard rules (apply now)

1. **Never commit secrets.** `.env*.local` is gitignored. If environment variables are introduced, keep example keys only and document required vars.
2. **Never log secrets/keys/tokens.** `removeConsole` strips `console.*` in production, but do not rely on it — don't log sensitive values in the first place.
3. **Validate all input with Zod.** Schemas already exist for table data (`schema.ts`). Extend this practice to any form, query param, or server action input. Reject invalid values; never trust raw input.
4. **Escape/never inject user content.** React escapes by default. The only `dangerouslySetInnerHTML` in the codebase is the **ThemeBootScript** in `src/scripts/theme-boot.tsx`, which serializes the static, code-controlled `PREFERENCE_REGISTRY` — no user input. Keep it that way; any future `dangerouslySetInnerHTML` needs a reviewed justification + biome-ignore.
5. **Server actions must be safe by default.** `src/server/server-actions.ts` writes cookies. When real mutations arrive:
   - Always run **server-side validation** (never trust client payloads).
   - Never expose `setValueToCookie`-style write actions for sensitive data.
   - Set explicit `path`, `maxAge`, and consider `httpOnly`/`secure`/`SameSite` for real session cookies.
6. **Don't trust client-side "auth".** Users/roles tables are mock data for UI. Client-side role checks are cosmetic until server-enforced authorization exists.

## When building real auth / backend (roadmap work)

- **Authentication:** use a proven solution (e.g. NextAuth/Auth.js, Better Auth, or a session-based approach with `httpOnly`+`secure`+`SameSite=Lax` cookies). Lock down the `/auth/*` and `unauthorized` routes.
- **Authorization (RBAC):** enforce access on the **server** (middleware/proxy + server components + server actions), not just by hiding UI. The planned config-driven RBAC must gate data access, not only navigation.
- **Server Actions / API routes:**
  - Validate every argument with Zod.
  - Use `revalidatePath`/`revalidateTag` instead of exposing raw mutation endpoints where possible.
  - Add rate limiting for any public mutation.
- **Headers:** when enabling `proxy.ts`, add security headers: `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a strict `Permissions-Policy`.
- **CSP:** if you set a strict CSP, allowlist Next's needs (inline scripts for the boot script, `next/image` remote hosts, Google Fonts if used).
- **Cookies vs localStorage:** keep authentication in `httpOnly` cookies. Keep only non-sensitive UI prefs (theme/layout) in the current cookie/localStorage preference system — never store tokens or user data there.
- **Images:** configure `next/image` `remotePatterns` rather than allowing arbitrary hosts; avatar URLs in `src/data/users.ts` are remote — validate/replace with owned URLs before production.
- **Dependencies:** run `npm audit` before releases; avoid unnecessary dependencies (see `rules-and-conventions.md`).

## Security checklist

- [ ] No secrets, tokens, or credentials in the repo or logs.
- [ ] Every form/action input validated server-side with Zod.
- [ ] No `dangerouslySetInnerHTML` except the reviewed boot script.
- [ ] No sensitive data in mock files (`data.ts`/`data.json`).
- [ ] Real auth uses `httpOnly`/`secure`/`SameSite` cookies; nothing sensitive in localStorage.
- [ ] RBAC enforced server-side, not just in the UI.
- [ ] Security headers in place via `proxy.ts` when enabled.
- [ ] `npm audit` clean before release.
- [ ] Remote image hosts are explicitly allowlisted in `next.config.mjs` if `next/image` is used with remote sources.
