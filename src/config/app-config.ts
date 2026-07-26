import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Le Gloire - Event Management",
  version: packageJson.version,
  copyright: `© ${currentYear}, Le Gloire - Event Management.`,
  meta: {
    title: "Le Gloire - Event Management - Event Management and Registration System",
    description:
      "Le Gloire - Event Management is a comprehensive event management and registration system designed to streamline the planning, organization, and execution of events. With features for attendee registration, ticketing, scheduling, and analytics, it provides event organizers with the tools they need to create successful events.",
  },
};
