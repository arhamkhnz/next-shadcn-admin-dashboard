import {
  DM_Sans,
  Gabriela,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Inter,
  Manrope,
  Nunito,
  Outfit,
  Plus_Jakarta_Sans,
  Poppins,
  Roboto,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

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

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  preload: false,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  preload: false,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  preload: false,
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  preload: false,
});

const gabriela = Gabriela({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gabriela",
  preload: false,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  preload: false,
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  preload: false,
});

export const fontRegistry = {
  inter: {
    label: "Inter",
    font: inter,
  },
  roboto: {
    label: "Roboto",
    font: roboto,
  },
  poppins: {
    label: "Poppins",
    font: poppins,
  },
  geist: {
    label: "Geist",
    font: geist,
  },
  geistMono: {
    label: "Geist Mono",
    font: geistMono,
  },
  jakarta: {
    label: "Plus Jakarta Sans",
    font: jakarta,
  },
  nunito: {
    label: "Nunito",
    font: nunito,
  },
  gabriela: {
    label: "Gabriela",
    font: gabriela,
  },
  outfit: {
    label: "Outfit",
    font: outfit,
  },
  manrope: {
    label: "Manrope",
    font: manrope,
  },
  dmSans: {
    label: "DM Sans",
    font: dmSans,
  },
  greatVibes: {
    label: "Great Vibes",
    font: greatVibes,
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
