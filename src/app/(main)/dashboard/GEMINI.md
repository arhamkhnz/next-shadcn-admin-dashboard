# Gemini Customization: Dashboard Development

This file provides specific instructions for developing the CRM and Finance dashboards within the Karwi-Dash project.

## Dashboard Development Guidelines

- **CRM Dashboard:** Located in `src/app/(main)/dashboard/crm`. This dashboard is for managing customer relationships. Key components and logic are in `src/app/(main)/dashboard/crm/_components`.
- **Finance Dashboard:** Located in `src/app/(main)/dashboard/finance`. This dashboard is for financial data visualization. Key components and logic are in `src/app/(main)/dashboard/finance/_components`.

### Reusable Components

- **Data Tables:** Use the `DataTable` component from `src/components/data-table/data-table.tsx`. See the existing implementation in the CRM dashboard for usage examples.
- **UI Components:** Leverage the `shadcn/ui` components from `src/components/ui` for all UI elements.
- **Layout:** The main dashboard layout is defined in `src/app/(main)/dashboard/layout.tsx`. The sidebar is in `src/app/(main)/dashboard/_components/sidebar`.

### State Management

- Use the Zustand store in `src/stores/preferences` for managing user preferences related to the dashboards (e.g., layout, theme).

### Data

- For now, use the mock data provided in `src/data`. Server actions for data fetching are in `src/server/server-actions.ts`.
