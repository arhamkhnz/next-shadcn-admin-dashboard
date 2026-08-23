# Documentation

This folder documents the LynxMind project. Start with [**Overview**](./overview.md).

| Document | Purpose |
| --- | --- |
| [Overview](./overview.md) | What this project is, the stack, exact versions, features, screens, commands. **Start here.** |
| [Architecture](./architecture.md) | Folder layout, routing groups, screen pattern, preferences & theming system, data flow. |
| [Rules & Conventions](./rules-and-conventions.md) | Must-follow coding, styling, shadcn, git, and contribution rules. |
| [Performance](./performance.md) | Performance principles, what's already optimized, and a checklist for new screens. |
| [Security](./security.md) | Security baseline, current limits (no real auth/backend), and the hardening checklist. |
| [Roadmap](./roadmap.md) | What to make next: planned features, known gaps, and a suggested order of execution. |
| [CRM Stabilization Audit](./crm-stabilization-audit.md) | Findings and fixes from the CRM frontend stabilization audit (stale lookups, hydration, a11y). |
| [Backend Architecture Plan](./backend-architecture-plan.md) | Production backend design: tenancy, authentication, modules & entitlements, API architecture, reporting, security. Phase 0A database foundation is implemented; auth/API layers are still pending. |
| [Data Model Plan](./data-model-plan.md) | Persistent entities (platform + CRM), relationships, lead conversion, deal/pipeline architecture, archive strategy. Prisma schema, migration, and deterministic seed foundation now exist. |
| [Authorization Matrix](./authorization-matrix.md) | Roles, permissions, and the full role × resource permission matrix with module-entitlement gating. |
| [Frontend ↔ Backend Migration Plan](./frontend-backend-migration-plan.md) | Staged migration from mock Zustand stores to backend data, with parity gates before mock removal. |

### Quick reference

- Stack: Next.js 16.2 (App Router) · React 19.2 · TypeScript 5.9 (strict) · Tailwind CSS v4 · shadcn/ui (`radix-nova`) · Biome 2.5
- Commands: `npm run dev` · `npm run build` · `npm run lint` · `npm run format` · `npm run check` · `npm run check:fix` · `npm run generate:presets`
- No test command exists yet — see [Roadmap](./roadmap.md).
