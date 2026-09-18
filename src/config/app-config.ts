import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Studio Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Studio Admin.`,
  meta: {
    title: "Studio Admin: Open Source Admin Dashboard with shadcn/ui",
    description:
      "A polished open source shadcn/ui admin dashboard with 25+ screens and editions for Radix UI, Base UI, React Aria, and TanStack Start.",
  },
};
