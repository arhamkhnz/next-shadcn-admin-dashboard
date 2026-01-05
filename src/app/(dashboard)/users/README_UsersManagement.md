# 👥 Users Management Module

This module provides a **complete, autonomous, and production-ready** user management interface built with **Next.js**, **Shadcn/UI**, and **TanStack Table**.

## 🧭 Overview

- View, search, sort, and paginate users  
- Edit user information (name, email)  
- Update user roles and statuses  
- Suspend or delete users  
- Works **with or without a backend**

If no backend is available, the module automatically switches to **Demo Mode** using fake data.

## ⚙️ Dual Mode Operation

| Mode | Description | How to activate |
|------|--------------|-----------------|
| **Demo mode (default)** | Generates 25 fake users using `/src/lib/demo-users.ts`. | `.env.local`: `NEXT_PUBLIC_DEMO_MODE=true` |
| **Production mode** | Fetches real users from `/api/users` and updates via `/api/users/:id`. | `.env.local`: `NEXT_PUBLIC_DEMO_MODE=false` |

If the backend is unreachable, the system automatically falls back to demo mode and shows:
> “ℹ️ Backend unavailable — switched to demo mode”

## 🧩 Component Structure

```
src/app/users/
├─ components/
│  ├─ UsersTable.tsx
│  ├─ UserDropdown.tsx
│  ├─ UserBadge.tsx
│  ├─ UserActions.tsx
├─ columns.tsx
└─ README_UsersManagement.md
```

## 🔗 Backend Integration

Expected API routes:

| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/api/users` | Fetch all users |
| `PATCH` | `/api/users/:id` | Update user fields |

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/<owner>/next-shadcn-admin-dashboard.git
cd next-shadcn-admin-dashboard

# 2. Install
npm install

# 3. Run in demo mode
echo "NEXT_PUBLIC_DEMO_MODE=true" > .env.local
npm run dev

# 4. Visit
http://localhost:3000/users
```

✅ You’ll see a fully interactive demo table with fake users.

© 2026 – Users Management Module
