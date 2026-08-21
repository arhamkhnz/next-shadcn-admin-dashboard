# Documentation

This folder documents the Studio Admin project. Start with [**Overview**](./overview.md).

| Document | Purpose |
| --- | --- |
| [Overview](./overview.md) | What this project is, the stack, exact versions, features, screens, commands. **Start here.** |
| [Architecture](./architecture.md) | Folder layout, routing groups, screen pattern, preferences & theming system, data flow. |
| [Rules & Conventions](./rules-and-conventions.md) | Must-follow coding, styling, shadcn, git, and contribution rules. |
| [Performance](./performance.md) | Performance principles, what's already optimized, and a checklist for new screens. |
| [Security](./security.md) | Security baseline, current limits (no real auth/backend), and the hardening checklist. |
| [Roadmap](./roadmap.md) | What to make next: planned features, known gaps, and a suggested order of execution. |
| [CRM Stabilization Audit](./crm-stabilization-audit.md) | Findings and fixes from the CRM frontend stabilization audit (stale lookups, hydration, a11y). |

### Quick reference

- Stack: Next.js 16.2 (App Router) · React 19.2 · TypeScript 5.9 (strict) · Tailwind CSS v4 · shadcn/ui (`radix-nova`) · Biome 2.5
- Commands: `npm run dev` · `npm run build` · `npm run lint` · `npm run format` · `npm run check` · `npm run check:fix` · `npm run generate:presets`
- No test command exists yet — see [Roadmap](./roadmap.md).
