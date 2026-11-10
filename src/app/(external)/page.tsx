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
  title: "Studio Admin: painel administrativo open source com shadcn/ui",
  description:
    "Um painel administrativo open source e caprichado com shadcn/ui, 25+ telas e edições para Radix UI, Base UI, React Aria e TanStack Start.",
  alternates: {
    canonical: "/",
  },
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
            aria-label="Studio Admin: página inicial"
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
