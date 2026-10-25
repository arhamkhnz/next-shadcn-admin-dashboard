import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Studio Admin",
  url: "https://studio-admin.arhamkhnz.com",
  repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, Studio Admin.`,
  meta: {
    title: "Studio Admin: Open Source shadcn/ui Admin Dashboard",
    description:
      "Free, MIT-licensed shadcn/ui admin dashboard with 25+ screens and editions for Radix UI, Base UI, React Aria, and TanStack Start.",
  },
};
