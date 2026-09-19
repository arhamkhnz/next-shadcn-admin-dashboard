import Link from "next/link";

import type { Metadata } from "next";

import { Separator } from "@/components/ui/separator";

import { Footer } from "./_components/footer";
import { Intro } from "./_components/intro";
import { LandingThemeSwitcher } from "./_components/landing-theme-switcher";
import { Overview } from "./_components/overview";
import { Showcase } from "./_components/showcase";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Studio Admin: Open Source Admin Dashboard with shadcn/ui",
  description:
    "A polished open source shadcn/ui admin dashboard with 25+ screens and editions for Radix UI, Base UI, React Aria, and TanStack Start.",
};

export default function Home() {
  // Keeps landing-page colors independent from saved dashboard theme presets.
  return (
    <main className={`${styles.landing} min-h-screen bg-background text-foreground`} data-landing-page>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:gap-8 sm:p-6 md:p-8">
        <header className="flex items-start justify-between gap-4 sm:items-center sm:gap-6">
          <Link
            className="font-medium text-base tracking-tight"
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
