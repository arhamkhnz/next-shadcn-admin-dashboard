import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Studio Admin",
  url: "https://studio-admin.arhamkhnz.com",
  repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, Studio Admin.`,
  meta: {
    title: "Studio Admin: painel administrativo open source com shadcn/ui",
    description:
      "Um painel administrativo open source e caprichado com shadcn/ui, 25+ telas e edições para Radix UI, Base UI, React Aria e TanStack Start.",
  },
};
