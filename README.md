# Next.js Admin Template with TypeScript & Shadcn UI

Includes multiple dashboards, authentication layouts, customizable theme presets, and more.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=4" alt="Dashboard Screenshot">

The idea behind this dashboard aims to offer an alternative to typical admin templates. Most I came across, paid or free, felt cluttered, outdated, or too rigid in design.

I’ve taken design inspiration from various sources. Feel free to open an issue or reach out for credits.

> **View demo:** [studio admin](https://next-shadcn-admin-dashboard.vercel.app)

> [!TIP]
> I’m also working on Nuxt.js, Svelte, and React (Vite + TanStack Router) versions of this dashboard. They’ll be live soon.

## Features

- Built with Next.js 15, TypeScript, and Shadcn UI
- Responsive and mobile-friendly design
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Brutalist, and more)
- Multiple layout options (collapsible sidebar, content width variations)
- Authentication layouts and screens
- Dashboard screens for analytics, reports, and overview
- Prebuilt dashboard screens and reusable UI components  
- Includes 5 out of 15 planned screens
- RBAC (Role-Based Access Control) with config-driven UI and multi-tenant support *(planned)*

> [!NOTE]
> The default version of the dashboard uses the **shadcn neutral** theme.  
> It also supports multiple color themes inspired by [Tweakcn](https://tweakcn.com), including:
>
> - Tangerine  
> - Neo Brutalism  
> - Soft Pop  
>
> You can add more presets by following the same structure as the existing ones.

> Looking for the **Next.js 14 + Tailwind CSS v3** version?
> Check out the [`archive/next14-tailwindv3`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next14-tailwindv3) branch.  
> It uses a different color theme and isn’t actively maintained, but I’m trying to keep it updated with the latest changes and screens.

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4  
- **Components**: Shadcn UI  
- **Validation**: Zod  
- **Forms & State**: React Hook Form, Zustand  
- **Data Table**: TanStack Table  
- **Tooling**: ESLint, Prettier, Husky

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
- ✅ Authentication (4 screens)

## Colocation File System Architecture

Pages, components, and logic are grouped by feature. Each route folder contains everything it needs. Shared UI, hooks, and config live at the top level, keeping the codebase modular and scalable as the app grows.

Check out [this repo](https://github.com/arhamkhnz/next-colocation-template) for the full file structure and examples.

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard)

_Clone and deploy your own copy of this project in one click._

### Run locally

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
> This project is frequently updated. If you’re working from a fork or a previously cloned copy, check for the latest changes before syncing. Some updates may include breaking changes.

---

Feel free to open issues, feature requests, or start a discussion if you'd like to contribute or suggest improvements.


**Happy Vibe Coding!**
