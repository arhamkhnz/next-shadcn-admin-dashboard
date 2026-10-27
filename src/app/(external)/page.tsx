import Link from "next/link";

import type { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

import { Footer } from "./_components/footer";
import { Intro } from "./_components/intro";
import { LandingThemeSwitcher } from "./_components/landing-theme-switcher";
import { Overview } from "./_components/overview";
import { Showcase } from "./_components/showcase";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: APP_CONFIG.name,
    locale: "en_US",
    url: "/",
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
  },
};

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_CONFIG.name,
    url: new URL("/", APP_CONFIG.url).href,
  };

  // Keeps landing-page colors independent from saved dashboard theme presets.
  return (
    <main className={`${styles.landing} bg-background text-foreground min-h-screen`} data-landing-page>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD uses app configuration with HTML-sensitive characters escaped.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:gap-8 sm:p-6 md:p-8">
        <header className="flex items-start justify-between gap-4 sm:items-center sm:gap-6">
          <Link
            className="text-base font-medium tracking-tight"
            href="/"
            aria-label="Studio Admin home"
            prefetch={false}
          >
            Studio Admin
          </Link>
          <LandingThemeSwitcher />
        </header>
        <Intro />
        <Showcase />
        <Separator />
        <Overview />
        <Separator />
        <Footer />
      </div>
    </main>
  );
}
