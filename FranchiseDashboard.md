You are building a Franchise Dashboard in the Karwi-Dash project using Next.js 15+, TypeScript, Tailwind CSS, Zustand, and shadcn/ui.

🎯 Objective:
This dashboard is for branch managers who can only manage their **own branch's** operations: staff, services, bookings, and local reports. Each branch operates independently — services and prices vary.

🧱 Tech Stack:

- Next.js 15+ App Router
- TypeScript
- Tailwind CSS
- Zustand (state management)
- shadcn/ui (in `src/components/ui`)
- ESLint & Prettier

📂 File Structure & Reusability Rules:

- Use **absolute imports** from `src/`
- Place local components in a `_components` folder under the route directory.
- ⚠️ **Always reuse existing components** from `src/components/ui` or any `_components` folders before creating new ones.

📊 Pages & Features:

1. **Franchise Home**
   - Branch-level KPIs: daily/weekly bookings, branch income, active washers
   - Activity logs and booking trends

2. **Service Manager**
   - Create, edit, delete services specific to this branch
   - Set custom pricing and durations

3. **Bookings**
   - See upcoming, in-progress, and completed bookings
   - Reassign washers or update booking status
   - Filter by date or status

4. **Washer Staff**
   - Manage washer profiles (add/edit/delete)
   - Track performance (ratings, bookings handled)

5. **Customer Ratings & Reviews**
   - See feedback left by customers for the branch or individual washers
   - Option to respond or escalate reviews

6. **Branch Reports**
   - Income breakdown
   - Export CSV or PDF reports
   - Track daily/weekly/monthly totals

💡 UI Guidelines:

- Follow Tailwind + shadcn/ui standards
- Build modular components with hooks
- Use Zustand for managing local state (active tab, filter state, etc.)
- Ensure responsiveness on tablet and mobile views
