# Next.js Admin Template built with TypeScript & Shadcn UI 

Includes multiple dashboards, authentication layouts, customizable theme presets, and more.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot">

The idea behind this dashboard aims to offer an alternative to typical admin templates. Most I came across, paid or free, felt cluttered, outdated, or too rigid in design.

I’ve taken design inspiration from various sources. Feel free to open an issue or reach out for credits.

> **View demo:** [studio admin](https://next-shadcn-admin-dashboard.vercel.app)

> [!TIP]
> I’m also working on Nuxt.js, Astro, and Svelte versions of this dashboard. They’ll be live soon.

## Overview

This project uses `Next.js 15 (App Router)`, `TypeScript`, `Tailwind CSS v4`, and `Shadcn UI` as the main stack.  
It also includes `Zod` for validation, `ESLint` and `Prettier` for linting and formatting, and `Husky` for pre-commit hooks.  

This will support `React Hook Form`, `Zustand`, `TanStack Table`, and other related utilities, and will be added with upcoming screens. RBAC (Role-Based Access Control) with config-driven UI and multi-tenant UI support are also planned as part of the feature roadmap.

The default version of the dashboard uses the **shadcn neutral** theme.  
It also supports multiple color themes inspired by [Tweakcn](https://tweakcn.com), including:

- Tangerine  
- Neo Brutalism  
- Soft Pop  

You can add more presets by following the same structure as the existing ones in the theme configuration.

> Looking for a **Next 14 + Tailwind CSS v3** version instead?  
> Check out the [`archive/next14-tailwindv3`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next14-tailwindv3) branch.  
> This branch uses a different color theme and is not actively maintained, though I'm trying to keep it updated with the latest changes and screens.

## Screens

✅ Available  
🚧 Coming Soon

### Dashboards
- ✅ Default
- ✅ CRM
- ✅ Finance
- 🚧 Analytics
- 🚧 eCommerce
- 🚧 Academy
- 🚧 Logistics

### Pages
- 🚧 Email
- 🚧 Chat
- 🚧 Calendar
- 🚧 Kanban
- 🚧 Invoice
- 🚧 Users
- 🚧 Roles
- ✅ Authentication

## Colocation File System Architecture

Pages, components, and logic are grouped by feature. Each route folder contains everything it needs. Shared UI, hooks, and config live at the top level. This keeps the codebase modular and easy to navigate as your app grows.

Check out [this repo](https://github.com/arhamkhnz/next-colocation-template) for the full file structure and examples.

## Getting Started
### You can run this dashboard locally, or deploy it instantly with Vercel.

#### Deploy with Vercel

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>  

*Click the button above to deploy your own copy of this dashboard to Vercel.*

#### To set up and run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git
   ```
   
2. **Install dependencies**
   ```bash
    npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

Once running, the app will be available at [http://localhost:3000](http://localhost:3000)


---

> [!IMPORTANT]  
> This project is frequently updated. If you’re working from a fork or previously cloned copy, check for the latest changes before syncing. Some updates may include breaking changes.

---

Feel free to open issues, feature requests, or start a discussion if you'd like to contribute or suggest improvements.

<br />

**Happy Vibe Coding!**
