# Qwen Code Context for `karwi-dash`

This document provides an overview of the `karwi-dash` project to assist Qwen Code in understanding its structure, purpose, and development conventions for future interactions.

## Project Overview

The `karwi-dash` project is a **Next.js 15+ (App Router)** application focused on building and extending feature-rich dashboards, particularly for a franchise management system. The core technologies are **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It integrates **Supabase** for backend services like authentication and database interactions.

While it started as a general admin template, the current primary focus is on developing a "Franchise Dashboard" for branch managers, as detailed in `FranchiseDashboard.md`. This involves managing branch-specific services, bookings, staff, and reports.

## Building and Running

This is a standard Node.js/Next.js project. The main commands are defined in `package.json` scripts:

- **Install dependencies:** `npm install`
- **Run development server:** `npm run dev` (Starts the app, usually on `http://localhost:3000`)
- **Build for production:** `npm run build`
- **Start production server:** `npm run start`
- **Lint code:** `npm run lint`
- **Format code:** `npm run format` (Formats with Prettier) or `npm run format:check` (Checks formatting)
- **Generate theme presets:** `npm run generate:presets` (Updates `src/types/preferences/theme.ts` based on CSS files in `src/styles/presets`)
- **Seed database (if applicable):** `npm run db:seed`

## Development Conventions

- **Framework:** Next.js 15+ App Router.
- **Language:** TypeScript. Ensure all code is properly typed.
- **Styling:** Tailwind CSS and shadnc/ui components (`src/components/ui`).
- **Component Architecture:**
  - Follow the existing file structure and naming conventions.
  - Use absolute imports relative to the `src` directory (e.g., `@/components/ui/button`).
  - Components should be functional components using hooks.
  - For any new feature, check the existing `_components` directory pattern. Create a `_components` directory within the relevant route folder for page-specific components.
- **State Management:**
  - **Client State:** Zustand is the primary solution (see `src/stores`).
  - **Server State:** Handled through Next.js Server Actions (see `src/server/server-actions.ts`).
- **Key Libraries & Patterns:**
  - **Data Tables:** TanStack Table (`@tanstack/react-table`) for data grids (see `src/components/data-table`).
  - **Forms:** React Hook Form (`react-hook-form`) with Zod (`zod`) for validation.
  - **Drag & Drop:** `@dnd-kit`.
  - **Charts:** `recharts`.
  - **Icons:** `lucide-react`.
- **Database & Authentication:**
  - Database schema is in `src/sql/schema.sql`.
  - Generated Supabase types are in `src/types/supabase.ts`.
  - Authentication uses Supabase Auth, implemented via Next.js middleware (`src/middleware/auth-middleware.ts`).
- **Tooling:** ESLint and Prettier are configured for code quality and formatting.
  - Run `npm run lint` and `npm run format` after modifications to ensure adherence to project standards.
- **Reusable Components:** Always reuse existing components from `src/components/ui` or local `_components` folders before creating new ones.
- **Theme Customization:** Themes are defined in CSS files within `src/styles/presets`. The `generate:presets` script parses these files to dynamically update the available theme options in `src/types/preferences/theme.ts`.
