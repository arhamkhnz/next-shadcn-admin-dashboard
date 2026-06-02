# Roles Management Module

## Overview

This module provides a frontend-only Roles Management interface under:

`src/app/(main)/dashboard/roles`

It follows the project's colocation architecture and is fully isolated from RBAC logic.

---

## Current Features

- CRUD UI using a static dataset
- TanStack Table integration
- Status badge display
- Permissions display (read-only)
- Dialog-based create/edit
- Sidebar integration

---

## Architecture Notes

- Fully colocated within the dashboard route
- No imports from `@/lib/rbac`
- No backend persistence
- No permission enforcement

This module is intentionally self-contained and prepared for future RBAC integration without introducing coupling.