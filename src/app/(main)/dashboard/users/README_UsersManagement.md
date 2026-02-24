# 👥 Users Management Module

This module provides a **complete and fully frontend-only** user
management interface built with **Next.js**, **Shadcn/UI**, and
**TanStack Table**.

------------------------------------------------------------------------

## 🧭 Overview

-   View, search, sort, and paginate users\
-   Edit user information (name, email)\
-   Update user roles and statuses\
-   Suspend or delete users\
-   100% frontend implementation\
-   No backend required

------------------------------------------------------------------------

## 📦 Data Source

The module uses **static demo data** defined in:

src/app/(main)/dashboard/users/\_data/users.ts

It currently includes **5 predefined users** for demonstration purposes.

There is:

-   ❌ No backend detection\
-   ❌ No API calls\
-   ❌ No environment-based mode switching\
-   ❌ No automatic fallback logic

This module is intentionally designed as a **self-contained UI
feature**.

------------------------------------------------------------------------

## 🧩 Component Structure

src/app/(main)/dashboard/users/ ├─ \_components/ │ ├─ UsersTable.tsx │
├─ UserDropdown.tsx │ ├─ UserBadge.tsx │ ├─ UserActions.tsx ├─ \_data/ │
└─ users.ts ├─ columns.tsx └─ README_UsersManagement.md

------------------------------------------------------------------------

## 🚀 Quick Start

# 1. Clone

git clone
https://github.com/`<owner>`{=html}/next-shadcn-admin-dashboard.git cd
next-shadcn-admin-dashboard

# 2. Install

npm install

# 3. Run

npm run dev

# 4. Visit

http://localhost:3000/dashboard/users

You'll see a fully interactive users management interface using static
demo data.

------------------------------------------------------------------------

© 2026 -- Users Management Module
