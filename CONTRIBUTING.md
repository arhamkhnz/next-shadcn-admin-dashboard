# Contributing to Studio Admin

Thanks for showing interest in improving **Studio Admin** (repo: `next-shadcn-admin-dashboard`).  
This guide will help you set up your environment and understand how to contribute.

---

## Overview

This project is built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**.  
The goal is to keep the codebase modular, scalable, and easy to extend.

---

## Project Layout

We use a **colocation-based file system**. Each feature keeps its own pages, components, and logic.

```
src
├── app               # Next.js routes (App Router)
│   ├── (auth)        # Auth layouts & screens
│   ├── (main)        # Main dashboard routes
│   │   └── (dashboard)
│   │       ├── crm
│   │       ├── finance
│   │       ├── default
│   │       └── ...
│   └── layout.tsx
├── components        # Shared UI components
├── hooks             # Reusable hooks
├── lib               # Config & utilities
├── styles            # Tailwind / theme setup
└── types             # TypeScript definitions
```

If you’d like a more detailed example of this setup, check out the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template), where the full structure is explained with examples.

---

## Getting Started

### Fork and Clone the Repository

1. Fork the Repository
   
Click [here](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/fork) to fork the repository.

2. Clone & Navigate to the Repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/next-shadcn-admin-dashboard.git
   cd next-shadcn-admin-dashboard
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear commit messages:
  ```bash
  git commit -m "feat: add finance dashboard screen"
  ```

- Open a Pull Request once ready.

---

## Where to Contribute

- **Screens**: Add new dashboards under `src/app/(main)/(dashboard)/`  
- **Components**: Reusable UI goes in `src/components/`  
- **Hooks**: Custom logic goes in `src/hooks/`  
- **Themes**: New presets under `src/styles/themes/`  

---

## Guidelines

- Prefer **TypeScript types** over `any`
- Run `npm run lint` & `npm run format` before committing
- Follow **Shadcn UI** style & Tailwind v4 conventions
- Keep accessibility in mind (ARIA, keyboard nav)

---

## Submitting PRs

Before opening a PR:

```bash
npm run lint
npm run type-check
npm run build
```

Make sure everything passes without errors.

---

## Questions & Support

- Report bugs or issues via [GitHub Issues](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/issues)
- Share ideas or improvements in **Discussions**

---

Your contributions keep this project growing. 🚀
