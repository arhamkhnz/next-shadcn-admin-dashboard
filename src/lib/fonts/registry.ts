import {
  Allura,
  Cal_Sans,
  Dancing_Script,
  Domine,
  Geist,
  Geist_Mono,
  Inter,
  Outfit,
  Playball,
  Plus_Jakarta_Sans,
  Poppins,
  Roboto,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: true });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  preload: false,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  preload: false,
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", preload: false });

const calSans = Cal_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cal-sans",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  preload: false,
});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", preload: false });

const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-domine",
  preload: false,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  preload: false,
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  preload: false,
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  preload: false,
});

const playball = Playball({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-playball",
  preload: false,
});

export const fontRegistry = {
  inter: {
    label: "Inter",
    font: inter,
  },
  jakarta: {
    label: "Plus Jakarta Sans",
    font: jakarta,
  },
  roboto: {
    label: "Roboto",
    font: roboto,
  },
  geist: {
    label: "Geist",
    font: geist,
  },
  calSans: {
    label: "Cal Sans",
    font: calSans,
  },
  poppins: {
    label: "Poppins",
    font: poppins,
  },
  outfit: {
    label: "Outfit",
    font: outfit,
  },
  domine: {
    label: "Domine",
    font: domine,
  },
  geistMono: {
    label: "Geist Mono",
    font: geistMono,
  },
  dancing: {
    label: "Dancing Script",
    font: dancing,
  },
  allura: {
    label: "Allura",
    font: allura,
  },
  playball: {
    label: "Playball",
    font: playball,
  },
} as const;

export type FontKey = keyof typeof fontRegistry;

export const fontVars = (Object.values(fontRegistry) as Array<(typeof fontRegistry)[FontKey]>)
  .map((f) => f.font.variable)
  .join(" ");

export const fontOptions = (Object.entries(fontRegistry) as Array<[FontKey, (typeof fontRegistry)[FontKey]]>).map(
  ([key, f]) => ({
    key,
    label: f.label,
    variable: f.font.variable,
  }),
);
