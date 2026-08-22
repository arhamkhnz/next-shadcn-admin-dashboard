import localFont from "next/font/local";

import { GeistPixelSquare } from "geist/font/pixel";

type FontDefinition = {
  className: string;
  variable: string;
};

function createFont(variable: string): FontDefinition {
  return {
    className: "",
    variable,
  };
}

const dmSans = localFont({
  src: [
    {
      path: "./files/DMSans-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const figtree = localFont({
  src: [
    {
      path: "./files/Figtree-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-figtree",
  display: "swap",
});

const inter = createFont("--font-inter");
const notoSans = createFont("--font-noto-sans");
const roboto = createFont("--font-roboto");
const geist = createFont("--font-geist");
const outfit = createFont("--font-outfit");
const geistMono = createFont("--font-geist-mono");
const nunitoSans = createFont("--font-nunito-sans");
const raleway = createFont("--font-raleway");
const publicSans = createFont("--font-public-sans");
const jetBrainsMono = createFont("--font-jetbrains-mono");
const notoSerif = createFont("--font-noto-serif");
const robotoSlab = createFont("--font-roboto-slab");
const merriweather = createFont("--font-merriweather");
const lora = createFont("--font-lora");
const playfairDisplay = createFont("--font-playfair-display");

export const fontRegistry = {
  geist: {
    label: "Geist",
    font: geist,
  },
  inter: {
    label: "Inter",
    font: inter,
  },
  notoSans: {
    label: "Noto Sans",
    font: notoSans,
  },
  nunitoSans: {
    label: "Nunito Sans",
    font: nunitoSans,
  },
  figtree: {
    label: "Figtree",
    font: figtree,
  },
  roboto: {
    label: "Roboto",
    font: roboto,
  },
  raleway: {
    label: "Raleway",
    font: raleway,
  },
  dmSans: {
    label: "DM Sans",
    font: dmSans,
  },
  publicSans: {
    label: "Public Sans",
    font: publicSans,
  },
  outfit: {
    label: "Outfit",
    font: outfit,
  },
  geistMono: {
    label: "Geist Mono",
    font: geistMono,
  },
  geistPixelSquare: {
    label: "Geist Pixel Square",
    font: GeistPixelSquare,
  },
  jetBrainsMono: {
    label: "JetBrains Mono",
    font: jetBrainsMono,
  },
  notoSerif: {
    label: "Noto Serif",
    font: notoSerif,
  },
  robotoSlab: {
    label: "Roboto Slab",
    font: robotoSlab,
  },
  merriweather: {
    label: "Merriweather",
    font: merriweather,
  },
  lora: {
    label: "Lora",
    font: lora,
  },
  playfairDisplay: {
    label: "Playfair Display",
    font: playfairDisplay,
  },
} as const;

export type FontKey = keyof typeof fontRegistry;

export const fontKeys = Object.keys(fontRegistry) as FontKey[];

export const fontVars = Object.values(fontRegistry)
  .map(({ font }) => font.variable)
  .join(" ");

export const fontOptions = fontKeys.map((key) => ({
  key,
  label: fontRegistry[key].label,
}));
