import type { MetadataRoute } from "next";

const SITE_URL = "https://studio-admin.arhamkhnz.com";

const PUBLIC_ROUTES = [
  "/dashboard/default",
  "/dashboard/crm",
  "/dashboard/finance",
  "/dashboard/analytics",
  "/dashboard/productivity",
  "/dashboard/ecommerce",
  "/dashboard/academy",
  "/dashboard/logistics",
  "/dashboard/infrastructure",
  "/dashboard/file-manager",
  "/dashboard/patient-monitoring",
  "/dashboard/mail",
  "/dashboard/chat",
  "/dashboard/calendar",
  "/dashboard/kanban",
  "/dashboard/tasks",
  "/dashboard/invoice",
  "/dashboard/profile",
  "/dashboard/users",
  "/dashboard/roles",
  "/auth/v1/login",
  "/auth/v2/login",
  "/auth/v1/register",
  "/auth/v2/register",
  "/chat",
  "/mail",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
