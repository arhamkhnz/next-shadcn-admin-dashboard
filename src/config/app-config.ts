import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "TwittAudio Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, TwittAudio.`,
  meta: {
    title: "TwittAudio Admin - Control Panel",
    description:
      "TwittAudio Admin is the management dashboard for the TwittAudio social platform. Manage users, audio posts, and live rooms.",
  },
};
